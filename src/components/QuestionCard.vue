<script setup>
import { computed } from 'vue'
import { vAnimateOnTextChange } from '../directives/animateOnTextChange'

const props = defineProps({
  question: {
    type: Object,
    default: null
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
})

const questionText = computed(() => props.question?.text || props.question?.prompt || '')
</script>

<template>
  <article v-if="question" class="question-card" :data-theme="question.theme || ''">
    <p class="question-card__index">Question {{ currentIndex + 1 }} / {{ total }}</p>
    <h2 v-animate-on-text-change="questionText" class="question-card__title">
      {{ questionText }}
    </h2>
    <slot />
  </article>
</template>
