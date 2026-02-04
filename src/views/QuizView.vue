<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AnswersList from '../components/AnswersList.vue'
import QuestionCard from '../components/QuestionCard.vue'
import QuizControls from '../components/QuizControls.vue'
import QuizHeader from '../components/QuizHeader.vue'
import ResultScreen from '../components/ResultScreen.vue'
import { useQuiz } from '../composables/useQuiz'
import { useTheme } from '../composables/useTheme'

const quiz = useQuiz()
const { isDark, initTheme, toggleTheme } = useTheme()

const audioStatus = ref('')
const isAudioPlaying = ref(false)
const questionImageLoading = ref(false)
const audioPlayer = new Audio()
let speechUtterance = null

const onAudioEnded = () => {
  isAudioPlaying.value = false
  audioStatus.value = 'Audio prêt'
}

const onAudioError = () => {
  isAudioPlaying.value = false
  if (quiz.currentQuestion.value?.text) {
    speakQuestion(quiz.currentQuestion.value.text)
  } else {
    audioStatus.value = 'Audio introuvable'
  }
}

const isIntroScreen = computed(() => quiz.screen.value === 'intro')
const isQuestionScreen = computed(() => quiz.screen.value === 'question')
const isResultScreen = computed(() => quiz.screen.value === 'result')

