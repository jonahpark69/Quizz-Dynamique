<script setup>
import { ref, watch } from 'vue'
import { vRipple } from '../directives/ripple'
import { vStaggerAnswers } from '../directives/staggerAnswers'

const props = defineProps({
  answers: {
    type: Array,
    default: () => []
  },
  selectedIndex: {
    type: Number,
    default: null
  },
  correctIndex: {
    type: Number,
    default: -1
  },
  locked: {
    type: Boolean,
    default: false
  },
  imageMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])
const loadingByIndex = ref({})

function hasImage(answer) {
  return answer && typeof answer === 'object' && typeof answer.imageSrc === 'string'
}

function answerLabel(answer) {
  if (typeof answer === 'string') {
    return answer
  }
  return answer?.label || 'Réponse'
}

function normalizeImagePath(src) {
  if (!src) {
    return ''
  }

  if (src.startsWith('/legacy/images/') || /^(https?:|data:|blob:)/.test(src)) {
    return src
  }

  let normalized = src.replace(/\\/g, '/')
  normalized = normalized.replace(/^\.?\//, '')
  normalized = normalized.replace(/^\.\.\//g, '')
  normalized = normalized.replace(/^assets\/images\//, '')
  normalized = normalized.replace(/^quiz-image\//, '')
  normalized = normalized.replace(/^images\//, '')
  return `/legacy/images/${normalized}`
}

function markLoaded(index) {
  loadingByIndex.value = {
    ...loadingByIndex.value,
    [index]: false
  }
}

function onSelect(index) {
  emit('select', index)
}

watch(
  () => props.answers,
  (answers) => {
    const nextLoading = {}
    answers.forEach((answer, index) => {
      nextLoading[index] = hasImage(answer)
    })
    loadingByIndex.value = nextLoading
  },
  { immediate: true }
)
</script>

<template>
  <div class="answers" :class="{ 'answers--image': imageMode }">
    <div v-stagger-answers="{ step: 70 }" class="answers-list-wrapper">
      <button
        v-for="(answer, index) in answers"
        :key="`${index}-${answerLabel(answer)}`"
        v-ripple
        class="answer-btn"
        :class="{
          'answer-btn--image': hasImage(answer),
          'is-loading': hasImage(answer) && loadingByIndex[index],
          correct: locked && index === correctIndex,
          wrong: locked && selectedIndex === index && index !== correctIndex
        }"
        type="button"
        :disabled="locked"
        @click="onSelect(index)"
      >
        <template v-if="hasImage(answer)">
          <img
            :src="normalizeImagePath(answer.imageSrc)"
            :alt="answerLabel(answer)"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            @load="markLoaded(index)"
            @error="markLoaded(index)"
          />
          <span class="sr-only">{{ answerLabel(answer) }}</span>
        </template>
        <template v-else>
          {{ answerLabel(answer) }}
        </template>
      </button>
    </div>
  </div>
</template>
