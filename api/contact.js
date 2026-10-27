
const AIRTABLE_URL = 'https://api.airtable.com/v0/appQiGvTkB5xty0ev/tblI15PkGslM3g5jW'
export default async function handler(req, res) {
  const { prepareContact } = await import('./contact-data.mjs')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })
  const prepared = prepareContact(req.body)
  if (prepared.spam) return res.status(200).json({ success: true })
  if (prepared.error) return res.status(400).json({ error: prepared.error })
  try {
    const response = await fetch(AIRTABLE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: prepared.fields, typecast: true }),
    })
    if (!response.ok) throw new Error(`Airtable HTTP ${response.status}`)
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return res.status(500).json({ error: 'Envoi impossible pour le moment' })
  }
}
