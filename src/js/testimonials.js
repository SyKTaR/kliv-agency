const track = document.querySelector('.testimonials__track')

if (track) {
  const items = [...track.querySelectorAll('.testimonial')]
  const dots = [...document.querySelectorAll('.testimonials__dot')]
  const prevBtn = document.querySelector('.testimonials__arrow--prev')
  const nextBtn = document.querySelector('.testimonials__arrow--next')
  let active = 0

  const render = () => {
    items.forEach((item, i) => {
      item.classList.remove('is-active', 'is-prev', 'is-next')
      if (i === active) item.classList.add('is-active')
      else if (i === (active - 1 + items.length) % items.length) item.classList.add('is-prev')
      else if (i === (active + 1) % items.length) item.classList.add('is-next')
    })
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active))
  }

  const go = (delta) => {
    active = (active + delta + items.length) % items.length
    render()
  }

  prevBtn.addEventListener('click', () => go(-1))
  nextBtn.addEventListener('click', () => go(1))
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    active = i
    render()
  }))

  render()
}
