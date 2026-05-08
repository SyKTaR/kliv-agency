const PHRASES = [
  'des expériences qui convertissent.',
  'des sites qui transforment.',
  'des interfaces qui vendent.',
  'des parcours qui engagent.',
  'des plateformes qui performent.',
  'des outils qui simplifient.',
  'des solutions qui accélèrent.',
  'des expériences qui marquent.',
  'des produits qui évoluent.',
  'des systèmes qui changent tout.',
]

const INTERVAL   = 3400
const EXIT_DELAY = 420

const el = document.querySelector('.hero__rotating-text')

if (el) {
  let index = 0

  const rotate = () => {
    el.classList.add('is-exiting')

    setTimeout(() => {
      index = (index + 1) % PHRASES.length
      el.textContent = PHRASES[index]

      el.classList.remove('is-exiting')
      el.classList.add('is-entering')

      el.getBoundingClientRect()

      el.classList.remove('is-entering')
    }, EXIT_DELAY)
  }

  setTimeout(() => setInterval(rotate, INTERVAL), 4000)
}
