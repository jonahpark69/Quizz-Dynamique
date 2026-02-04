<script setup>
const props = defineProps({
  scoreLabel: {
    type: String,
    default: ''
  },
  bestScore: {
    type: Number,
    default: 0
  },
  statsSummary: {
    type: Object,
    required: true
  },
  statsEntries: {
    type: Array,
    default: () => []
  },
  rewards: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['restart', 'share'])

function getDifficultyLabel(difficulty) {
  if (difficulty === 'easy') return 'Facile'
  if (difficulty === 'hard') return 'Difficile'
  return 'Moyen'
}

function getStatusLabel(entry) {
  if (entry.timedOut) return 'Temps écoulé'
  return entry.isCorrect ? 'Bonne réponse' : 'Mauvaise réponse'
}

function getStatusClass(entry) {
  if (entry.timedOut) return 'stats-badge stats-badge--timeout'
  return entry.isCorrect ? 'stats-badge stats-badge--good' : 'stats-badge stats-badge--bad'
}

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '0s'
  }
  return `${value.toFixed(1)} s`
}
</script>

<template>
  <section id="result-screen" class="card screen screen-visible">
    <h2 class="result-title">Résultat final</h2>
    <div class="result-scores">
      <p class="score-final">{{ scoreLabel }}</p>
      <p class="score-line">
        <span>Meilleur score :</span>
        <span>{{ bestScore }}</span>
      </p>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" type="button" @click="emit('restart')">Recommencer</button>
      <button class="btn btn-secondary" type="button" @click="emit('share')">
        Partager sur Twitter
      </button>
    </div>
  </section>

  <section id="rewards-screen" class="card screen screen-visible">
    <h2 class="result-title">Récompenses</h2>
    <p class="notice">Débloquez des badges selon vos performances pour progresser.</p>
    <div class="rewards-list">
      <div
        v-for="reward in rewards"
        :key="reward.id"
        class="reward-card"
        :class="reward.earned ? 'reward-card--earned' : 'reward-card--locked'"
      >
        <div class="reward-card__icon">{{ reward.icon }}</div>
        <div class="reward-card__title">{{ reward.title }}</div>
        <div class="reward-card__desc">{{ reward.description }}</div>
        <div class="reward-card__status">{{ reward.status }}</div>
      </div>
    </div>
  </section>

  <section id="stats-screen" class="card screen screen-visible">
    <h2>Statistiques détaillées</h2>
    <p class="notice">Analysez vos forces et vos axes d'amélioration pour progresser.</p>

    <div class="stats-summary">
      <div class="stat-card">
        <span class="stat-label">Bonnes réponses</span>
        <span class="stat-value">{{ statsSummary.correctCount }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Mauvaises réponses</span>
        <span class="stat-value">{{ statsSummary.wrongCount }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Temps moyen / question</span>
        <span class="stat-value">{{ statsSummary.averageTimeLabel }}</span>
      </div>
    </div>

    <div class="stats-list">
      <div v-for="(entry, index) in props.statsEntries" :key="`${index}-${entry.text}`" class="stats-item">
        <div class="stats-question">{{ index + 1 }}. {{ entry.text }}</div>
        <div class="stats-meta">
          <span class="stats-badge" :class="`stats-badge--${entry.difficulty || 'medium'}`">
            {{ getDifficultyLabel(entry.difficulty) }}
          </span>
          <span :class="getStatusClass(entry)">{{ getStatusLabel(entry) }}</span>
          <span class="stats-time">{{ formatTime(entry.timeSpent) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
