import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/*
 * Animations de la home KLIV.
 * Principe : le contenu est visible par défaut (HTML/CSS). Tous les états
 * « cachés » sont posés ici, en JS, uniquement si prefers-reduced-motion n'est
 * pas activé (gsap.matchMedia). Tout est annulé proprement si la préférence
 * change. Seuls transform et opacity sont animés (hors hauteur des réponses FAQ).
 */
gsap.registerPlugin(ScrollTrigger, SplitText)
ScrollTrigger.config({ ignoreMobileResize: true })

const NO_MOTION = '(prefers-reduced-motion: no-preference)'
const root = document.documentElement
const $ = (selector, scope = document) => scope.querySelector(selector)
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)]
const small = window.matchMedia('(max-width: 767px)').matches
const speed = small ? 0.85 : 1
const CLEAR = 'opacity,transform,willChange'

// Révélation au scroll d'un groupe d'éléments (cascade). Éléments déjà dépassés
// (ancre, rechargement en milieu de page) : ScrollTrigger les révèle à la création.
const revealBatch = (targets, { y = 28, duration = 0.8, stagger = 0.09, start = 'clamp(top 90%)' } = {}) => {
  const els = $$(targets)
  if (!els.length) return
  gsap.set(els, { opacity: 0, y: y * (small ? 0.7 : 1), willChange: 'transform, opacity' })
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: duration * speed, stagger, ease: 'power3.out', overwrite: true, clearProps: CLEAR,
    }),
  })
}

// Révélation d'un bloc (ses enfants en cascade) quand il entre dans l'écran.
const revealGroup = (trigger, children, { y = 22, duration = 0.8, stagger = 0.1, start = 'clamp(top 88%)' } = {}) => {
  const host = typeof trigger === 'string' ? $(trigger) : trigger
  if (!host) return
  const items = typeof children === 'string' ? $$(children, host) : children
  if (!items.length) return
  gsap.from(items, {
    opacity: 0, y: y * (small ? 0.7 : 1), duration: duration * speed, stagger, ease: 'power3.out',
    clearProps: CLEAR, scrollTrigger: { trigger: host, start, once: true },
  })
}

const mm = gsap.matchMedia()

