export const vAnimateOnTextChange = {
  mounted(el) {
    el.classList.add('text-change-base')
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) {
      return
    }

    el.classList.remove('text-change-animate')
    void el.offsetWidth
    el.classList.add('text-change-animate')
  }
}
