<script setup>
import { vAnimateOnTextChange } from '../directives/animateOnTextChange'

const props = defineProps({
  question: {
    type: Object,
    default: null
  },
  isImageQuestion: {
    type: Boolean,
    default: false
  },
  imageLoading: {
    type: Boolean,
    default: false
  },
  audioAvailable: {
    type: Boolean,
    default: false
  },
  audioPlaying: {
    type: Boolean,
    default: false
  },
  audioStatus: {
    type: String,
    default: ''
  },
  showHintButton: {
    type: Boolean,
    default: false
  },
  canRevealHint: {
    type: Boolean,
    default: false
  },
  hintVisible: {
    type: Boolean,
    default: false
  },
  hintText: {
    type: String,
    default: ''
  },
  hintStatus: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['play-audio', 'reveal-hint', 'image-load', 'image-error'])
</script>

<template>
  <template v-if="question">
    <div
      class="question-media"
      :class="{ hidden: !question.promptImage, 'is-loading': imageLoading && question.promptImage }"
    >
      <img
        v-if="question.promptImage"
        :src="question.promptImage"
        :alt="question.promptAlt || question.text || 'Illustration de la question'"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        @load="emit('image-load')"
        @error="emit('image-error')"
      />
    </div>

    <p v-animate-on-text-change="question.text" class="question">{{ question.text }}</p>

    <div class="question-actions" :class="{ hidden: !audioAvailable && !showHintButton }">
      <div class="question-actions__group">
        <button
          class="btn btn-secondary btn-audio"
          :class="{ 'is-playing': audioPlaying }"
          type="button"
          :disabled="!audioAvailable"
          @click="emit('play-audio')"
        >
          {{ audioPlaying ? 'Lecture en cours' : 'Lecture' }}
        </button>
        <span class="audio-status" aria-live="polite">{{ audioStatus }}</span>
      </div>

      <div class="question-actions__group">
        <button
          class="btn btn-secondary btn-hint"
          :class="{ hidden: !showHintButton, 'is-used': hintVisible }"
          type="button"
          :disabled="!canRevealHint"
          aria-controls="hint-box"
          :aria-expanded="hintVisible ? 'true' : 'false'"
          @click="emit('reveal-hint')"
        >
          Indice
        </button>
        <span class="hint-status" aria-live="polite">{{ hintStatus }}</span>
      </div>
    </div>

    <div id="hint-box" class="hint-box" :class="{ hidden: !hintVisible }" aria-live="polite">
      {{ hintText }}
    </div>
  </template>
</template>
