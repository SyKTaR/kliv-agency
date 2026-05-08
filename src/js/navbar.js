const navbar = document.getElementById('navbar')
const toggle = document.querySelector('.navbar__toggle')
const mobileMenu = document.querySelector('.mobile-menu')
const mobileLinks = document.querySelectorAll('.mobile-menu a')

// Scroll → fond flouté
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40)
}, { passive: true })

// Burger menu
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open')
    mobileMenu.classList.toggle('is-open', isOpen)
    toggle.setAttribute('aria-expanded', isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open')
      mobileMenu.classList.remove('is-open')
      toggle.setAttribute('aria-expanded', false)
      document.body.style.overflow = ''
    })
  })
}
