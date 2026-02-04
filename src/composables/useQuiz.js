import { computed, onBeforeUnmount, ref } from 'vue'
import hintsByQuestionText from '../data/hints'
import themesData from '../data/themes'
import { normalizeDifficulty, shuffleArray, formatSeconds } from '../utils/helpers'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'
import { startTimer, stopTimer } from '../utils/timer'

const BEST_SCORE_KEY = 'bestScore'
const TIME_TRIAL_DURATION_DEFAULT = 240
const INFINITE_TOTAL_LABEL = '∞'
const TRAINING_COMPLETE_LABEL = 'Entraînement terminé !'
const QUESTION_WARNING_THRESHOLD = 3
const GLOBAL_WARNING_THRESHOLD = 10

const DIFFICULTY_ORDER = {
  easy: 0,
  medium: 1,
  hard: 2
}

const DEFAULT_TIME_LIMITS = {
  easy: 30,
  medium: 30,
  hard: 30
}

const REWARD_BADGES = {
  starter: { title: 'Décollage', description: '5 bonnes réponses.' },
  top10: { title: 'Top 10', description: '10 bonnes réponses.' },
  expert: { title: 'Expert', description: '15 bonnes réponses.' },
  perfect: { title: 'Sans faute', description: 'Score parfait sur le thème.' }
}

const REWARD_STATUS = {
  earned: 'Débloqué',
  locked: 'À débloquer'
}

const rewardDefinitions = [
  { id: 'starter', threshold: 5 },
  { id: 'top10', threshold: 10 },
  { id: 'expert', threshold: 15 },
  { id: 'perfect', isPerfect: true }
]

const hintStopWords = new Set(['de', 'la', 'le', 'les', 'du', 'des', 'd', 'l', 'aux', 'au', 'et'])

