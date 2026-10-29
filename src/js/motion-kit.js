import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/*
 * Briques communes aux animations des pages internes (service-motion.js, about-motion.js).
 * Même signature que home-motion.js : contenu visible par défaut, états cachés posés en JS
 * uniquement hors reduced-motion (gsap.matchMedia), transform/opacity, clearProps à la fin.
 */
gsap.registerPlugin(ScrollTrigger, SplitText)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText }
export const NO_MOTION = '(prefers-reduced-motion: no-preference)'
export const root = document.documentElement
export const $ = (selector, scope = document) => scope.querySelector(selector)
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)]
export const small = window.matchMedia('(max-width: 767px)').matches
export const speed = small ? 0.85 : 1
export const CLEAR = 'opacity,transform,willChange,transformOrigin'

// Cascade au scroll d'un groupe d'éléments. Les éléments déjà dépassés (ancre, rechargement
// en milieu de page) sont révélés dès la création du ScrollTrigger.
export const revealBatch = (targets, { y = 28, duration = 0.8, stagger = 0.09, start = 'clamp(top 90%)', onReveal } = {}) => {
  const els = typeof targets === 'string' ? $$(targets) : targets
  if (!els.length) return
  gsap.set(els, { opacity: 0, y: y * (small ? 0.7 : 1), willChange: 'transform, opacity' })
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: batch => {
      gsap.to(batch, { opacity: 1, y: 0, duration: duration * speed, stagger, ease: 'power3.out', overwrite: true, clearProps: CLEAR })
      onReveal?.(batch)
    },
  })
}

// Révélation d'un bloc (ses enfants en cascade) quand il entre dans l'écran.
export const revealGroup = (host, items, { y = 22, duration = 0.8, stagger = 0.1, start = 'clamp(top 88%)' } = {}) => {
  items = items.filter(Boolean)
  if (!host || !items.length) return
  gsap.from(items, {
    opacity: 0, y: y * (small ? 0.7 : 1), duration: duration * speed, stagger, ease: 'power3.out',
    clearProps: CLEAR, scrollTrigger: { trigger: host, start, once: true },
  })
}

// Panneau (bloc noir, bloc bleu, footer) : léger scale + translate.
export const revealPanel = (panel, { y = 40, scale = 0.965, duration = 1, start = 'clamp(top 92%)' } = {}) => {
  if (!panel) return
  gsap.from(panel, {
    opacity: 0, scale, y: y * (small ? 0.7 : 1), transformOrigin: '50% 0%', duration: duration * speed, ease: 'power3.out',
    clearProps: CLEAR, scrollTrigger: { trigger: panel, start, once: true },
  })
}

// CTA final / footer partagé : bloc en fondu/translate puis intro et boutons en cascade.
export const footerMotion = () => {
  const footer = $('.kliv-footer__block')
  if (!footer) return
  revealPanel(footer, { y: 40, scale: 0.985, duration: 1, start: 'clamp(top 94%)' })
  revealGroup(footer, [...$$('.kliv-footer__intro > *', footer), ...$$('.kliv-footer__buttons > *', footer)], { y: 18, stagger: 0.08, start: 'clamp(top 80%)' })
}

// Survol/focus : renvoie la fonction de nettoyage.
export const bindHover = (el, enter, leave) => {
  const pairs = [['pointerenter', enter], ['pointerleave', leave], ['focusin', enter], ['focusout', leave]]
  pairs.forEach(([type, fn]) => el.addEventListener(type, fn))
  return () => pairs.forEach(([type, fn]) => el.removeEventListener(type, fn))
}

// Titre ou citation découpé ligne par ligne, masqué (le texte réel reste dans le DOM, aria: none).
export const splitLines = el => {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'none' })
  // Le masque ne doit pas rogner jambages ni italiques : clip-path élargi, sans effet sur la mise en page.
  split.masks.forEach(mask => Object.assign(mask.style, { overflow: 'visible', clipPath: 'inset(-.12em -.2em)' }))
  return split
}

// Ancre dans l'URL : le défilement lissé natif serait interrompu par les refresh de ScrollTrigger
// (la page resterait en haut). Pendant le chargement uniquement, on se place donc instantanément.
export const anchorFix = () => {
  const hashTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1))
    return id ? document.getElementById(id) : null
  }
  let loading = true // le saut n'a lieu que pendant le chargement, jamais après une action de l'utilisateur
  const endLoading = () => { loading = false }
  ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(type => window.addEventListener(type, endLoading, { passive: true, once: true }))
  setTimeout(endLoading, 2500)
  const jumpToHash = () => { if (loading) hashTarget()?.scrollIntoView({ behavior: 'instant', block: 'start' }) }
  jumpToHash()

  // Positions recalculées quand polices et images ont fini de charger.
  const refresh = () => { jumpToHash(); ScrollTrigger.refresh() }
  if (document.readyState === 'complete') refresh()
  else window.addEventListener('load', refresh, { once: true })
  document.fonts?.ready.then(refresh)
}
