import { gsap, ScrollTrigger, SplitText, NO_MOTION, root, $, $$, small, speed, CLEAR, revealBatch, revealGroup, revealPanel, footerMotion, bindHover, anchorFix } from './motion-kit.js'

/*
 * Animations des pages services KLIV (même signature que home-motion.js).
 * Principe : le contenu est visible par défaut (HTML/CSS). Les états « cachés » sont
 * posés ici, en JS, uniquement si prefers-reduced-motion n'est pas activé
 * (gsap.matchMedia), et annulés proprement si la préférence change. Seuls transform et
 * opacity sont animés (hors hauteur des réponses FAQ). Les visuels internes du hero
 * (.service-visual) sont volontairement laissés intacts : seul leur cadre entre.
 * Helpers partagés avec about-motion.js : motion-kit.js.
 */

const mm = gsap.matchMedia()

/* 1. Entrée de page : ≤ ~1,2 s, jamais de contenu caché sans JS */
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

      // Titre ligne par ligne, masqué. Le texte réel reste dans le DOM (aria: 'none' : le h1 est lu d'un seul
      // tenant). Comme sur la home, le split n'est défait qu'à la 1re interaction (ou après 8 s), jamais en
      // plein mouvement ni pendant la mesure du LCP.
      if (h1 && !fontsOk) {
        tl.from(h1, { y: 18, opacity: 0, duration: 0.6 * d }, 0.1 * d)
      } else if (h1) {
        const split = SplitText.create(h1, { type: 'lines', mask: 'lines', aria: 'none' })
        // Le masque ne doit pas rogner jambages ni italiques : clip-path élargi, sans effet sur la mise en page.
        split.masks.forEach(mask => Object.assign(mask.style, { overflow: 'visible', clipPath: 'inset(-.12em -.2em)' }))
        const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'resize']
        const restore = () => {
          events.forEach(type => window.removeEventListener(type, request))
          clearTimeout(timer)
          split.revert()
        }
        const titleTween = gsap.from(split.lines, {
          yPercent: 110, duration: 0.7 * d, stagger: 0.11, ease: 'power4.out', delay: 0.1 * d, lazy: false, clearProps: 'transform',
        })
        const request = () => (titleTween.progress() >= 1 ? restore() : titleTween.eventCallback('onComplete', restore))
        const timer = setTimeout(request, 8000)
        events.forEach(type => window.addEventListener(type, request, { passive: true, once: true }))
        cleanups.push(restore)
      }

      tl.from('.service-hero__lead', { y: 16, opacity: 0, duration: 0.6 * d }, 0.3 * d)
        .from($$('.service-actions > *'), { y: 14, opacity: 0, duration: 0.55 * d, stagger: 0.09 }, 0.45 * d)
        .from($$('.service-tags > *'), { y: 10, opacity: 0, duration: 0.5 * d, stagger: 0.06 }, 0.58 * d)
        // Seul le cadre du visuel entre (fondu + très léger scale) ; son contenu interne n'est pas touché.
        .from('.service-visual', { opacity: 0, scale: 0.975, transformOrigin: '50% 50%', duration: 0.8 * d }, 0.3 * d)
    })
    settle() // états initiaux posés (from = rendu immédiat) : on lève le masquage CSS anti-FOUC
  }

  // Polices (200 ms max) pour découper le titre avec les bonnes métriques ; le masquage CSS de secours
  // se lève de toute façon à 1,4 s.
  const fontReady = document.fonts?.load
    ? Promise.all([document.fonts.load('700 64px "Kliv Geist"'), document.fonts.load('italic 700 64px Fraunces')]).catch(() => {})
    : Promise.resolve()
  Promise.race([fontReady, new Promise(resolve => setTimeout(resolve, 200))]).then(() => { if (!cancelled) build() })

  return () => { cancelled = true; cleanups.forEach(fn => fn()); hero?.revert(); settle() }
})