function normalizeImagePath(value) {
  if (!value || typeof value !== 'string') {
    return value || ''
  }

  if (/^(https?:|data:|blob:)/.test(value) || value.startsWith('/legacy/images/')) {
    return value
  }

  let normalized = value.replace(/\\/g, '/')
  normalized = normalized.replace(/^\.?\//, '')
  normalized = normalized.replace(/^\.\.\//g, '')
  normalized = normalized.replace(/^assets\/images\//, '')
  normalized = normalized.replace(/^quiz-image\//, '')
  normalized = normalized.replace(/^images\//, '')
  return `/legacy/images/${normalized}`
}

function getAnswerLabel(question) {
  if (!question || !Array.isArray(question.answers)) {
    return ''
  }

  const answer = question.answers[question.correct]
  if (typeof answer === 'string') {
    return answer
  }

  if (answer && typeof answer === 'object') {
    return answer.label || ''
  }

  return ''
}

function toRoman(value) {
  const map = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ]

  let remaining = value
  let result = ''

  for (const [number, symbol] of map) {
    while (remaining >= number) {
      result += symbol
      remaining -= number
    }
  }

  return result || String(value)
}

function buildAutoHint(question) {
  const label = getAnswerLabel(question).trim()
  if (!label) {
    return ''
  }

  const questionText = (question.text || '').toLowerCase()
  const compact = label.replace(/\s+/g, ' ').trim()
  const lettersOnly = label.replace(/[^A-Za-zÀ-ÿ]/g, '')
  const digitsOnly = (label.match(/\d+/g) || []).join('')
  const words = compact.split(/[\s-]+/).filter(Boolean)

  if (questionText.includes('année') && digitsOnly) {
    const year = Number.parseInt(digitsOnly, 10)
    if (Number.isFinite(year) && year > 0) {
      const century = Math.floor((year - 1) / 100) + 1
      return `Année du ${toRoman(century)}e siècle.`
    }
  }

  if (/^\d+$/.test(compact)) {
    const digits = compact.length
    return `Nombre à ${digits} chiffre${digits > 1 ? 's' : ''}.`
  }

  if (/\d/.test(compact)) {
    if (compact.length <= 6) {
      return `Réponse en ${compact.length} caractères, contient un chiffre.`
    }

    if (digitsOnly) {
      return `Indice : contient le nombre ${digitsOnly}.`
    }
  }

  if (words.length >= 2) {
    const majorWords = words.filter((word) => !hintStopWords.has(word.toLowerCase()))
    const initialSource = majorWords.length ? majorWords : words
    const initials = initialSource
      .map((word) => word[0]?.toUpperCase())
      .filter(Boolean)
      .join('.')
    return `${words.length} mots. Initiales : ${initials}.`
  }

  if (lettersOnly.length) {
    const first = lettersOnly[0].toUpperCase()
    const last = lettersOnly[lettersOnly.length - 1].toLowerCase()
    if (lettersOnly.length <= 4) {
      return `${lettersOnly.length} lettres. Commence par "${first}" et finit par "${last}".`
    }
    return `${lettersOnly.length} lettres. Commence par "${first}".`
  }

  return `Réponse en ${compact.length} caractères.`
}

function normalizeQuestion(question, fallbackId) {
  const difficulty = normalizeDifficulty(question.difficulty)
  const questionTimeLimit = Number.isFinite(question.timeLimit)
    ? question.timeLimit
    : DEFAULT_TIME_LIMITS[difficulty]
  const hint = question.hint || hintsByQuestionText[question.text] || buildAutoHint(question)

  return {
    ...question,
    id: question.id || fallbackId,
    difficulty,
    timeLimit: questionTimeLimit,
    hint,
    promptImage: normalizeImagePath(question.promptImage),
    answers: (question.answers || []).map((answer) => {
      if (typeof answer === 'string') {
        return answer
      }

      if (!answer || typeof answer !== 'object') {
        return answer
      }

      return {
        ...answer,
        imageSrc: normalizeImagePath(answer.imageSrc)
      }
    })
  }
}

function getDifficultyRank(difficulty) {
  return DIFFICULTY_ORDER[difficulty] ?? DIFFICULTY_ORDER.medium
}

function shuffleAnswers(question) {
  const answers = [...(question.answers || [])]
  const correctAnswer = answers[question.correct]
  const shuffledAnswers = shuffleArray(answers)
  const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer)

  return {
    ...question,
    answers: shuffledAnswers,
    correct: newCorrectIndex >= 0 ? newCorrectIndex : 0
  }
}

function buildProgressiveQuestions(theme) {
  const sortedQuestions = (theme?.questions || [])
    .map((question, index) => normalizeQuestion(question, `${theme.id}-${index + 1}`))
    .map((question, index) => ({ ...question, _index: index }))
    .sort((a, b) => {
      const difficultyDelta = getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty)
      return difficultyDelta || a._index - b._index
    })
    .map(({ _index, ...question }) => question)

  return shuffleArray(sortedQuestions).map(shuffleAnswers)
}

function getTimeTrialDuration(value) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return TIME_TRIAL_DURATION_DEFAULT
  }
  return parsed
}

