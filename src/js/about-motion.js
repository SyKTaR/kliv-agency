import { gsap, ScrollTrigger, NO_MOTION, root, $, $$, small, speed, CLEAR, revealBatch, revealGroup, revealPanel, footerMotion, bindHover, splitLines, anchorFix } from './motion-kit.js'

/*
 * Animations de la page À propos (même signature que service-motion.js / home-motion.js ; helpers dans motion-kit.js).
 * Le contenu est visible par défaut. Les états « cachés » sont posés ici, en JS, hors reduced-motion
 * (gsap.matchMedia), et annulés si la préférence change. transform et opacity uniquement.
 * Chaque séquence ne joue qu'une fois : pas de boucle, pas de pin, pas de parallaxe.
 */
const mm = gsap.matchMedia()
const y = n => n * (small ? 0.7 : 1)

/* 1. Entrée de page : navbar, fil d'Ariane, h1 ligne par ligne, texte, boutons, photo, puis pastilles en décalé */
mm.add(NO_MOTION, () => {
  const settle = () => root.classList.remove('kliv-motion-pending')
  let cancelled = false
  let hero
  const cleanups = []

  const build = () => {
    const h1 = $('.service-hero h1')
    const d = speed
    const fontsOk = !document.fonts?.check || (document.fonts.check('700 1em "Kliv Geist"') && document.fonts.check('italic 700 1em Fraunces'))
    hero = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: CLEAR, lazy: false } })
      tl.from('.kliv-nav', { y: -28, opacity: 0, duration: 0.7 * d }, 0)
        .from('.service-breadcrumb', { y: 12, opacity: 0, duration: 0.55 * d }, 0.05 * d)

      // Le split du titre n'est défait qu'à la 1re interaction (ou après 8 s), comme sur la home et les services.
      if (h1 && !fontsOk) {
        tl.from(h1, { y: 18, opacity: 0, duration: 0.6 * d }, 0.1 * d)
      } else if (h1) {
        const split = splitLines(h1)
        const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'resize']
        const restore = () => {
          events.forEach(type => window.removeEventListener(type, request))
          clearTimeout(timer)
          split.revert()
        }
        const titleTween = gsap.from(split.lines, { yPercent: 110, duration: 0.7 * d, stagger: 0.11, ease: 'power4.out', delay: 0.1 * d, lazy: false, clearProps: 'transform' })
        const request = () => (titleTween.progress() >= 1 ? restore() : titleTween.eventCallback('onComplete', restore))
        const timer = setTimeout(request, 8000)
        events.forEach(type => window.addEventListener(type, request, { passive: true, once: true }))
        cleanups.push(restore)
      }

      tl.from('.service-hero__lead', { y: 16, opacity: 0, duration: 0.6 * d }, 0.3 * d)
        .from($$('.service-actions > *', $('.service-hero')), { y: 14, opacity: 0, duration: 0.55 * d, stagger: 0.09 }, 0.45 * d)
        // La photo entre en fondu + très léger scale (le cadre arrondi reste en place), puis les pastilles une à une.
        .from('.about-hero__photo', { opacity: 0, duration: 0.8 * d }, 0.3 * d)
        .from('.about-hero__photo img', { scale: 1.06, duration: 1.1 * d, ease: 'power2.out' }, 0.3 * d)
        .from('.about-hero__place', { opacity: 0, y: -10, scale: 0.94, duration: 0.55 * d, transformOrigin: '100% 50%' }, 0.85 * d)
        .from('.about-hero__reply', { opacity: 0, x: -12, scale: 0.94, duration: 0.55 * d, transformOrigin: '0% 50%' }, 0.98 * d)
        .from('.about-hero__id', { opacity: 0, y: 14, scale: 0.96, duration: 0.6 * d, transformOrigin: '0% 100%' }, 1.1 * d)
      // Le conteneur .about-hero__stage n'est qu'un repère de position : il ne porte aucune animation propre.
    })
    settle() // états initiaux posés : on lève le masquage CSS anti-FOUC
  }

  const fontReady = document.fonts?.load
    ? Promise.all([document.fonts.load('700 64px "Kliv Geist"'), document.fonts.load('italic 700 64px Fraunces')]).catch(() => {})
    : Promise.resolve()
  Promise.race([fontReady, new Promise(resolve => setTimeout(resolve, 200))]).then(() => { if (!cancelled) build() })

  return () => { cancelled = true; cleanups.forEach(fn => fn()); hero?.revert(); settle() }
})

