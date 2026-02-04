function applyStagger(el, binding) {
  const step = Number(binding?.value?.step) || 70
  Array.from(el.children).forEach((child, index) => {
    const answerButton = child.querySelector('.answer-btn')
    if (!answerButton) {
      return
    }

    answerButton.classList.add('is-revealed')
    answerButton.style.setProperty('--stagger', `${index * step}ms`)
  })
}

export const vStaggerAnswers = {
  mounted(el, binding) {
    applyStagger(el, binding)
  },
  updated(el, binding) {
    applyStagger(el, binding)
  }
}
