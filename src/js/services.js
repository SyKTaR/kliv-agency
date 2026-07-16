const servicesGrid = document.getElementById('servicesGrid')
const servicesDetail = document.getElementById('servicesDetail')
const closeBtn = document.getElementById('servicesDetailClose')

if (servicesGrid && servicesDetail) {
  const detailBlocks = servicesDetail.querySelectorAll('.service-detail')

  const showService = (id) => {
    detailBlocks.forEach(block => {
      block.hidden = block.dataset.service !== id
    })
    servicesGrid.hidden = true
    servicesDetail.hidden = false
    servicesDetail.scrollIntoView({ block: 'start' })
  }

  const showGrid = () => {
    servicesDetail.hidden = true
    servicesGrid.hidden = false
  }

  servicesGrid.querySelectorAll('.service-card').forEach(card => {
    const toggle = card.querySelector('.service-card__toggle')
    const id = card.dataset.service

    toggle.addEventListener('click', () => showService(id))
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        showService(id)
      }
    })
  })

  closeBtn.addEventListener('click', showGrid)
}
