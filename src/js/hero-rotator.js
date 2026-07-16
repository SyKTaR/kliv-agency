const PHRASES = [
  'suffisamment complexe.',
  'trop souvent technique.',
  'trop souvent flou.',
  'trop souvent dispersé.',
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
