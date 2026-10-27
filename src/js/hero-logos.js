import { gsap } from 'gsap'

// Le logement du titre fait défiler les plateformes citées dans le marquee.
// Sans JS ou en reduced-motion : le premier logo reste affiché, fixe.
const slot = document.querySelector('[data-hero-logos]')
const imgs = slot ? [...slot.querySelectorAll('img')] : []
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (slot && imgs.length > 1 && !reduce) {
  let current = 0
  let timer = null
  let visible = true
  let running = false

  const next = () => {
    if (document.hidden || !visible) return schedule()
    const from = imgs[current]
    current = (current + 1) % imgs.length
    const to = imgs[current]
    const tl = gsap.timeline({ onComplete: schedule })
    tl.to(from, { yPercent: -22, scale: 0.72, rotate: -10, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0)
      .fromTo(to, { yPercent: 22, scale: 0.72, rotate: 10, opacity: 0 },
        { yPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.18)
      .set(from, { clearProps: 'transform' })
  }
  const schedule = () => { clearTimeout(timer); timer = setTimeout(next, 1500) }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }).observe(slot)
  // On laisse l'entrée de page se terminer avant de lancer la rotation.
  timer = setTimeout(next, 2400)
}
