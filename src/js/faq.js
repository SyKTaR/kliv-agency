const faqItems = document.querySelectorAll('.faq-item')

faqItems.forEach(item => {
  const trigger = item.querySelector('.faq-item__trigger')
  const body = item.querySelector('.faq-item__body')

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open')

    faqItems.forEach(i => {
      i.classList.remove('is-open')
      i.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false')
      i.querySelector('.faq-item__body').style.height = '0'
    })

    if (!isOpen) {
      item.classList.add('is-open')
      trigger.setAttribute('aria-expanded', 'true')
      body.style.height = body.scrollHeight + 'px'
    }
  })
})