/* 2. Citation : révélée ligne par ligne (split à l'entrée, défait à la fin), puis les 3 pills */
mm.add(NO_MOTION, () => {
  const section = $('.about-quote')
  const quote = $('.about-quote__text')
  const tags = $$('.about-quote__tags > li')
  if (!section || !quote) return
  gsap.set(tags, { opacity: 0, y: y(14), willChange: 'transform, opacity' })
  gsap.set(quote, { opacity: 0 })
  let split
  ScrollTrigger.create({
    trigger: quote, start: 'clamp(top 85%)', once: true,
    onEnter: () => {
      split = splitLines(quote)
      gsap.set(quote, { opacity: 1 })
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(split.lines, { yPercent: 110, duration: 0.8 * speed, stagger: 0.12, ease: 'power4.out', clearProps: 'transform', onComplete: () => { split?.revert(); gsap.set(quote, { clearProps: 'opacity' }) } }, 0)
        .to(tags, { opacity: 1, y: 0, duration: 0.6 * speed, stagger: 0.1, clearProps: CLEAR }, 0.55)
    },
  })
  return () => { split?.revert(); gsap.set([quote, ...tags], { clearProps: CLEAR }) }
})

/* 3. Qui est derrière : photo (voile qui se lève), en-tête, lignes du tableau en cascade, liens */
mm.add(NO_MOTION, () => {
  const section = $('.about-who')
  if (!section) return
  const photo = $('.about-who__photo')
  const img = $('.about-who__photo img')
  gsap.from(photo, { opacity: 0, y: y(32), duration: 0.9 * speed, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: { trigger: photo, start: 'clamp(top 88%)', once: true } })
  gsap.from(img, { scale: 1.08, duration: 1.3 * speed, ease: 'power2.out', clearProps: 'transform', scrollTrigger: { trigger: photo, start: 'clamp(top 88%)', once: true } })
  const body = $('.about-who__body')
  revealGroup(body, [$('.service-pill', body), $('.service-title', body), $('.about-who__text', body)], { y: 20, stagger: 0.1, start: 'clamp(top 82%)' })
  const rows = $$('.about-facts__row', body)
  revealBatch(rows, { y: 14, stagger: 0.09, duration: 0.65, start: 'clamp(top 92%)' })
  revealBatch($$('.about-who__links a', body), { y: 12, stagger: 0.1, duration: 0.6, start: 'clamp(top 95%)' })
})

/* 4. Bloc noir : le bloc entre, puis en-tête + bouton, puis les 3 cartes (icône qui entre en rotation légère) */
mm.add(NO_MOTION, () => {
  const block = $('.about-studio')
  if (!block) return
  revealPanel(block, { y: 40, scale: 0.97, duration: 1 })
  const head = $('.about-studio__head', block)
  revealGroup(head, [...$$('.service-split__head > *', head), $('.about-studio__button', head)], { y: 18, stagger: 0.09, start: 'clamp(top 85%)' })
  const cards = $$('.service-case', block)
  const icons = cards.map(card => $('.service-case__tile .service-icon', card)).filter(Boolean)
  gsap.set(icons, { scale: 0.7, rotation: -14, opacity: 0 })
  revealBatch(cards, {
    y: 34, stagger: 0.12, duration: 0.85,
    onReveal: batch => gsap.to(batch.map(card => $('.service-case__tile .service-icon', card)).filter(Boolean), {
      scale: 1, rotation: 0, opacity: 1, duration: 0.7 * speed, ease: 'back.out(1.4)', stagger: 0.12, delay: 0.25, overwrite: 'auto', clearProps: CLEAR,
    }),
  })
  return () => gsap.set(icons, { clearProps: CLEAR })
})

