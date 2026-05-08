const revealElements = document.querySelectorAll('.animate-reveal')

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

revealElements.forEach(el => observer.observe(el))
