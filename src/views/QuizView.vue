<script setup>
import { computed, ref } from 'vue'
import QuizHeader from '../components/QuizHeader.vue'
import QuestionCard from '../components/QuestionCard.vue'
import QuizControls from '../components/QuizControls.vue'
import { questions } from '../data/questions'

const currentIndex = ref(0)
const answers = ref({})
const isFinished = ref(false)

const hasQuestions = computed(() => questions.length > 0)
const currentQuestion = computed(() => questions[currentIndex.value] || null)
const selectedValue = computed(() => {
  const question = currentQuestion.value
  if (!question) return ''
  return answers.value[question.id] || ''
})
const canGoBack = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => selectedValue.value !== '')
const isLastQuestion = computed(() => currentIndex.value === questions.length - 1)

const handleAnswer = (value) => {
  const question = currentQuestion.value
  if (!question) return

  answers.value = {
    ...answers.value,
    [question.id]: value,
  }
}

const nextQuestion = () => {
  if (!canGoNext.value) return

  if (isLastQuestion.value) {
    isFinished.value = true
    return
  }

  currentIndex.value += 1
}

const previousQuestion = () => {
  if (!canGoBack.value) return
  currentIndex.value -= 1
}

const restartQuiz = () => {
  currentIndex.value = 0
  answers.value = {}
  isFinished.value = false
}
</script>

<template>
  <main class="container">
    <section v-if="!hasQuestions" class="card">
      <h1>Quiz indisponible</h1>
      <p>Aucune question n est disponible pour le moment.</p>
    </section>

    <template v-else-if="!isFinished">
      <QuizHeader :current="currentIndex + 1" :total="questions.length" />
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :selected-value="selectedValue"
        @answer="handleAnswer"
      />
      <QuizControls
        :can-go-back="canGoBack"
        :can-go-next="canGoNext"
        :is-last-question="isLastQuestion"
        @previous="previousQuestion"
        @next="nextQuestion"
      />
    </template>

    <section v-else class="card">
      <h1>Fin du quiz</h1>
      <p>Merci ! Tes reponses ont bien ete enregistrees.</p>
      <button class="button button-primary" type="button" @click="restartQuiz">Recommencer</button>
    </section>
  </main>
</template>
