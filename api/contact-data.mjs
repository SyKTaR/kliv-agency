const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function prepareContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Données invalides' }
  const value = (key, max) => typeof body[key] === 'string' ? body[key].trim().slice(0, max + 1) : ''
  if (value('website', 200)) return { spam: true }
  const nom = value('nom', 120)
  const email = value('email', 254)
  const societe = value('societe', 120)
  const telephone = value('telephone', 50)
  const typeProjet = value('type_projet', 100)
  const message = value('message', 5000)
  if (!nom || nom.length > 120 || !emailPattern.test(email) || email.length > 254 ||
      !message || message.length > 5000 || societe.length > 120 ||
      telephone.length > 50 || typeProjet.length > 100) {
    return { error: 'Vérifiez les champs requis et leur longueur' }
  }
  const source = ['source_url', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .map(key => [key, value(key, 500)])
    .filter(([, entry]) => entry && entry.length <= 500)
    .map(([key, entry]) => `${key}: ${entry.replace(/[\r\n]+/g, ' ')}`)
  const fields = {
    'Nom complet': nom,
    'Email': email,
    'Projet': source.length ? `${message}\n\nProvenance\n${source.join('\n')}` : message,
    'Date de réception': new Date().toISOString(),
    'Statut lead': 'Nouveau',
  }
  if (societe) fields['Société'] = societe
  if (telephone) fields['Téléphone'] = telephone
  if (typeProjet) fields['Type de projet'] = typeProjet
  return { fields }
}