/* 1. Entrée de page : ≤ 1,4 s, jamais de contenu caché sans JS */
mm.add(NO_MOTION, () => {
  const settle = () => root.classList.remove('kliv-motion-pending')
  let cancelled = false
  let hero
  const cleanups = []

  const build = () => {
    const lines = $$('.kliv-hero__line > span:first-child')
    const logos = $$('.kliv-hero__competitor, .kliv-hero__logo')
    const d = speed
    const fontsOk = !document.fonts?.check || (document.fonts.check('700 1em "Kliv Geist"') && document.fonts.check('italic 700 1em Fraunces'))
    hero = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: CLEAR, lazy: false } })
      tl.from('.kliv-nav', { y: -28, opacity: 0, duration: 0.7 * d }, 0)

      // Titre ligne par ligne, masqué. Le h1 garde son texte réel dans le DOM ; le split
      // est annulé (revert) à la première interaction, le balisage redevient alors le statique.
      if (lines.length && !fontsOk) {
        // Polices pas prêtes : un split mesurerait de mauvaises largeurs. Repli simple, sans découpage.
        tl.from(lines, { y: 18, opacity: 0, duration: 0.6 * d, stagger: 0.1 }, 0.05)
      } else if (lines.length) {
        // Les spans gardent leur boîte exacte pendant le split (sinon le logo, qui passe à la
        // ligne dans la version statique, remonterait à côté du texte puis sauterait au revert).
        lines.forEach(el => {
          const { width, height } = el.getBoundingClientRect()
          // 12 px de jeu (marges négatives symétriques : la boîte de mise en page ne change pas) :
          // les mots découpés mesurent un peu plus que le texte continu et feraient sinon passer à la ligne.
          Object.assign(el.style, { width: `${width + 12}px`, height: `${height}px`, flex: 'none', marginInline: '-6px' })
        })
        const split = SplitText.create(lines, { type: 'lines', mask: 'lines', aria: 'none' })
        // Le masque ne doit pas rogner jambages (p, q…) ni italiques : clip-path élargi, sans effet sur la mise en page.
        split.masks.forEach(mask => Object.assign(mask.style, { overflow: 'visible', clipPath: 'inset(-.12em -.2em)' }))
        // Le split n'est annulé qu'à la première interaction (ou après 8 s) : défaire le DOM
        // pendant la mesure du LCP recréerait les nœuds texte et repousserait le LCP d'~0,7 s.
        // Visuellement l'état est identique (boîtes figées ci-dessus).
        const restore = () => {
          events.forEach(type => window.removeEventListener(type, request))
          clearTimeout(timer)
          split.revert()
          lines.forEach(el => el.removeAttribute('style'))
        }
        const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'resize']
        const titleTween = gsap.from(split.lines, {
          yPercent: 110, duration: 0.7 * d, stagger: 0.11, ease: 'power4.out', delay: 0.05, lazy: false, clearProps: 'transform',
        })
        // Jamais de restauration en plein mouvement : on attend la fin du tween.
        const request = () => (titleTween.progress() >= 1 ? restore() : titleTween.eventCallback('onComplete', restore))
        const timer = setTimeout(request, 8000)
        events.forEach(type => window.addEventListener(type, request, { passive: true, once: true }))
        cleanups.push(restore)
      }

      tl.from(logos, { scale: 0.6, opacity: 0, duration: 0.6 * d, stagger: 0.12 }, 0.3 * d)
        .from('.kliv-hero__subtitle', { y: 16, opacity: 0, duration: 0.6 * d }, 0.4 * d)
        .from($$('.kliv-hero__buttons > *'), { y: 14, opacity: 0, duration: 0.55 * d, stagger: 0.09 }, 0.62 * d)
        .from('.kliv-tools', { opacity: 0, duration: 0.55 * d, clearProps: 'opacity' }, 0.8 * d)
    })
    settle() // états initiaux posés (from = rendu immédiat) : on lève le masquage CSS anti-FOUC
  }

  // On attend les polices (200 ms max) pour que les lignes soient découpées avec les
  // bonnes métriques ; le masquage CSS de secours se lève de toute façon à 1,4 s.
  const fontReady = document.fonts?.load
    ? Promise.all([document.fonts.load('700 64px "Kliv Geist"'), document.fonts.load('italic 700 64px Fraunces')]).catch(() => {})
    : Promise.resolve()
  Promise.race([fontReady, new Promise(resolve => setTimeout(resolve, 200))]).then(() => { if (!cancelled) build() })

  return () => { cancelled = true; cleanups.forEach(fn => fn()); hero?.revert(); settle() }
})

/* 2 → 7. Sections au scroll */
mm.add(NO_MOTION, () => {
  // En-têtes de section
  $$('.kliv-header').forEach(header => revealGroup(header, [...header.children]))
  revealGroup('#faq', '#faq-title', { y: 18 })

  // Services : lignes en cascade
  revealBatch('.kliv-services__list > li', { y: 24, stagger: 0.08 })

  // Bloc bleu : le panneau entre, puis stats et cartes anthracite
  const panel = $('.kliv-approach')
  if (panel) {
    gsap.from(panel, {
      opacity: 0, scale: 0.965, y: 40, transformOrigin: '50% 0%', duration: 1 * speed, ease: 'power3.out',
      clearProps: CLEAR, scrollTrigger: { trigger: panel, start: 'clamp(top 92%)', once: true },
    })
  }
  revealBatch('.kliv-pillar', { y: 36, stagger: 0.12, duration: 0.85 })

  // Compteurs : la valeur finale reste dans le HTML ; le décompte est purement visuel.
  const counters = $$('.kliv-stats dd').map(dd => {
    const node = [...dd.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.nodeValue))
    return node ? { dd, node, final: node.nodeValue, value: parseInt(node.nodeValue, 10) } : null
  }).filter(Boolean)
  const stats = $('.kliv-stats')
  if (stats && counters.length) {
    gsap.from(stats, {
      opacity: 0, y: 28 * (small ? 0.7 : 1), duration: 0.9 * speed, ease: 'power3.out', clearProps: CLEAR,
      scrollTrigger: { trigger: stats, start: 'clamp(top 88%)', once: true },
    })
    ScrollTrigger.create({
      trigger: stats, start: 'clamp(top 80%)', once: true,
      onEnter: () => counters.forEach(({ dd, node, final, value }, i) => {
        // Boîte à largeur finale : le décompte ne décale ni le « h », ni le « + », ni le « % ».
        const box = document.createElement('span')
        box.style.cssText = 'display:inline-block;text-align:left'
        dd.insertBefore(box, node)
        box.appendChild(node)
        box.style.minWidth = `${box.getBoundingClientRect().width}px`
        const state = { v: 0 }
        node.nodeValue = '0'
        gsap.to(state, {
          v: value, duration: 1.5 * speed, delay: i * 0.12, ease: 'power2.out',
          onUpdate: () => { node.nodeValue = String(Math.round(state.v)) },
          onComplete: () => { node.nodeValue = final; box.replaceWith(node) },
        })
      }),
    })
  }

  // Réalisations : cascade
  revealBatch('.kliv-project', { y: 40, stagger: 0.12, duration: 0.9 })
  revealGroup('.kliv-projects__cta', '.kliv-projects__cta > *', { y: 16, stagger: 0.08, start: 'clamp(top 94%)' })

  // Contact
  revealGroup('.kliv-tabs', [$('.kliv-tabs'), $('.kliv-contact__card')].filter(Boolean), { y: 24, stagger: 0.12, start: 'clamp(top 92%)' })

  // CTA final / footer
  const footer = $('.kliv-footer__block')
  if (footer) {
    gsap.from(footer, {
      opacity: 0, y: 40 * (small ? 0.7 : 1), scale: 0.985, transformOrigin: '50% 0%', duration: 1 * speed, ease: 'power3.out',
      clearProps: CLEAR, scrollTrigger: { trigger: footer, start: 'clamp(top 94%)', once: true },
    })
    revealGroup(footer, [...$$('.kliv-footer__intro > *'), ...$$('.kliv-footer__buttons > *')], { y: 18, stagger: 0.08, start: 'clamp(top 80%)' })
  }

  return () => counters.forEach(({ node, final }) => { node.nodeValue = final })
})

