<script setup>
defineProps({
  isFinished: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <main class="quiz-layout" :class="{ 'is-finished': isFinished }">
    <div class="quiz-layout__inner">
      <slot />
    </div>
  </main>
</template>
