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
    type: [Number, null],
    default: null
  },
  locked: {
    type: Boolean,
    default: false
  },
  correctAnswerIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['select'])
const imageLoadingByKey = ref({})

function answerKey(answer, index) {
  return `${index}-${answer?.value ?? answer?.id ?? answer?.label ?? 'answer'}`
}

function hasImage(answer) {
  return typeof answer?.imageSrc === 'string' && answer.imageSrc.length > 0
}

function resolveImageSrc(imageSrc) {
  if (!imageSrc) {
    return ''
  }

  if (/^(https?:\/\/|data:|blob:)/.test(imageSrc)) {
    return imageSrc
  }

  if (imageSrc.startsWith('/legacy/images/')) {
    return imageSrc
  }

  const normalized = imageSrc
    .replace(/^\.?\//, '')
    .replace(/^legacy\/images\//, '')
    .replace(/^images\//, '')

  return `/legacy/images/${normalized}`
}

function markImageLoaded(key) {
  imageLoadingByKey.value = {
    ...imageLoadingByKey.value,
    [key]: false
  }
}

function select(index) {
  emit('select', index)
}

watch(
  () => props.answers,
  (nextAnswers) => {
    const loadingState = {}
    nextAnswers.forEach((answer, index) => {
      const key = answerKey(answer, index)
      loadingState[key] = hasImage(answer)
    })
    imageLoadingByKey.value = loadingState
  },
  { immediate: true }
)
</script>

<template>
  <ul v-stagger-answers="{ step: 70 }" class="answers-list">
    <li
      v-for="(answer, index) in answers"
      :key="answerKey(answer, index)"
      class="answers-list__item"
    >
      <button
        v-ripple
        type="button"
        class="answers-list__button"
        :class="{
          'is-selected': selectedIndex === index,
          'is-correct': locked && correctAnswerIndex === index,
          'is-wrong':
            locked &&
            selectedIndex === index &&
            correctAnswerIndex !== -1 &&
            selectedIndex !== correctAnswerIndex
        }"
        :disabled="locked"
        @click="select(index)"
      >
        <span v-if="hasImage(answer)" class="answers-list__image-wrap">
          <span
            v-if="imageLoadingByKey[answerKey(answer, index)]"
            class="answers-list__image-loader"
          />
          <img
            :src="resolveImageSrc(answer.imageSrc)"
            :alt="answer.label || `Reponse ${index + 1}`"
            class="answers-list__image"
            loading="lazy"
            @load="markImageLoaded(answerKey(answer, index))"
            @error="markImageLoaded(answerKey(answer, index))"
          />
        </span>
        <span class="answers-list__label">
          {{ answer.label || answer.text || `Reponse ${index + 1}` }}
        </span>
      </button>
    </li>
  </ul>
</template>
