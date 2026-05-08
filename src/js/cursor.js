// Curseur personnalisé — desktop uniquement
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  document.body.appendChild(cursor)

  let mouseX = 0, mouseY = 0
  let curX = 0, curY = 0

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursor.style.transform = `translate(${mouseX - cursor.offsetWidth / 2}px, ${mouseY - cursor.offsetHeight / 2}px)`
  })

  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'))
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'))
  })
}
