import './intro.js'
import './navbar.js'
import './marquee.js'
import './reveal.js'
import './counter.js'
import './cursor.js'
import './faq.js'
import './testimonials.js'
import './services.js'

document.addEventListener('click', event => {
  const link = event.target.closest('a[href]')
  if (!link || typeof window.clarity !== 'function') return
  if (link.href.startsWith('mailto:')) window.clarity('event', 'clic_email')
  if (link.pathname === '/contact' && (link.classList.contains('btn') || link.classList.contains('service-detail__cta'))) {
    window.clarity('event', 'clic_cta_contact')
  }
})