/* 2. Sections de contenu : « Le service », « Le bon choix », « Les signes », méthode, « Nos autres services » */
mm.add(NO_MOTION, () => {
  // En-têtes (pill, titre, texte). Pour qui / Cas concrets ont leur propre traitement ci-dessous.
  $$('.service-split__head, .service-head, .service-faq__head')
    .filter(head => !head.closest('.service-audience, .service-cases'))
    .forEach(head => revealGroup(head, [...head.children], { y: 20, stagger: 0.09 }))

  // Cartes numérotées 01–04/05
  revealBatch('.service-section .service-cards > li', { y: 30, stagger: 0.1 })

  // Checklist « Le bon choix » : item par item, l'item bleu en dernier (légère pause avant lui)
  const choice = $('.service-choice')
  if (choice) {
    const items = $$(':scope > li', choice)
    const plain = items.filter(li => !li.classList.contains('is-accent'))
    const accent = items.filter(li => li.classList.contains('is-accent'))
    const y = 22 * (small ? 0.7 : 1)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: CLEAR }, scrollTrigger: { trigger: choice, start: 'clamp(top 85%)', once: true } })
    tl.from(plain, { opacity: 0, y, duration: 0.7 * speed, stagger: 0.12 })
    // l'item bleu conclut la liste, après une courte pause
    if (accent.length) tl.from(accent, { opacity: 0, y, duration: 0.8 * speed }, `>-${0.25 * speed}`)
  }

  // Refonte : les 5 « signes » en cascade, puis la note
  revealBatch('.service-sign', { y: 26, stagger: 0.08 })
  revealGroup($('.service-signs__note'), [$('.service-signs__note')], { y: 14, start: 'clamp(top 94%)' })

  // « Nos autres services »
  revealBatch('.service-more .service-cards > li', { y: 30, stagger: 0.1 })
})

/* 3. Bloc noir « Pour qui » : le bloc entre, puis titre et cartes sombres ; l'icône bleue « pop » discrètement */
mm.add(NO_MOTION, () => {
  const block = $('.service-audience')
  if (!block) return
  revealPanel(block, { y: 40, scale: 0.97, duration: 1 })
  $$('.service-head', block).forEach(head => revealGroup(head, [...head.children], { y: 18, stagger: 0.09, start: 'clamp(top 85%)' }))
  const cards = $$('.service-cards > li', block)
  revealBatch(cards, {
    y: 34, stagger: 0.12, duration: 0.85,
    onReveal: batch => {
      const icons = batch.map(card => $('.service-audience__icon', card)).filter(Boolean)
      gsap.fromTo(icons, { scale: 0.6 }, {
        scale: 1, duration: 0.55 * speed, ease: 'back.out(1.7)', stagger: 0.12, delay: 0.2, overwrite: 'auto', clearProps: 'transform',
      })
    },
  })
  // Les icônes démarrent à l'échelle réduite dès que leur carte est cachée (pas d'icône « pleine » sur une carte invisible).
  const icons = cards.map(card => $('.service-audience__icon', card)).filter(Boolean)
  gsap.set(icons, { scale: 0.6 })
})

/* 4. Méthode : la ligne se dessine d'une étape à la suivante pendant que cercles et textes se révèlent */
const stepParts = step => ({
  num: $('.service-step__num', step), texts: $$(':scope > h3, :scope > p', step),
})
const stepTimeline = (steps, tl, gap) => {
  steps.forEach((step, i) => {
    const { num, texts } = stepParts(step)
    const t = i * gap
    const last = i === steps.length - 1
    tl.from(num, { scale: 0.7, opacity: 0, duration: 0.5 * speed, ease: 'back.out(1.5)' }, t)
      .from(texts, { y: 14, opacity: 0, duration: 0.55 * speed, stagger: 0.07 }, t + 0.1)
    // La ligne (pseudo-élément) est pilotée par --service-line, lue en scaleX / scaleY dans le CSS.
    if (!last) tl.fromTo(step, { '--service-line': 0 }, { '--service-line': 1, duration: gap * 1.15, ease: 'power2.inOut', clearProps: '--service-line' }, t + 0.25)
  })
  // Dernier cercle plein : un seul pulse discret, une fois la ligne arrivée
  const lastNum = stepParts(steps[steps.length - 1]).num
  tl.to(lastNum, { scale: 1.12, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1, clearProps: 'transform' }, '>-0.05')
  return tl
}

