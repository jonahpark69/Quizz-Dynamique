export function startTimer({
  duration,
  intervalMs = 1000,
  onTick = () => {},
  onComplete = () => {}
}) {
  let remaining = Math.max(0, Number(duration) || 0)
  let timerId = null

  onTick(remaining)

  if (remaining <= 0) {
    onComplete()
    return {
      stop() {}
    }
  }

  timerId = window.setInterval(() => {
    remaining -= 1
    onTick(Math.max(remaining, 0))

    if (remaining <= 0) {
      window.clearInterval(timerId)
      timerId = null
      onComplete()
    }
  }, intervalMs)

  return {
    stop() {
      if (timerId !== null) {
        window.clearInterval(timerId)
        timerId = null
      }
    }
  }
}
