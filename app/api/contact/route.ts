import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase.admin'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Chercher un client existant avec cet email
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (existingClient) {
    // Lead rattaché à un client connu
    const { error } = await supabase.from('leads').insert({
      name,
      email: email.toLowerCase().trim(),
      message,
      status: 'nouveau',
      source: 'site_web',
      converted_to_client_id: existingClient.id,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, linked: 'client' })
  }

  // 2. Chercher un lead existant avec cet email (le plus récent)
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('leads').insert({
    name,
    email: email.toLowerCase().trim(),
    message,
    status: 'nouveau',
    source: 'site_web',
    ...(existingLead ? { related_lead_id: existingLead.id } : {}),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, linked: existingLead ? 'lead' : 'none' })
}
