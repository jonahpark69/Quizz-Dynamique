export function loadFromLocalStorage(key, fallbackValue = null) {
  try {
    const rawValue = localStorage.getItem(key)
    if (rawValue === null) {
      return fallbackValue
    }

    return JSON.parse(rawValue)
  } catch (error) {
    return fallbackValue
  }
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}
