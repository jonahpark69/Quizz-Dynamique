<script setup>
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'

const { isDark, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="app-shell">
    <header class="app-topbar">
      <strong class="app-topbar__brand">Quizz Dynamique</strong>
      <button type="button" class="app-topbar__theme-button" @click="toggleTheme">
        {{ isDark ? 'Mode clair' : 'Mode sombre' }}
      </button>
    </header>

    <RouterView />
  </div>
</template>
