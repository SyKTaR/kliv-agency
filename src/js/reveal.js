const revealElements = document.querySelectorAll('.animate-reveal')
const heroRevealElements = document.querySelectorAll('.hero .animate-reveal')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0
      setTimeout(() => {
        entry.target.classList.add('is-visible')
      }, delay * 120)
      observer.unobserve(entry.target)
    }
  })
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px'
})

revealElements.forEach((element) => {
  if (!element.closest('.hero')) observer.observe(element)
})

const startHeroReveal = () => {
  heroRevealElements.forEach((element) => {
    if (reducedMotion) {
      element.classList.add('is-visible')
    } else {
      observer.observe(element)
    }
  })
}

if (document.documentElement.classList.contains('is-intro-active')) {
  window.addEventListener('kliv:intro-complete', startHeroReveal, { once: true })
} else {
  startHeroReveal()
}

document.documentElement.classList.remove('reveal-fallback')