/* 5. Ce que Kliv ne fait pas : en-tête, deux cartes, puis items un à un (×, puis ✓) */
mm.add(NO_MOTION, () => {
  const head = $('.about-commit .service-head')
  if (head) revealGroup(head, [...head.children], { y: 20, stagger: 0.09 })
  const cards = $$('.about-commit__card')
  revealBatch(cards, { y: 30, stagger: 0.14, duration: 0.85, start: 'clamp(top 88%)' })
  const grid = $('.about-commit__grid')
  if (!grid) return
  const groups = cards.map(card => $$('.about-list__item', card))
  const marks = groups.flat().map(item => $('.service-icon', item)).filter(Boolean)
  gsap.set(groups.flat(), { opacity: 0, y: y(14), willChange: 'transform, opacity' })
  gsap.set(marks, { scale: 0.5 })
  ScrollTrigger.create({
    trigger: grid, start: 'clamp(top 78%)', once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      groups.forEach((items, g) => {
        tl.to(items, { opacity: 1, y: 0, duration: 0.6 * speed, stagger: 0.14, clearProps: CLEAR }, 0.25 + g * 0.2)
        tl.to(items.map(item => $('.service-icon', item)), { scale: 1, duration: 0.45 * speed, ease: 'back.out(2)', stagger: 0.14, clearProps: 'transform' }, 0.4 + g * 0.2)
      })
    },
  })
  return () => gsap.set([...groups.flat(), ...marks], { clearProps: CLEAR })
})

/* 6. Principes 01–03 */
mm.add(NO_MOTION, () => {
  const head = $('.about-principles .service-cases__head')
  if (head) revealGroup(head, [...$$('.service-split__head > *', head), $('.service-cases__aside', head)], { y: 20, stagger: 0.09 })
  const cards = $$('.about-principle')
  const nums = cards.map(card => $('.about-principle__num', card))
  gsap.set(nums, { opacity: 0, y: y(10) })
  revealBatch(cards, {
    y: 34, stagger: 0.12, duration: 0.85,
    onReveal: batch => gsap.to(batch.map(card => $('.about-principle__num', card)), { opacity: 1, y: 0, duration: 0.6 * speed, ease: 'power3.out', stagger: 0.12, delay: 0.2, overwrite: 'auto', clearProps: CLEAR }),
  })
  return () => gsap.set(nums, { clearProps: CLEAR })
})

/* 7. Zone d'intervention : texte, puis les cercles se déploient du centre vers l'extérieur et les pastilles apparaissent (une seule fois) */
mm.add(NO_MOTION, () => {
  const copy = $('.about-zone__copy')
  if (copy) revealGroup(copy, [...copy.children].flatMap(el => (el.classList.contains('service-actions') ? [...el.children] : [el])), { y: 20, stagger: 0.09 })
  const visual = $('.about-zone__visual')
  if (!visual) return
  const rings = ['core', 'mid', 'outer'].map(name => $(`.about-zone__ring--${name}`, visual))
  const pin = $('.about-zone__pin', visual)
  const labels = ['base', 'county', 'region', 'remote'].map(name => $(`.about-zone__label--${name}`, visual))
  gsap.set(visual, { opacity: 0, y: y(24), willChange: 'transform, opacity' })
  gsap.set(rings, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' })
  gsap.set(pin, { scale: 0.5, opacity: 0 })
  gsap.set(labels, { opacity: 0, y: y(10), scale: 0.94 })
  ScrollTrigger.create({
    trigger: visual, start: 'clamp(top 82%)', once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(visual, { opacity: 1, y: 0, duration: 0.8 * speed, clearProps: CLEAR }, 0)
        .to(rings, { scale: 1, opacity: 1, duration: 0.9 * speed, stagger: 0.18, ease: 'power2.out', clearProps: CLEAR }, 0.15)
        .to(pin, { scale: 1, opacity: 1, duration: 0.55 * speed, ease: 'back.out(1.7)', clearProps: CLEAR }, 0.5)
        .to(labels, { opacity: 1, y: 0, scale: 1, duration: 0.55 * speed, stagger: 0.14, clearProps: CLEAR }, 0.8)
    },
  })
  return () => gsap.set([visual, pin, ...rings, ...labels], { clearProps: CLEAR })
})

/* 8. CTA final / footer partagé */
mm.add(NO_MOTION, footerMotion)

/* 9. Survols (pointeur précis uniquement) : cartes des métiers et des principes, discrètes */
mm.add(`${NO_MOTION} and (hover: hover) and (pointer: fine)`, () => {
  const cards = $$('.about-studio .service-case, .about-principle')
  const off = cards.map(card => bindHover(card,
    () => gsap.to(card, { y: -6, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
    () => gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' })))
  return () => { off.forEach(fn => fn()); gsap.set(cards, { clearProps: 'transform' }) }
})

anchorFix()
