import { ref } from 'vue'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'

const THEME_KEY = 'quiz-theme-preference'
const DARK_CLASS = 'theme-dark'

const isDark = ref(false)
let isInitialized = false

function applyThemeClass() {
  document.documentElement.classList.toggle(DARK_CLASS, isDark.value)
}

function initTheme() {
  if (isInitialized) {
    applyThemeClass()
    return
  }

  const savedTheme = loadFromLocalStorage(THEME_KEY, null)
  if (savedTheme === 'dark' || savedTheme === 'light') {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  applyThemeClass()
  isInitialized = true
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyThemeClass()
  saveToLocalStorage(THEME_KEY, isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
