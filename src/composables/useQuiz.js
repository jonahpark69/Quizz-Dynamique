import { computed, onBeforeUnmount, ref } from 'vue'
import themesData from '../data/themes'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'
import { startTimer } from '../utils/timer'

const BEST_SCORES_KEY = 'quiz-best-scores'
const WARNING_THRESHOLD_SECONDS = 5

function normalizeThemes(sourceThemes = []) {
  return sourceThemes.map((theme) => ({
    ...theme,
    questions: Array.isArray(theme.questions)
      ? theme.questions.map((question, questionIndex) => ({
          ...question,
          id: question.id || `${theme.id}-${questionIndex + 1}`,
          answers: Array.isArray(question.answers) ? question.answers : []
        }))
      : []
  }))
}

function getCorrectAnswerIndex(question) {
  if (!question) {
    return -1
  }

  if (typeof question.correctAnswerIndex === 'number') {
    return question.correctAnswerIndex
  }

  if (typeof question.correctAnswer === 'number') {
    return question.correctAnswer
  }

  if (question.correctAnswer === undefined || question.correctAnswer === null) {
    return -1
  }

  return question.answers.findIndex((answer) => {
    if (answer?.value === question.correctAnswer) {
      return true
    }

    if (answer?.id === question.correctAnswer) {
      return true
    }

    return answer?.label === question.correctAnswer
  })
}