export function useQuiz(sourceThemes = themesData) {
  const themes = ref(sourceThemes)
  const selectedThemeId = ref(themes.value[0]?.id || 'general')

  const bestScore = ref(loadFromLocalStorage(BEST_SCORE_KEY, 0) || 0)

  const flashcardToggle = ref(false)
  const infiniteToggle = ref(false)
  const timeTrialToggle = ref(false)
  const timeTrialDuration = ref(TIME_TRIAL_DURATION_DEFAULT)

  const currentThemeId = ref(null)
  const activeQuestions = ref([])
  const currentIndex = ref(0)
  const score = ref(0)
  const selectedAnswer = ref(null)
  const timedOut = ref(false)
  const isFinished = ref(false)
  const screen = ref('intro')

  const timeLeft = ref(0)
  const globalTimeLeft = ref(0)
  const questionTimerId = ref(null)
  const globalTimerId = ref(null)

  const isFlashcardMode = ref(false)
  const isInfiniteMode = ref(false)
  const isTimeTrialMode = ref(false)
  const infiniteQuestionCount = ref(0)

  const questionStartTime = ref(null)
  const questionStats = ref([])

  const hintVisible = ref(false)
  const hintUsed = ref(false)

  const currentTheme = computed(() => {
    return themes.value.find((theme) => theme.id === currentThemeId.value) || null
  })

  const questions = computed(() => activeQuestions.value)

  const currentQuestion = computed(() => {
    return activeQuestions.value[currentIndex.value] || null
  })

  const correctAnswerIndex = computed(() => {
    if (!currentQuestion.value) {
      return -1
    }
    return Number.isFinite(currentQuestion.value.correct) ? currentQuestion.value.correct : -1
  })

  const questionIndexDisplay = computed(() => {
    if (isInfiniteMode.value) {
      return infiniteQuestionCount.value + 1
    }
    return currentIndex.value + 1
  })

  const totalQuestionsLabel = computed(() => {
    return isInfiniteMode.value ? INFINITE_TOTAL_LABEL : String(activeQuestions.value.length)
  })

  const progressPercent = computed(() => {
    if (!activeQuestions.value.length || isInfiniteMode.value) {
      return 0
    }

    const current = Math.min(currentIndex.value + 1, activeQuestions.value.length)
    return Math.round((current / activeQuestions.value.length) * 100)
  })

  const canGoNext = computed(() => {
    if (screen.value !== 'question') {
      return false
    }

    if (isFlashcardMode.value) {
      return true
    }

    return selectedAnswer.value !== null || timedOut.value
  })

  const shouldShowNextButton = computed(() => {
    if (isFlashcardMode.value) {
      return true
    }
    return selectedAnswer.value !== null || timedOut.value
  })

  const shouldShowQuestionTimer = computed(() => {
    return !isFlashcardMode.value && !isTimeTrialMode.value
  })

  const shouldShowGlobalTimer = computed(() => isTimeTrialMode.value)

  const isQuestionTimerWarning = computed(() => {
    return shouldShowQuestionTimer.value && timeLeft.value <= QUESTION_WARNING_THRESHOLD
  })

  const isGlobalTimerWarning = computed(() => {
    return shouldShowGlobalTimer.value && globalTimeLeft.value <= GLOBAL_WARNING_THRESHOLD
  })

  const isImageQuestion = computed(() => {
    const question = currentQuestion.value
    if (!question) {
      return false
    }

    if (question.promptImage || currentTheme.value?.answerType === 'image') {
      return true
    }

    return (question.answers || []).some(
      (answer) => answer && typeof answer === 'object' && Boolean(answer.imageSrc)
    )
  })

  const activeHint = computed(() => currentQuestion.value?.hint || '')
  const hasHintButton = computed(() => {
    const question = currentQuestion.value
    if (!question) {
      return false
    }
    return question.difficulty === 'hard' && Boolean(question.hint)
  })

  const canRevealHint = computed(() => hasHintButton.value && !hintUsed.value)

  const hintStatus = computed(() => (hintVisible.value ? 'Indice affiché' : ''))

  const scoreLabel = computed(() => {
    if (isFlashcardMode.value) {
      return TRAINING_COMPLETE_LABEL
    }
    return `Votre score : ${score.value} / ${activeQuestions.value.length}`
  })

  const statsEntries = computed(() => questionStats.value.filter(Boolean))

  const statsSummary = computed(() => {
    const entries = statsEntries.value
    const correctCount = entries.filter((entry) => entry.isCorrect).length
    const wrongCount = entries.length - correctCount
    const averageTime = entries.length
      ? entries.reduce((sum, entry) => sum + entry.timeSpent, 0) / entries.length
      : 0

    return {
      correctCount,
      wrongCount,
      averageTime,
      averageTimeLabel: formatSeconds(averageTime)
    }
  })

  const rewards = computed(() => {
    const total = activeQuestions.value.length
    const correctCount = statsSummary.value.correctCount

    return rewardDefinitions.map((reward) => {
      const isPerfect = reward.isPerfect && total > 0 && correctCount === total
      const earned = isPerfect || (!reward.isPerfect && correctCount >= reward.threshold)
      const copy = REWARD_BADGES[reward.id] || { title: reward.id, description: '' }

      return {
        id: reward.id,
        earned,
        icon: reward.isPerfect ? '100%' : `${reward.threshold}+`,
        title: copy.title,
        description: copy.description,
        status: earned ? REWARD_STATUS.earned : REWARD_STATUS.locked
      }
    })
  })

  const tweetIntentUrl = computed(() => {
    const text = `J'ai fait un score de ${score.value}/${activeQuestions.value.length} sur le Quiz Dynamique ! 🎯`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  })

  function clearTimers() {
    stopTimer(questionTimerId.value)
    stopTimer(globalTimerId.value)
    questionTimerId.value = null
    globalTimerId.value = null
  }

  function resetHintState() {
    hintVisible.value = false
    hintUsed.value = false
  }

  function resetQuestionState() {
    selectedAnswer.value = null
    timedOut.value = false
    resetHintState()
    questionStartTime.value = Date.now()
  }

  function startQuestionTimer() {
    stopTimer(questionTimerId.value)
    questionTimerId.value = null

    if (!shouldShowQuestionTimer.value || !currentQuestion.value) {
      timeLeft.value = 0
      return
    }

    timeLeft.value = currentQuestion.value.timeLimit
    questionTimerId.value = startTimer(
      currentQuestion.value.timeLimit,
      (nextTimeLeft) => {
        timeLeft.value = nextTimeLeft
      },
      () => {
        if (selectedAnswer.value !== null) {
          return
        }

        timedOut.value = true
        recordQuestionStats({ isCorrect: false, timedOut: true })
      }
    )
  }

  function startGlobalTimer() {
    stopTimer(globalTimerId.value)
    globalTimerId.value = null

    if (!isTimeTrialMode.value) {
      globalTimeLeft.value = 0
      return
    }

    globalTimeLeft.value = getTimeTrialDuration(timeTrialDuration.value)
    globalTimerId.value = startTimer(
      globalTimeLeft.value,
      (nextTimeLeft) => {
        globalTimeLeft.value = nextTimeLeft
      },
      () => {
        if (screen.value !== 'question') {
          return
        }

        if (selectedAnswer.value === null && !timedOut.value) {
          timedOut.value = true
          recordQuestionStats({ isCorrect: false, timedOut: true })
        }

        endQuiz()
      }
    )
  }

  function setModeFromOptions(options = {}) {
    if (Object.prototype.hasOwnProperty.call(options, 'flashcard')) {
      flashcardToggle.value = Boolean(options.flashcard)
    }

    if (Object.prototype.hasOwnProperty.call(options, 'infinite')) {
      infiniteToggle.value = Boolean(options.infinite)
    }

    if (Object.prototype.hasOwnProperty.call(options, 'timeTrial')) {
      timeTrialToggle.value = Boolean(options.timeTrial)
    }

    if (Object.prototype.hasOwnProperty.call(options, 'timeTrialDuration')) {
      timeTrialDuration.value = getTimeTrialDuration(options.timeTrialDuration)
    }

    isFlashcardMode.value = flashcardToggle.value
    isInfiniteMode.value = infiniteToggle.value
    isTimeTrialMode.value = !isFlashcardMode.value && !isInfiniteMode.value && timeTrialToggle.value
  }

  function resetStats() {
    questionStats.value = new Array(activeQuestions.value.length).fill(null)
  }

  function recordQuestionStats({ isCorrect, timedOut: hasTimedOut }) {
    if (isInfiniteMode.value) {
      return
    }

    if (questionStats.value[currentIndex.value]) {
      return
    }

    const current = currentQuestion.value
    if (!current) {
      return
    }

    const now = Date.now()
    const timeSpent = questionStartTime.value ? (now - questionStartTime.value) / 1000 : 0

    questionStats.value.splice(currentIndex.value, 1, {
      text: current.text,
      difficulty: current.difficulty,
      isCorrect: Boolean(isCorrect) && !hasTimedOut,
      timedOut: Boolean(hasTimedOut),
      timeSpent
    })
  }

  function prepareQuestion() {
    if (!currentQuestion.value) {
      endQuiz()
      return
    }

    resetQuestionState()
    startQuestionTimer()
  }

  function endQuiz() {
    clearTimers()
    screen.value = 'result'
    isFinished.value = true

    if (!isFlashcardMode.value && score.value > bestScore.value) {
      bestScore.value = score.value
      saveToLocalStorage(BEST_SCORE_KEY, bestScore.value)
    }
  }

  function start(themeId = selectedThemeId.value, options = {}) {
    const targetTheme = themes.value.find((theme) => theme.id === themeId) || themes.value[0]
    if (!targetTheme) {
      return false
    }

    selectedThemeId.value = targetTheme.id
    currentThemeId.value = targetTheme.id
    setModeFromOptions(options)

    clearTimers()

    activeQuestions.value = buildProgressiveQuestions(targetTheme)
    if (!activeQuestions.value.length) {
      return false
    }

    currentIndex.value = 0
    infiniteQuestionCount.value = 0
    score.value = 0
    isFinished.value = false
    screen.value = 'question'

    resetStats()
    resetQuestionState()
    startGlobalTimer()
    startQuestionTimer()

    return true
  }

  function selectAnswer(index) {
    if (screen.value !== 'question' || !currentQuestion.value) {
      return false
    }

    if (selectedAnswer.value !== null || timedOut.value) {
      return false
    }

    if (!Number.isFinite(index) || index < 0 || index >= currentQuestion.value.answers.length) {
      return false
    }

    selectedAnswer.value = index
    stopTimer(questionTimerId.value)
    questionTimerId.value = null

    const isCorrect = index === currentQuestion.value.correct
    if (isCorrect && !isFlashcardMode.value) {
      score.value += 1
    }

    recordQuestionStats({ isCorrect, timedOut: false })
    return true
  }

  function next() {
    if (!canGoNext.value) {
      return false
    }

    if (isInfiniteMode.value) {
      infiniteQuestionCount.value += 1
      currentIndex.value += 1

      if (currentIndex.value >= activeQuestions.value.length) {
        activeQuestions.value = buildProgressiveQuestions(currentTheme.value)
        currentIndex.value = 0
      }

      prepareQuestion()
      return true
    }

    currentIndex.value += 1
    if (currentIndex.value >= activeQuestions.value.length) {
      endQuiz()
      return true
    }

    prepareQuestion()
    return true
  }

  function restart() {
    if (!currentThemeId.value) {
      return false
    }

    return start(currentThemeId.value)
  }

  function goHome() {
    clearTimers()
    screen.value = 'intro'
    isFinished.value = false
    selectedAnswer.value = null
    timedOut.value = false
    timeLeft.value = 0
    globalTimeLeft.value = 0
    resetHintState()
    return true
  }

  function revealHint() {
    if (!canRevealHint.value) {
      return false
    }

    hintVisible.value = true
    hintUsed.value = true
    return true
  }

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    themes,
    selectedThemeId,
    currentThemeId,
    currentTheme,
    questions,
    currentQuestion,
    currentIndex,
    questionIndexDisplay,
    totalQuestionsLabel,
    progressPercent,
    score,
    scoreLabel,
    bestScore,
    selectedAnswer,
    correctAnswerIndex,
    isFinished,
    screen,
    timeLeft,
    globalTimeLeft,
    questionTimerId,
    globalTimerId,
    shouldShowQuestionTimer,
    shouldShowGlobalTimer,
    isQuestionTimerWarning,
    isGlobalTimerWarning,
    shouldShowNextButton,
    canGoNext,
    isImageQuestion,
    flashcardToggle,
    infiniteToggle,
    timeTrialToggle,
    timeTrialDuration,
    isFlashcardMode,
    isInfiniteMode,
    isTimeTrialMode,
    activeHint,
    hasHintButton,
    canRevealHint,
    hintVisible,
    hintStatus,
    statsEntries,
    statsSummary,
    rewards,
    tweetIntentUrl,
    start,
    selectAnswer,
    next,
    restart,
    goHome,
    revealHint
  }
}
