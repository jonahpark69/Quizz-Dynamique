<script setup>
defineProps({
  score: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  isFinished: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <footer class="quiz-footer">
    <p v-if="isFinished" class="quiz-footer__result">
      Resultat final: {{ score }} / {{ total }} | Record: {{ bestScore }}
    </p>
    <p v-else class="quiz-footer__status">Bonne chance !</p>
  </footer>
</template>
