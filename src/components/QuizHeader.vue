<script setup>
defineProps({
  questionIndex: {
    type: Number,
    default: 0
  },
  totalLabel: {
    type: String,
    default: '0'
  },
  themeLabel: {
    type: String,
    default: ''
  },
  progressPercent: {
    type: Number,
    default: 0
  },
  showGlobalTimer: {
    type: Boolean,
    default: false
  },
  showQuestionTimer: {
    type: Boolean,
    default: false
  },
  globalTimeLeft: {
    type: Number,
    default: 0
  },
  timeLeft: {
    type: Number,
    default: 0
  },
  globalTimerWarning: {
    type: Boolean,
    default: false
  },
  questionTimerWarning: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="progress">
    <div class="progress__meta">
      <span>
        <span>Question</span>
        <span>{{ questionIndex }}</span>
        /
        <span>{{ totalLabel }}</span>
      </span>
      <span class="theme-label">{{ themeLabel }}</span>
    </div>
    <div class="progress__bar">
      <span class="progress__fill" :style="{ width: `${progressPercent}%` }" />
    </div>
  </div>

  <div class="meta-row">
    <div
      v-if="showGlobalTimer"
      class="timer timer--global"
      :class="{ 'timer--warning': globalTimerWarning }"
    >
      <span>Temps global restant :</span>
      <span>{{ globalTimeLeft }}</span>
      <span>s</span>
    </div>

    <div
      v-if="showQuestionTimer"
      class="timer"
      :class="{ 'timer--warning': questionTimerWarning }"
    >
      <span>Temps restant :</span>
      <span>{{ timeLeft }}</span>
      <span>s</span>
    </div>
  </div>
</template>
