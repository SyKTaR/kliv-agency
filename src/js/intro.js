const root = document.documentElement
const overlay = document.getElementById('kliv-intro')
const shouldPlay = root.dataset.intro === 'play'

if (shouldPlay) {
  const reducedMotion = root.dataset.introMotion === 'reduced'
  const timers = new Set()
  let finished = false

  const schedule = (callback, delay) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer)
      callback()
    }, delay)

    timers.add(timer)
  }

  const releaseHero = (reason) => {
    window.__klivIntroReleaseHero?.(reason)
  }

  const finish = (reason) => {
    if (finished) return
    finished = true
    timers.forEach(window.clearTimeout)
    timers.clear()
    overlay?.removeEventListener('animationend', handleAnimationEnd)
    window.__klivIntroFailOpen?.(reason)
  }

  const handleAnimationEnd = (event) => {
    if (event.animationName === 'intro-panel-bottom-open') {
      finish('animation-complete')
    }
  }

  try {
    if (!overlay) {
      finish('missing-overlay')
    } else if (reducedMotion) {
      overlay.classList.add('is-reduced')
      schedule(() => {
        releaseHero('reduced-motion')
        overlay.classList.add('is-reduced-exiting')
      }, 180)
      schedule(() => finish('reduced-motion-complete'), 300)
    } else {
      overlay.addEventListener('animationend', handleAnimationEnd)
      window.requestAnimationFrame(() => overlay.classList.add('is-running'))
      schedule(() => releaseHero('opening-overlap'), 1680)
      schedule(() => finish('timeline-complete'), 1820)
    }
  } catch {
    finish('controller-error')
  }
}
