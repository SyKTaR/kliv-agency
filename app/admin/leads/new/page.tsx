'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function NewLeadPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: '',
  })

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const email = form.email.toLowerCase().trim()

    // Chercher un client existant avec cet email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    // Chercher un lead existant avec cet email (si pas de client)
    let relatedLeadId: string | undefined
    if (!existingClient) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      relatedLeadId = existingLead?.id
    }

    const { data } = await supabase
      .from('leads')
      .insert({
        ...form,
        email,
        status: 'nouveau',
        ...(existingClient ? { converted_to_client_id: existingClient.id } : {}),
        ...(relatedLeadId ? { related_lead_id: relatedLeadId } : {}),
      })
      .select()
      .single()

    if (data) router.push(`/admin/leads/${data.id}`)
    setLoading(false)
  }

  return (
    <div className="p-6 lg:p-10 w-full">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Leads
      </Link>

      <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] mb-8">
        Nouveau lead
      </h1>

      <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom *" value={form.name} onChange={(v) => update('name', v)} required placeholder="Jean Dupont" />
          <Field label="Email *" type="email" value={form.email} onChange={(v) => update('email', v)} required placeholder="jean@exemple.fr" />
          <Field label="Téléphone" value={form.phone} onChange={(v) => update('phone', v)} placeholder="06 00 00 00 00" />
          <Field label="Entreprise" value={form.company} onChange={(v) => update('company', v)} placeholder="SARL Dupont" />
          <Field label="Service souhaité" value={form.service} onChange={(v) => update('service', v)} placeholder="Site vitrine, CRM..." />
          <Field label="Budget" value={form.budget} onChange={(v) => update('budget', v)} placeholder="1 000 – 3 000 €" />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">
            Message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            rows={4}
            placeholder="Description du projet..."
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl
              text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
              placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Link
            href="/admin/leads"
            className="px-4 py-2.5 rounded-xl text-sm font-[family-name:var(--font-dm)] font-medium
              text-[var(--text-primary)]/50 border border-[var(--border-input)] hover:text-[var(--text-primary)] transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90
              text-[#080d14] text-sm font-[family-name:var(--font-dm)] font-medium
              disabled:opacity-50 transition-colors"
          >
            {loading ? 'Création...' : 'Créer le lead'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label, value, onChange, required, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl
          text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
          placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
      />
    </div>
  )
}
