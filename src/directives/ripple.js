export const vRipple = {
  mounted(el) {
    const onClick = (event) => {
      if (el.disabled) {
        return
      }

      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const ripple = document.createElement('span')

      ripple.className = 'ripple'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`

      el.appendChild(ripple)
      ripple.addEventListener('animationend', () => {
        ripple.remove()
      })
    }

    el.__rippleClickHandler = onClick
    el.addEventListener('click', onClick)
  },
  unmounted(el) {
    if (el.__rippleClickHandler) {
      el.removeEventListener('click', el.__rippleClickHandler)
      delete el.__rippleClickHandler
    }
  }
}
