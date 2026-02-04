<script setup>
defineProps({
  mode: {
    type: String,
    default: 'question'
  },
  canNext: {
    type: Boolean,
    default: false
  }
})

defineEmits(['next', 'restart', 'home'])
</script>

<template>
  <div class="quiz-controls">
    <template v-if="mode === 'question'">
      <button
        type="button"
        class="quiz-controls__button quiz-controls__button--primary"
        :disabled="!canNext"
        @click="$emit('next')"
      >
        Suivant
      </button>
    </template>

    <template v-else-if="mode === 'result'">
      <button
        type="button"
        class="quiz-controls__button quiz-controls__button--secondary"
        @click="$emit('home')"
      >
        Accueil
      </button>
      <button
        type="button"
        class="quiz-controls__button quiz-controls__button--primary"
        @click="$emit('restart')"
      >
        Rejouer
      </button>
    </template>
  </div>
</template>
