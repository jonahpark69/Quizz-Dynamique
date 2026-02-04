<script setup>
defineProps({
  showNext: {
    type: Boolean,
    default: false
  },
  canNext: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['next', 'restart-theme', 'back-home'])
</script>

<template>
  <div class="question-nav">
    <button
      class="btn btn-secondary"
      :class="{ hidden: !showNext }"
      type="button"
      :disabled="!canNext"
      @click="emit('next')"
    >
      Question suivante
    </button>
    <button class="btn btn-secondary btn-restart" type="button" @click="emit('restart-theme')">
      Recommencer
    </button>
    <button class="btn btn-secondary btn-back" type="button" @click="emit('back-home')">
      Retour
    </button>
  </div>
</template>