// ≥ 900 px : une seule timeline horizontale quand la rangée entre à l'écran
mm.add(`${NO_MOTION} and (min-width: 900px)`, () => {
  const list = $('.service-steps')
  const steps = $$('.service-step')
  if (!list || steps.length < 2) return
  const tl = gsap.timeline({
    defaults: { clearProps: CLEAR },
    scrollTrigger: { trigger: list, start: 'clamp(top 82%)', once: true },
  })
  stepTimeline(steps, tl, 0.3)
})

// < 900 px : liste verticale, chaque étape se révèle quand elle arrive (la ligne descend vers la suivante)
mm.add(`${NO_MOTION} and (max-width: 899px)`, () => {
  const steps = $$('.service-step')
  if (steps.length < 2) return
  steps.forEach((step, i) => {
    const last = i === steps.length - 1
    const { num, texts } = stepParts(step)
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: step, start: 'clamp(top 90%)', once: true },
    })
    tl.from(num, { scale: 0.7, opacity: 0, duration: 0.45 * speed, ease: 'back.out(1.5)', clearProps: CLEAR }, 0)
      .from(texts, { y: 12, opacity: 0, duration: 0.5 * speed, stagger: 0.07, clearProps: CLEAR }, 0.08)
    if (!last) tl.fromTo(step, { '--service-line': 0 }, { '--service-line': 1, duration: 0.7 * speed, ease: 'power2.inOut', clearProps: '--service-line' }, 0.25)
    else tl.to(num, { scale: 1.12, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1, clearProps: 'transform' }, 0.55)
  })
})

/* 5. Cas concrets (fond gris) : cartes en cascade, icône qui entre avec une légère rotation */
mm.add(NO_MOTION, () => {
  const cases = $$('.service-case')
  const tiles = cases.map(card => $('.service-case__tile .service-icon', card)).filter(Boolean)
  const head = $('.service-cases__head')
  if (head) revealGroup(head, [...$$('.service-split__head > *', head), $('.service-cases__aside', head)], { y: 20, stagger: 0.09 })
  gsap.set(tiles, { scale: 0.7, rotation: -14, opacity: 0 })
  revealBatch(cases, {
    y: 34, stagger: 0.12, duration: 0.85,
    onReveal: batch => gsap.to(batch.map(card => $('.service-case__tile .service-icon', card)).filter(Boolean), {
      scale: 1, rotation: 0, opacity: 1, duration: 0.7 * speed, ease: 'back.out(1.4)', stagger: 0.12, delay: 0.25, overwrite: 'auto', clearProps: CLEAR,
    }),
  })
})

/* 6. Bloc bleu « Ce que vous gagnez » : panneau, citation ligne par ligne, puis les 3 pills */
mm.add(NO_MOTION, () => {
  const panel = $('.service-gain')
  if (!panel) return
  const quote = $('blockquote', panel)
  const chips = $$('.service-chip', panel)
  const label = $('.service-pill', panel)
  revealPanel(panel, { y: 40, scale: 0.97, duration: 1, start: 'clamp(top 90%)' })
  revealGroup(panel, [label], { y: 14, start: 'clamp(top 80%)' })
  gsap.set(chips, { opacity: 0, y: 14 * (small ? 0.7 : 1), willChange: 'transform, opacity' })
  let split
  if (quote) gsap.set(quote, { opacity: 0 })
  ScrollTrigger.create({
    trigger: panel, start: 'clamp(top 72%)', once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (quote) {
        // Le split se fait à l'entrée (polices chargées, largeur réelle) ; il est défait à la fin du mouvement.
        split = SplitText.create(quote, { type: 'lines', mask: 'lines', aria: 'none' })
        split.masks.forEach(mask => Object.assign(mask.style, { overflow: 'visible', clipPath: 'inset(-.12em -.2em)' }))
        gsap.set(quote, { opacity: 1 })
        tl.from(split.lines, { yPercent: 110, duration: 0.8 * speed, stagger: 0.12, ease: 'power4.out', clearProps: 'transform', onComplete: () => split?.revert() }, 0.1)
      }
      tl.to(chips, { opacity: 1, y: 0, duration: 0.6 * speed, stagger: 0.1, clearProps: CLEAR }, quote ? 0.6 : 0)
    },
  })
  return () => { split?.revert(); gsap.set([quote, ...chips].filter(Boolean), { clearProps: CLEAR }) }
})

