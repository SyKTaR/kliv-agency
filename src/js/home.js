import './home-motion.js'
import './hero-logos.js'
import './navbar.js'
import './contact.js'

// Native details remains usable without JavaScript. Enforce one open item on
// browsers that do not yet implement the shared details name attribute.
const faqItems = [...document.querySelectorAll('.kliv-faq__item')]
faqItems.forEach(item => {
  const summary = item.querySelector('summary')
  summary.setAttribute('aria-expanded', String(item.open))
  item.addEventListener('toggle', () => {
    summary.setAttribute('aria-expanded', String(item.open))
    // Avec les animations GSAP (data-motion), l'exclusivité est gérée par home-motion.js.
    if (item.open && !item.parentElement.dataset.motion) faqItems.forEach(other => { if (other !== item) other.open = false })
  })
})

const tabs = [...document.querySelectorAll('.kliv-tabs [role="tab"]')]
const frame = document.querySelector('.kliv-calendar iframe')
const selectTab = (tab, updateHash = false) => {
  tabs.forEach(item => {
    const selected = item === tab
    item.setAttribute('aria-selected', String(selected))
    item.tabIndex = selected ? 0 : -1
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected
  })
  if (tab.id === 'calendar-tab' && !frame.hasAttribute('src')) frame.src = frame.dataset.src
  if (updateHash) {
    const url = new URL(location.href)
    url.hash = tab.id === 'calendar-tab' ? 'reserver' : 'contact'
    history.replaceState(null, '', url)
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab, true))
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    selectTab(tabs[next], true)
    tabs[next].focus()
  })
})
// `instant` : au chargement, on saute directement à l'ancre (un défilement lissé en cours serait
// interrompu par le recalcul de ScrollTrigger).
const syncHash = (instant = false) => {
  if (location.hash === '#reserver') {
    selectTab(document.getElementById('calendar-tab'))
    document.getElementById('contact').scrollIntoView({ block: 'start', behavior: instant ? 'instant' : 'auto' })
  } else if (location.hash === '#contact') selectTab(document.getElementById('message-tab'))
}
window.addEventListener('hashchange', () => syncHash())
syncHash(true)
// Same-page CTA clicks also reset a previously selected calendar tab.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]')
  if (!link) return
  const url = new URL(link.href)
  const isHome = url.origin === location.origin && ['/', '/index.html', '/pages/index.html'].includes(url.pathname)
  if (isHome && ['#contact', '#reserver', '#services', '#approche', '#realisations', '#faq'].includes(url.hash)) {
    event.preventDefault()
    if (location.hash !== url.hash) history.pushState(null, '', url.hash)
    syncHash()
    const target = document.querySelector(url.hash === '#reserver' ? '#contact' : url.hash)
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
    }
  }
  if (typeof window.clarity === 'function') {
    if (url.protocol === 'mailto:') window.clarity('event', 'clic_email')
    if (isHome && ['#contact', '#reserver'].includes(url.hash)) window.clarity('event', 'clic_cta_contact')
  }
})
