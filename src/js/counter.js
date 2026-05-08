const counters = document.querySelectorAll('.stat__number')

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count)
      let startTime = null
      const duration = 1500

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        entry.target.textContent = Math.floor(eased * target)
        if (progress < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
      counterObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.5 })

counters.forEach(c => counterObserver.observe(c))
