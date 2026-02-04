<script setup>
defineProps({
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <header class="card">
    <h1>Quiz dynamique</h1>
    <p class="quiz-progress">Question {{ current }} / {{ total }}</p>
  </header>
</template>
