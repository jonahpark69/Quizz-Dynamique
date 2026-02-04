<script setup>
defineProps({
  canGoBack: {
    type: Boolean,
    default: false,
  },
  canGoNext: {
    type: Boolean,
    default: false,
  },
  isLastQuestion: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['previous', 'next'])
</script>

<template>
  <div class="controls">
    <button class="button button-secondary" type="button" :disabled="!canGoBack" @click="emit('previous')">
      Retour
    </button>
    <button class="button button-primary" type="button" :disabled="!canGoNext" @click="emit('next')">
      {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
    </button>
  </div>
</template>
