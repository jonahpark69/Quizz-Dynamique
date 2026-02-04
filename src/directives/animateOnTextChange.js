export const vAnimateOnTextChange = {
  updated(el, binding) {
    if (binding.value === binding.oldValue) {
      return
    }

    el.classList.remove('question-animate')
    void el.offsetWidth
    el.classList.add('question-animate')
  }
}
