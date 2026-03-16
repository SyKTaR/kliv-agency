'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function NewClientPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase.from('clients').insert(form).select().single()
    if (data) router.push(`/admin/clients/${data.id}`)
    setLoading(false)
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Clients
      </Link>

      <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] mb-8">Nouveau client</h1>

      <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom *" value={form.name} onChange={(v) => update('name', v)} required placeholder="Jean Dupont" />
          <Field label="Email *" type="email" value={form.email} onChange={(v) => update('email', v)} required placeholder="jean@exemple.fr" />
          <Field label="Téléphone" value={form.phone} onChange={(v) => update('phone', v)} placeholder="06 00 00 00 00" />
          <Field label="Entreprise" value={form.company} onChange={(v) => update('company', v)} placeholder="SARL Dupont" />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            placeholder="Notes libres sur ce client..."
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Link href="/admin/clients" className="px-4 py-2.5 rounded-xl text-sm font-[family-name:var(--font-dm)] font-medium text-[var(--text-primary)]/50 border border-[var(--border-input)] hover:text-[var(--text-primary)] transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90 text-[#080d14] text-sm font-[family-name:var(--font-dm)] font-medium disabled:opacity-50 transition-colors">
            {loading ? 'Création...' : 'Créer le client'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
      />
    </div>
  )
}