export function useQuiz(sourceThemes = themesData) {
  const storedBestScores = loadFromLocalStorage(BEST_SCORES_KEY, {})
  const safeBestScores =
    storedBestScores && typeof storedBestScores === 'object' && !Array.isArray(storedBestScores)
      ? storedBestScores
      : {}

  const availableThemes = ref(normalizeThemes(sourceThemes))
  const bestScoresMap = ref(safeBestScores)
  const currentThemeId = ref(null)
  const currentIndex = ref(0)
  const score = ref(0)
  const bestScore = ref(0)
  const selectedAnswer = ref(null)
  const timeLeft = ref(0)
  const globalTimeLeft = ref(0)
  const isFinished = ref(false)
  const view = ref('intro')
  const questionTimerId = ref(null)
  const globalTimerId = ref(null)
  const runOptions = ref({})

  const currentTheme = computed(() => {
    return availableThemes.value.find((theme) => theme.id === currentThemeId.value) || null
  })

  const questions = computed(() => currentTheme.value?.questions || [])

  const currentQuestion = computed(() => {
    if (isFinished.value || view.value !== 'question') {
      return null
    }

    return questions.value[currentIndex.value] || null
  })

  const correctAnswerIndex = computed(() => getCorrectAnswerIndex(currentQuestion.value))

  const canNext = computed(() => {
    return view.value === 'question' && !isFinished.value && selectedAnswer.value !== null
  })

  const progressPercent = computed(() => {
    if (!questions.value.length) {
      return 0
    }

    return Math.round((Math.min(currentIndex.value, questions.value.length) / questions.value.length) * 100)
  })

  const timerIsWarning = computed(() => timeLeft.value > 0 && timeLeft.value <= WARNING_THRESHOLD_SECONDS)

  function stopTimer(timerRef) {
    if (timerRef.value?.stop) {
      timerRef.value.stop()
    }
    timerRef.value = null
  }

  function clearTimers() {
    stopTimer(questionTimerId)
    stopTimer(globalTimerId)
  }

  function resolveQuestionTimeLimit() {
    const optionValue = Number(runOptions.value?.questionTimeLimit)
    if (Number.isFinite(optionValue) && optionValue > 0) {
      return optionValue
    }

    const themeValue = Number(currentTheme.value?.settings?.questionTimeLimit)
    if (Number.isFinite(themeValue) && themeValue > 0) {
      return themeValue
    }

    return 0
  }

  function resolveGlobalTimeLimit() {
    const optionValue = Number(runOptions.value?.globalTimeLimit)
    if (Number.isFinite(optionValue) && optionValue > 0) {
      return optionValue
    }

    const themeValue = Number(currentTheme.value?.settings?.globalTimeLimit)
    if (Number.isFinite(themeValue) && themeValue > 0) {
      return themeValue
    }

    return 0
  }

  function startQuestionTimer() {
    stopTimer(questionTimerId)
    const duration = resolveQuestionTimeLimit()
    timeLeft.value = duration

    if (!duration) {
      return
    }

    questionTimerId.value = startTimer({
      duration,
      onTick: (remaining) => {
        timeLeft.value = remaining
      },
      onComplete: () => {
        advance(true)
      }
    })
  }

  function startGlobalTimer() {
    stopTimer(globalTimerId)
    const duration = resolveGlobalTimeLimit()
    globalTimeLeft.value = duration

    if (!duration) {
      return
    }

    globalTimerId.value = startTimer({
      duration,
      onTick: (remaining) => {
        globalTimeLeft.value = remaining
      },
      onComplete: () => {
        finishQuiz()
      }
    })
  }

  function setBestScoreForTheme(themeId, nextScore) {
    const safeScore = Number.isFinite(nextScore) ? nextScore : 0
    bestScoresMap.value = {
      ...bestScoresMap.value,
      [themeId]: safeScore
    }
    saveToLocalStorage(BEST_SCORES_KEY, bestScoresMap.value)
    bestScore.value = safeScore
  }

  function finishQuiz() {
    clearTimers()
    isFinished.value = true
    view.value = 'result'

    if (!currentThemeId.value) {
      return
    }

    const existingBest = Number(bestScoresMap.value[currentThemeId.value] || 0)
    if (score.value > existingBest) {
      setBestScoreForTheme(currentThemeId.value, score.value)
      return
    }

    bestScore.value = existingBest
  }

  function advance(force = false) {
    if (view.value !== 'question' || isFinished.value) {
      return false
    }

    if (!force && selectedAnswer.value === null) {
      return false
    }

    const isLastQuestion = currentIndex.value >= questions.value.length - 1
    if (isLastQuestion) {
      finishQuiz()
      return true
    }

    currentIndex.value += 1
    selectedAnswer.value = null
    startQuestionTimer()
    return true
  }

  function start(themeId, options = {}) {
    const targetTheme = availableThemes.value.find((theme) => theme.id === themeId)
    if (!targetTheme) {
      return false
    }

    clearTimers()
    runOptions.value = { ...options }
    currentThemeId.value = targetTheme.id
    currentIndex.value = 0
    score.value = 0
    selectedAnswer.value = null
    timeLeft.value = 0
    globalTimeLeft.value = 0
    isFinished.value = false
    view.value = 'question'

    bestScore.value = Number(bestScoresMap.value[targetTheme.id] || 0)
    startQuestionTimer()
    startGlobalTimer()
    return true
  }

  function selectAnswer(index) {
    if (view.value !== 'question' || isFinished.value) {
      return false
    }

    if (selectedAnswer.value !== null) {
      return false
    }

    if (!Array.isArray(currentQuestion.value?.answers) || index < 0 || index >= currentQuestion.value.answers.length) {
      return false
    }

    selectedAnswer.value = index
    if (index === correctAnswerIndex.value) {
      score.value += 1
    }

    return true
  }

  function next() {
    return advance(false)
  }

  function restart() {
    if (!currentThemeId.value) {
      const fallbackTheme = availableThemes.value[0]
      return fallbackTheme ? start(fallbackTheme.id, runOptions.value) : false
    }

    return start(currentThemeId.value, runOptions.value)
  }

  function goHome() {
    clearTimers()
    currentThemeId.value = null
    currentIndex.value = 0
    score.value = 0
    selectedAnswer.value = null
    timeLeft.value = 0
    globalTimeLeft.value = 0
    isFinished.value = false
    view.value = 'intro'
    return true
  }

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    availableThemes,
    currentThemeId,
    currentTheme,
    questions,
    currentQuestion,
    currentIndex,
    score,
    bestScore,
    selectedAnswer,
    timeLeft,
    globalTimeLeft,
    isFinished,
    view,
    questionTimerId,
    globalTimerId,
    correctAnswerIndex,
    canNext,
    progressPercent,
    timerIsWarning,
    start,
    selectAnswer,
    next,
    restart,
    goHome
  }
}
