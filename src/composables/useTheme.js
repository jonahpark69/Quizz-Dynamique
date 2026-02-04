import { ref } from 'vue'

const THEME_KEY = 'theme'
const DARK_CLASS = 'dark-mode'
const isDark = ref(false)

function applyThemeClass() {
  document.documentElement.classList.toggle(DARK_CLASS, isDark.value)
}

function initTheme() {
  const rawTheme = localStorage.getItem(THEME_KEY)
  let storedTheme = rawTheme

  if (rawTheme && rawTheme !== 'dark' && rawTheme !== 'light') {
    try {
      storedTheme = JSON.parse(rawTheme)
    } catch (error) {
      storedTheme = null
    }
  }

  if (storedTheme === 'dark' || storedTheme === 'light') {
    isDark.value = storedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyThemeClass()
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyThemeClass()
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
