(() => {
  const markLoaded = () => {
    document.body.classList.add("is-loaded");
  };

  const triggerScreenAnimation = (screen) => {
    screen.classList.remove("screen-visible");
    void screen.offsetWidth;
    screen.classList.add("screen-visible");
  };

  const setupScreenObservers = () => {
    const screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
      if (screen.style.display !== "none") {
        triggerScreenAnimation(screen);
      }

      const observer = new MutationObserver(() => {
        if (screen.style.display !== "none") {
          triggerScreenAnimation(screen);
        }
      });
      observer.observe(screen, { attributes: true, attributeFilter: ["style"] });
    });
  };

  const setupQuestionAnimation = () => {
    const question = document.querySelector("#question-text");
    if (!question) {
      return;
    }

    const animate = () => {
      question.classList.remove("question-animate");
      void question.offsetWidth;
      question.classList.add("question-animate");
    };

    const observer = new MutationObserver(animate);
    observer.observe(question, { characterData: true, childList: true, subtree: true });
  };

  const setupAnswerAnimations = () => {
    const answers = document.querySelector("#answers");
    if (!answers) {
      return;
    }

    const applyStagger = () => {
      const buttons = answers.querySelectorAll("button");
      buttons.forEach((button, index) => {
        button.classList.add("answer-btn", "is-revealed");
        button.style.setProperty("--stagger", `${index * 70}ms`);
      });
    };

    const observer = new MutationObserver(applyStagger);
    observer.observe(answers, { childList: true });
    applyStagger();
  };

  const setupRipple = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) {
        return;
      }

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  };

  const setupTimerWarnings = () => {
    const watchTimer = (selector, threshold) => {
      const valueElement = document.querySelector(selector);
      if (!valueElement) {
        return;
      }

      const timer = valueElement.closest(".timer");
      if (!timer) {
        return;
      }

      const update = () => {
        const value = parseInt(valueElement.textContent, 10);
        if (Number.isFinite(value) && value <= threshold) {
          timer.classList.add("timer--warning");
        } else {
          timer.classList.remove("timer--warning");
        }
      };

      const observer = new MutationObserver(update);
      observer.observe(valueElement, { childList: true, subtree: true });
      update();
    };

    watchTimer("#time-left", 3);
    watchTimer("#global-time-left", 10);
  };

  const init = () => {
    markLoaded();
    setupScreenObservers();
    setupQuestionAnimation();
    setupAnswerAnimations();
    setupRipple();
    setupTimerWarnings();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
