const form = document.getElementById('contact-form')
const success = document.getElementById('contact-success')
const error = document.getElementById('contact-error')

if (form && new URLSearchParams(location.search).get('envoye') === '1') {
  form.hidden = true
  success.hidden = false
}

form?.addEventListener('submit', async event => {
  event.preventDefault()
  if (!form.reportValidity()) return
  const button = form.querySelector('[type="submit"]')
  button.disabled = true
  form.setAttribute('aria-busy', 'true')
  error.hidden = true
  const data = Object.fromEntries(new FormData(form))
  const params = new URLSearchParams(location.search)
  const payload = {
    ...data,
    source_url: location.href,
    referrer: document.referrer,
  }
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    payload[key] = params.get(key) || ''
  }
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (typeof window.clarity === 'function') window.clarity('event', 'contact_envoye')
    const url = new URL(location.href)
    url.searchParams.set('envoye', '1')
    history.replaceState(null, '', url)
    form.hidden = true
    success.hidden = false
    success.focus()
  } catch {
    error.hidden = false
    button.disabled = false
  } finally {
    form.removeAttribute('aria-busy')
  }
})