/* 7. FAQ : ouverture / fermeture animées, details natif conservé (clavier, accordéon exclusif) */
mm.add(NO_MOTION, () => {
  const list = $('.service-faq .kliv-faq__list')
  const items = $$('.kliv-faq__item', list || document)
  if (!list || !items.length) return
  list.dataset.motion = 'on'
  const names = items.map(item => item.getAttribute('name'))
  items.forEach(item => item.removeAttribute('name')) // l'exclusivité est gérée ici, avec animation

  const answerOf = item => $('.kliv-faq__answer', item)
  const settled = () => ScrollTrigger.refresh() // la page change de hauteur : positions des déclencheurs suivants
  const open = item => {
    const answer = answerOf(item)
    delete item.dataset.closing
    $('summary', item).setAttribute('aria-expanded', 'true')
    // Ouverture d'abord : le padding n'est mesurable qu'une fois la réponse rendue.
    if (!item.open) item.open = true
    const pb = getComputedStyle(answer).paddingBottom
    const full = gsap.isTweening(answer) ? answer.scrollHeight : answer.getBoundingClientRect().height
    if (!gsap.isTweening(answer)) gsap.set(answer, { height: 0, opacity: 0, paddingBottom: 0, overflow: 'hidden' })
    gsap.to(answer, {
      height: full, opacity: 1, paddingBottom: pb, duration: 0.5 * speed, ease: 'power3.out', overwrite: 'auto',
      onComplete: () => { gsap.set(answer, { clearProps: 'height,opacity,paddingBottom,overflow' }); settled() },
    })
  }
  const close = item => {
    const answer = answerOf(item)
    item.dataset.closing = 'true' // l'icône repasse tout de suite à « + » (CSS), le details reste ouvert le temps du mouvement
    $('summary', item).setAttribute('aria-expanded', 'false')
    gsap.set(answer, { overflow: 'hidden' })
    gsap.to(answer, {
      height: 0, opacity: 0, paddingBottom: 0, duration: 0.38 * speed, ease: 'power2.inOut', overwrite: 'auto',
      onComplete: () => {
        item.open = false
        delete item.dataset.closing
        gsap.set(answer, { clearProps: 'height,opacity,paddingBottom,overflow' })
        settled()
      },
    })
  }
  const handlers = items.map(item => {
    const summary = $('summary', item)
    summary.setAttribute('aria-expanded', String(item.open))
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
      const answer = answerOf(item)
      gsap.killTweensOf(answer)
      gsap.set(answer, { clearProps: 'all' })
      $('summary', item).removeAttribute('aria-expanded')
      delete item.dataset.closing
      if (names[i]) item.setAttribute('name', names[i])
    })
    delete list.dataset.motion
  }
})

/* 8. CTA final / footer (le footer partagé n'est animé par aucun autre script sur ces pages) */
mm.add(NO_MOTION, footerMotion)

/* 9. Survols (appareils à pointeur précis uniquement) : cas concrets (élévation) et « Nos autres services » (glisse) */
mm.add(`${NO_MOTION} and (hover: hover) and (pointer: fine)`, () => {
  const off = []
  const bind = (el, enter, leave) => off.push(bindHover(el, enter, leave))
  $$('.service-case').forEach(card => {
    bind(card,
      () => gsap.to(card, { y: -6, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
      () => gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' }))
  })
  $$('.service-more__card').forEach(card => {
    const arrow = $('.service-more__arrow .service-icon', card)
    // Le fond bleu de la pastille est déjà géré en CSS (survol) ; ici la carte glisse, la flèche file vers le coin.
    bind(card,
      () => { gsap.to(card, { y: -5, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); gsap.to(arrow, { x: 2, y: -2, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }) },
      () => { gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' }); gsap.to(arrow, { x: 0, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' }) })
  })
  return () => {
    off.forEach(fn => fn())
    gsap.set($$('.service-case, .service-more__card, .service-more__arrow .service-icon'), { clearProps: 'transform' })
  }
})

anchorFix()