const audioAvailable = computed(() => {
  const question = quiz.currentQuestion.value
  if (!question) {
    return false
  }

  if (quiz.currentTheme.value?.disableAudio || question.disableAudio) {
    return false
  }

  if (question.audioSrc) {
    return true
  }

  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

function stopAudio(showStatus = false) {
  if (!audioPlayer.paused) {
    audioPlayer.pause()
    audioPlayer.currentTime = 0
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }

  isAudioPlaying.value = false
  if (showStatus) {
    audioStatus.value = 'Lecture arrêtée'
  }
}

function speakQuestion(text) {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    audioStatus.value = 'Synthèse vocale indisponible'
    return
  }

  stopAudio()
  speechUtterance = new SpeechSynthesisUtterance(text)
  speechUtterance.lang = 'fr-FR'

  speechUtterance.onstart = () => {
    isAudioPlaying.value = true
    audioStatus.value = 'Lecture en cours'
  }

  speechUtterance.onend = () => {
    isAudioPlaying.value = false
    audioStatus.value = 'Synthèse vocale prête'
  }

  speechUtterance.onerror = () => {
    isAudioPlaying.value = false
    audioStatus.value = 'Synthèse vocale indisponible'
  }

  window.speechSynthesis.speak(speechUtterance)
}

function playQuestionAudio() {
  if (!audioAvailable.value || !quiz.currentQuestion.value) {
    return
  }

  if (isAudioPlaying.value) {
    stopAudio(true)
    return
  }

  const audioSrc = quiz.currentQuestion.value.audioSrc
  if (audioSrc) {
    stopAudio()
    if (audioPlayer.src !== audioSrc) {
      audioPlayer.src = audioSrc
    }

    audioPlayer
      .play()
      .then(() => {
        isAudioPlaying.value = true
        audioStatus.value = 'Lecture en cours'
      })
      .catch(() => {
        speakQuestion(quiz.currentQuestion.value.text)
      })
    return
  }

  speakQuestion(quiz.currentQuestion.value.text)
}

function revealHint() {
  quiz.revealHint()
}

function selectAnswer(index) {
  quiz.selectAnswer(index)
}

function startQuiz() {
  quiz.start(quiz.selectedThemeId.value)
}

function restartTheme() {
  quiz.restart()
}

function shareToTwitter() {
  window.open(quiz.tweetIntentUrl.value, '_blank', 'noopener,noreferrer')
}

function onQuestionImageLoaded() {
  questionImageLoading.value = false
}

function onQuestionImageError() {
  questionImageLoading.value = false
}

watch(
  () => quiz.currentQuestion.value,
  (question) => {
    stopAudio()
    if (!question) {
      questionImageLoading.value = false
      audioStatus.value = ''
      return
    }

    questionImageLoading.value = Boolean(question.promptImage)

    if (audioAvailable.value) {
      audioStatus.value = question.audioSrc ? 'Audio prêt' : 'Synthèse vocale prête'
    } else {
      audioStatus.value = ''
    }
  },
  { immediate: true }
)

onMounted(() => {
  initTheme()
  document.body.classList.add('is-loaded')
  audioPlayer.addEventListener('ended', onAudioEnded)
  audioPlayer.addEventListener('error', onAudioError)
})

onBeforeUnmount(() => {
  stopAudio()
  audioPlayer.removeEventListener('ended', onAudioEnded)
  audioPlayer.removeEventListener('error', onAudioError)
})
</script>

<template>
  <div class="top-controls">
    <button
      id="theme-toggle"
      class="theme-toggle"
      :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
      type="button"
      @click="toggleTheme"
    >
      <span class="sr-only">Basculer le thème</span>
    </button>
  </div>

  <main class="app">
    <header class="hero">
      <p class="eyebrow">Quiz interactif</p>
      <h1>Quiz Dynamique</h1>
      <p class="lead">
        Testez vos connaissances et tentez le mode contre-la-montre pour un maximum d'adrénaline.
      </p>
    </header>

    <section v-if="isIntroScreen" id="intro-screen" class="card screen screen-visible">
      <p class="notice">
        Choisissez votre rythme, puis lancez la session pour battre votre meilleur score.
      </p>

      <div class="theme-picker">
        <div class="theme-picker__header">
          <h3 class="theme-title">Choisis un thème</h3>
          <p class="theme-hint">20 questions par thème, difficulté progressive.</p>
        </div>

        <div class="theme-grid" role="radiogroup" aria-label="Choix du thème">
          <label v-for="theme in quiz.themes.value" :key="theme.id" class="theme-card">
            <input v-model="quiz.selectedThemeId.value" type="radio" name="quiz-theme" :value="theme.id" />
            <span class="theme-card__body">
              <span class="theme-card__title">{{ theme.label }}</span>
              <span class="theme-card__desc">{{ theme.description }}</span>
            </span>
          </label>
        </div>
      </div>

      <p class="score-line">
        <span>Meilleur score :</span>
        <span>{{ quiz.bestScore.value }}</span>
      </p>

      <div class="settings">
        <label class="mode-toggle">
          <input v-model="quiz.flashcardToggle.value" type="checkbox" />
          <span>Mode Flashcard (entraînement sans timer ni score)</span>
        </label>

        <label class="mode-toggle">
          <input v-model="quiz.infiniteToggle.value" type="checkbox" />
          <span>Mode infini (questions aléatoires sans limite)</span>
        </label>

        <label class="mode-toggle">
          <input v-model="quiz.timeTrialToggle.value" type="checkbox" />
          <span>Mode contre-la-montre (temps global)</span>
        </label>

        <label class="mode-config">
          <span>Durée du mode contre-la-montre (secondes)</span>
          <input
            v-model.number="quiz.timeTrialDuration.value"
            type="number"
            min="30"
            max="900"
            step="1"
          />
        </label>
      </div>

      <button id="start-btn" class="btn btn-primary" type="button" @click="startQuiz">
        Commencer le quiz
      </button>
    </section>

    <section v-else-if="isQuestionScreen" id="question-screen" class="card screen screen-visible">
      <QuizHeader
        :question-index="quiz.questionIndexDisplay.value"
        :total-label="quiz.totalQuestionsLabel.value"
        :theme-label="quiz.currentTheme.value?.label || ''"
        :progress-percent="quiz.progressPercent.value"
        :show-global-timer="quiz.shouldShowGlobalTimer.value"
        :show-question-timer="quiz.shouldShowQuestionTimer.value"
        :global-time-left="quiz.globalTimeLeft.value"
        :time-left="quiz.timeLeft.value"
        :global-timer-warning="quiz.isGlobalTimerWarning.value"
        :question-timer-warning="quiz.isQuestionTimerWarning.value"
      />

      <QuestionCard
        :question="quiz.currentQuestion.value"
        :is-image-question="quiz.isImageQuestion.value"
        :image-loading="questionImageLoading"
        :audio-available="audioAvailable"
        :audio-playing="isAudioPlaying"
        :audio-status="audioStatus"
        :show-hint-button="quiz.hasHintButton.value"
        :can-reveal-hint="quiz.canRevealHint.value"
        :hint-visible="quiz.hintVisible.value"
        :hint-text="quiz.activeHint.value"
        :hint-status="quiz.hintStatus.value"
        @play-audio="playQuestionAudio"
        @reveal-hint="revealHint"
        @image-load="onQuestionImageLoaded"
        @image-error="onQuestionImageError"
      />

      <AnswersList
        :answers="quiz.currentQuestion.value?.answers || []"
        :selected-index="quiz.selectedAnswer.value"
        :correct-index="quiz.correctAnswerIndex.value"
        :locked="quiz.selectedAnswer.value !== null || quiz.canGoNext.value && !quiz.isFlashcardMode.value"
        :image-mode="quiz.isImageQuestion.value"
        @select="selectAnswer"
      />

      <QuizControls
        :show-next="quiz.shouldShowNextButton.value"
        :can-next="quiz.canGoNext.value"
        @next="quiz.next"
        @restart-theme="restartTheme"
        @back-home="quiz.goHome"
      />
    </section>

    <ResultScreen
      v-else-if="isResultScreen"
      :score-label="quiz.scoreLabel.value"
      :best-score="quiz.bestScore.value"
      :stats-summary="quiz.statsSummary.value"
      :stats-entries="quiz.statsEntries.value"
      :rewards="quiz.rewards.value"
      @restart="quiz.restart"
      @share="shareToTwitter"
    />
  </main>
</template>
