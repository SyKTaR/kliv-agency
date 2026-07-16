const PIXELS_PER_SECOND = 60

document.querySelectorAll('.marquee').forEach((marquee) => {
  const track = marquee.querySelector('.marquee__track')
  if (!track) return

  const baseGroup = track.querySelector('.marquee__group')
  if (!baseGroup) return

  const setup = () => {
    track.classList.remove('is-ready')

    // Repart d'un seul groupe de référence avant de recalculer les clones
    track.querySelectorAll('.marquee__group').forEach((group, i) => {
      if (i > 0) group.remove()
    })

    const groupWidth = baseGroup.offsetWidth
    if (!groupWidth) return

    // Ajoute des clones jusqu'à couvrir la largeur visible + un groupe entier,
    // pour qu'il n'y ait jamais d'espace vide quelle que soit la taille d'écran.
    const minWidth = marquee.offsetWidth + groupWidth
    while (track.scrollWidth < minWidth) {
      track.appendChild(baseGroup.cloneNode(true))
    }

    track.style.setProperty('--marquee-distance', `-${groupWidth}px`)
    track.style.setProperty('--marquee-duration', `${groupWidth / PIXELS_PER_SECOND}s`)
    track.classList.add('is-ready')
  }

  setup()

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(setup, 200)
  })

  if (document.fonts) {
    document.fonts.ready.then(setup)
  }
})
