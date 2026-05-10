export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nom, email, societe, telephone, type_projet, budget, message, soumis_le } = req.body

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }

  const fields = {
    'Nom complet': nom,
    'Email': email,
    'Projet': message,
    'Date de réception': soumis_le || new Date().toISOString(),
    'Statut lead': 'Nouveau',
  }

  if (societe)     fields['Société']       = societe
  if (telephone)   fields['Téléphone']     = telephone
  if (type_projet) fields['Type de projet'] = type_projet
  if (budget)      fields['Budget estimé'] = budget

  const response = await fetch(
    'https://api.airtable.com/v0/appQiGvTkB5xty0ev/tblI15PkGslM3g5jW',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    console.error('Airtable error:', err)
    return res.status(500).json({ error: 'Erreur Airtable' })
  }

  return res.status(200).json({ success: true })
}
