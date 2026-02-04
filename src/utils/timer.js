export function startTimer(duration, onTick = () => {}, onComplete = () => {}) {
  let timeLeft = Number.isFinite(duration) ? duration : 0
  onTick(timeLeft)

  const timerId = window.setInterval(() => {
    timeLeft -= 1
    onTick(Math.max(timeLeft, 0))
    if (timeLeft <= 0) {
      window.clearInterval(timerId)
      onComplete()
    }
  }, 1000)

  return timerId
}

export function stopTimer(timerId) {
  if (timerId) {
    window.clearInterval(timerId)
  }
}
