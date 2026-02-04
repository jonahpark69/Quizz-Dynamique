<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AnswersList from '../components/AnswersList.vue'
import QuestionCard from '../components/QuestionCard.vue'
import QuizControls from '../components/QuizControls.vue'
import QuizFooter from '../components/QuizFooter.vue'
import QuizHeader from '../components/QuizHeader.vue'
import QuizLayout from '../components/QuizLayout.vue'
import { useQuiz } from '../composables/useQuiz'

const quiz = useQuiz()

const selectAudio = ref(null)
const finishAudio = ref(null)

const introThemes = computed(() => quiz.availableThemes.value)
const isIntro = computed(() => quiz.view.value === 'intro')
const isQuestion = computed(() => quiz.view.value === 'question')
const isResult = computed(() => quiz.view.value === 'result')

const questionSubtitle = computed(() => {
  if (!quiz.currentTheme.value) {
    return ''
  }

  return `Theme: ${quiz.currentTheme.value.label || quiz.currentTheme.value.id}`
})

function playAudio(audioRef) {
  if (!audioRef.value) {
    return
  }

  audioRef.value.currentTime = 0
  audioRef.value.play().catch(() => {})
}

function startTheme(themeId) {
  quiz.start(themeId)
}

function onSelectAnswer(index) {
  const selected = quiz.selectAnswer(index)
  if (selected) {
    playAudio(selectAudio)
  }
}

watch(
  () => quiz.isFinished.value,
  (finishedNow, finishedBefore) => {
    if (finishedNow && !finishedBefore) {
      playAudio(finishAudio)
    }
  }
)

onMounted(() => {
  selectAudio.value = new Audio('/legacy/audio/select.mp3')
  finishAudio.value = new Audio('/legacy/audio/finish.mp3')
})

onBeforeUnmount(() => {
  ;[selectAudio.value, finishAudio.value].forEach((audio) => {
    if (!audio) {
      return
    }
    audio.pause()
    audio.src = ''
  })
})
</script>

<template>
  <QuizLayout :is-finished="quiz.isFinished.value">
    <section v-if="isIntro" class="quiz-intro">
      <header class="quiz-intro__header">
        <h1 class="quiz-intro__title">Choisis un theme</h1>
        <p class="quiz-intro__text">
          Les themes et questions viennent de `src/data/themes.js` (a remplacer par la migration legacy).
        </p>
      </header>

      <ul class="quiz-intro__themes">
        <li v-for="theme in introThemes" :key="theme.id" class="quiz-intro__theme-card">
          <h2>{{ theme.label || theme.id }}</h2>
          <p>{{ theme.description }}</p>
          <button type="button" class="quiz-controls__button quiz-controls__button--primary" @click="startTheme(theme.id)">
            Commencer
          </button>
        </li>
      </ul>
    </section>

    <template v-else-if="isQuestion && quiz.currentQuestion.value">
      <QuizHeader
        title="Quiz Dynamique"
        :subtitle="questionSubtitle"
        :current-index="quiz.currentIndex.value"
        :total="quiz.questions.value.length"
        :score="quiz.score.value"
        :best-score="quiz.bestScore.value"
        :time-left="quiz.timeLeft.value"
        :global-time-left="quiz.globalTimeLeft.value"
        :timer-warning="quiz.timerIsWarning.value"
        :progress-percent="quiz.progressPercent.value"
      />

      <QuestionCard
        :question="quiz.currentQuestion.value"
        :current-index="quiz.currentIndex.value"
        :total="quiz.questions.value.length"
      >
        <AnswersList
          :answers="quiz.currentQuestion.value.answers"
          :selected-index="quiz.selectedAnswer.value"
          :locked="quiz.selectedAnswer.value !== null"
          :correct-answer-index="quiz.correctAnswerIndex.value"
          @select="onSelectAnswer"
        />
      </QuestionCard>

      <QuizControls mode="question" :can-next="quiz.canNext.value" @next="quiz.next()" />
    </template>

    <template v-else-if="isResult">
      <section class="question-card question-card--end">
        <h2 class="question-card__title">Resultat</h2>
        <p>Theme: {{ quiz.currentTheme.value?.label || quiz.currentThemeId.value }}</p>
        <p>Score final: {{ quiz.score.value }} / {{ quiz.questions.value.length }}</p>
        <p>Meilleur score: {{ quiz.bestScore.value }}</p>
      </section>

      <QuizControls mode="result" @restart="quiz.restart()" @home="quiz.goHome()" />
      <QuizFooter
        :score="quiz.score.value"
        :best-score="quiz.bestScore.value"
        :total="quiz.questions.value.length"
        :is-finished="quiz.isFinished.value"
      />
    </template>
  </QuizLayout>
</template>
