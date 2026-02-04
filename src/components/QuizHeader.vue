<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Quiz Dynamique'
  },
  subtitle: {
    type: String,
    default: ''
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  timeLeft: {
    type: Number,
    default: 0
  },
  globalTimeLeft: {
    type: Number,
    default: 0
  },
  timerWarning: {
    type: Boolean,
    default: false
  },
  progressPercent: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <header class="quiz-header">
    <h1 class="quiz-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="quiz-header__subtitle">{{ subtitle }}</p>

    <div class="quiz-header__row">
      <p class="quiz-header__meta">Question {{ currentIndex + 1 }} / {{ total }}</p>
      <p class="quiz-header__meta">Score {{ score }} | Record {{ bestScore }}</p>
    </div>

    <div class="quiz-header__row">
      <p class="quiz-header__timer" :class="{ 'timer--warning': timerWarning }">
        Temps question: {{ timeLeft || 0 }}s
      </p>
      <p class="quiz-header__timer" :class="{ 'timer--warning': globalTimeLeft > 0 && globalTimeLeft <= 15 }">
        Temps global: {{ globalTimeLeft || 0 }}s
      </p>
    </div>

    <div class="quiz-header__progress" aria-hidden="true">
      <div class="quiz-header__progress-bar" :style="{ width: `${progressPercent}%` }" />
    </div>
  </header>
</template>
