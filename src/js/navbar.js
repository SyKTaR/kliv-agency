const nav = document.querySelector('.kliv-nav')
const toggle = nav?.querySelector('.kliv-nav__toggle')
const menu = document.getElementById('mobile-navigation')
if (toggle && menu) {
  const closeMenu = (restoreFocus = false) => {
    menu.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Ouvrir le menu')
    if (restoreFocus) toggle.focus()
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    menu.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu')
  })
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu() })
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true) })
  document.addEventListener('click', event => { if (!nav.contains(event.target)) closeMenu() })
  nav.addEventListener('focusout', event => { if (!nav.contains(event.relatedTarget)) closeMenu() })
  window.matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu() })
}