/* 4. Parallaxe des captures (desktop uniquement, amplitude faible) */
mm.add(`${NO_MOTION} and (min-width: 768px)`, () => {
  $$('.kliv-project__shot img').forEach(img => {
    gsap.set(img, { scale: 1.05, transformOrigin: '50% 0%' })
    gsap.fromTo(img, { yPercent: 0 }, {
      yPercent: -4.5, ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.kliv-project'), start: 'top bottom', end: 'bottom top', scrub: 0.6,
        onToggle: self => { img.style.willChange = self.isActive ? 'transform' : '' },
      },
    })
  })
})

/* 4. Survol des projets (le survol des services est en CSS pur, home.css) (appareils à pointeur précis uniquement) */
mm.add(`${NO_MOTION} and (hover: hover) and (pointer: fine)`, () => {
  const off = []
  $$('.kliv-project').forEach(card => {
    const enter = () => gsap.to(card, { y: -6, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    const leave = () => gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' })
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    off.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave) })
  })
  return () => off.forEach(fn => fn())
})

/* 5. FAQ : ouverture/fermeture animées, details natif conservé */
mm.add(NO_MOTION, () => {
  const list = $('.kliv-faq__list')
  const items = $$('.kliv-faq__item')
  if (!list || !items.length) return
  list.dataset.motion = 'on'
  const names = items.map(item => item.getAttribute('name'))
  items.forEach(item => item.removeAttribute('name')) // l'exclusivité est gérée ici, avec animation

  const parts = item => ({
    summary: $('summary', item), answer: $('.kliv-faq__answer', item), icon: $('.kliv-faq__icon', item),
  })
  const open = item => {
    const { summary, answer, icon } = parts(item)
    delete item.dataset.closing
    summary.setAttribute('aria-expanded', 'true')
    // On ouvre d'abord le details : la valeur de padding n'est fiable qu'une fois la réponse rendue
    // (sinon elle vaut 0 et le padding réapparaît d'un coup à la fin de l'animation).
    if (!item.open) item.open = true
    const pb = getComputedStyle(answer).paddingBottom
    // Hauteur cible en px, padding inclus (box-sizing: border-box) : avec 'auto', GSAP la mesure
    // alors que le padding est à 0 et la réponse gagne ~20 px d'un coup en fin d'animation.
    const full = gsap.isTweening(answer) ? answer.scrollHeight : answer.getBoundingClientRect().height
    if (!gsap.isTweening(answer)) gsap.set(answer, { height: 0, opacity: 0, paddingBottom: 0, overflow: 'hidden' })
    gsap.to(answer, {
      height: full, opacity: 1, paddingBottom: pb, duration: 0.5 * speed, ease: 'power3.out', overwrite: 'auto',
      onComplete: () => gsap.set(answer, { clearProps: 'height,opacity,paddingBottom,overflow' }),
    })
    gsap.to(icon, { rotation: 180, duration: 0.4 * speed, ease: 'power3.out', overwrite: 'auto' })
  }
  const close = item => {
    const { summary, answer, icon } = parts(item)
    item.dataset.closing = 'true'
    summary.setAttribute('aria-expanded', 'false')
    gsap.set(answer, { overflow: 'hidden' })
    gsap.to(answer, {
      height: 0, opacity: 0, paddingBottom: 0, duration: 0.38 * speed, ease: 'power2.inOut', overwrite: 'auto',
      onComplete: () => {
        item.open = false
        delete item.dataset.closing
        gsap.set(answer, { clearProps: 'height,opacity,paddingBottom,overflow' })
      },
    })
    gsap.to(icon, { rotation: 0, duration: 0.4 * speed, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' })
  }
  const handlers = items.map(item => {
    const summary = $('summary', item)
    const onClick = event => {
      event.preventDefault() // on pilote nous-mêmes l'attribut open, pour animer
      const isOpen = item.open && !item.dataset.closing
      if (isOpen) return close(item)
      items.forEach(other => { if (other !== item && other.open && !other.dataset.closing) close(other) })
      open(item)
    }
    summary.addEventListener('click', onClick)
    return () => summary.removeEventListener('click', onClick)
  })

  return () => {
    handlers.forEach(fn => fn())
    items.forEach((item, i) => {
      const { answer, icon } = parts(item)
      gsap.killTweensOf([answer, icon])
      gsap.set([answer, icon], { clearProps: 'all' })
      delete item.dataset.closing
      if (names[i]) item.setAttribute('name', names[i])
    })
    delete list.dataset.motion
  }
})

/* 6. Contact : indicateur du switch + transition entre panneaux */
mm.add(NO_MOTION, () => {
  const tablist = $('.kliv-tabs')
  const tabs = $$('[role="tab"]', tablist || document)
  if (!tablist || tabs.length < 2) return
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')))
  const indicator = document.createElement('span')
  indicator.className = 'kliv-tabs__indicator'
  indicator.setAttribute('aria-hidden', 'true')
  tablist.prepend(indicator)
  tablist.dataset.motion = 'on'

  const current = () => tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')
  let active = Math.max(current(), 0)
  const geometry = tab => ({ x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight })
  gsap.set(indicator, geometry(tabs[active]))

  const tabObserver = new MutationObserver(() => {
    const next = current()
    if (next < 0 || next === active) return
    active = next
    gsap.to(indicator, { ...geometry(tabs[next]), duration: 0.42, ease: 'power3.out', overwrite: 'auto' })
  })
  tabObserver.observe(tablist, { attributes: true, attributeFilter: ['aria-selected'], subtree: true })

  const resizeObserver = new ResizeObserver(() => gsap.set(indicator, geometry(tabs[Math.max(current(), 0)])))
  resizeObserver.observe(tablist)

  // Le panneau qui devient visible arrive en fondu, légèrement glissé dans le sens de l'onglet.
  const panelObserver = new MutationObserver(records => {
    records.forEach(({ target }) => {
      if (target.hidden) return
      const direction = panels.indexOf(target) > 0 ? 1 : -1
      gsap.fromTo(target, { opacity: 0, x: 18 * direction }, {
        opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto', clearProps: 'opacity,transform',
      })
    })
  })
  panels.filter(Boolean).forEach(panel => panelObserver.observe(panel, { attributes: true, attributeFilter: ['hidden'] }))

  return () => {
    tabObserver.disconnect(); resizeObserver.disconnect(); panelObserver.disconnect()
    gsap.killTweensOf([indicator, ...panels])
    gsap.set(panels.filter(Boolean), { clearProps: 'opacity,transform' })
    indicator.remove()
    delete tablist.dataset.motion
  }
})

// Positions recalculées quand polices et images ont fini de charger.
const refresh = () => ScrollTrigger.refresh()
if (document.readyState === 'complete') refresh()
else window.addEventListener('load', refresh, { once: true })
document.fonts?.ready.then(refresh)
