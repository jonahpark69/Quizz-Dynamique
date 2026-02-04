<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  selectedValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['answer'])

const handleAnswer = (value) => {
  emit('answer', value)
}
</script>

<template>
  <article class="card">
    <p class="quiz-theme">{{ props.question.theme }}</p>
    <h2>{{ props.question.question }}</h2>

    <div class="answer-list">
      <button
        v-for="answer in props.question.answers"
        :key="answer.value"
        class="button button-secondary answer-button"
        :class="{ selected: props.selectedValue === answer.value }"
        type="button"
        @click="handleAnswer(answer.value)"
      >
        {{ answer.label }}
      </button>
    </div>
  </article>
</template>
