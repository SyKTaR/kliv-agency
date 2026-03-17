'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { ProjectType, ProjectStatus } from '@/types/crm'

type PartialClient = { id: string; name: string }

const PROJECT_TYPES: ProjectType[] = ['site web', 'crm', 'automatisation', 'autre']
const PROJECT_STATUSES: ProjectStatus[] = ['en attente', 'en cours', 'en révision', 'livré', 'en pause']

function NewProjectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [clients, setClients] = useState<PartialClient[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    client_id: searchParams.get('client_id') ?? '',
    type: 'site web' as ProjectType,
    status: 'en attente' as ProjectStatus,
    start_date: '',
    delivery_date: '',
    amount: '',
    description: '',
  })

  useEffect(() => {
    supabase.from('clients').select('id, name').order('name').then(({ data }) => setClients(data ?? []))
  }, [])

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client_id) return
    setLoading(true)
    const payload = {
      ...form,
      amount: form.amount ? parseFloat(form.amount) : null,
      start_date: form.start_date || null,
      delivery_date: form.delivery_date || null,
    }
    const { data } = await supabase.from('projects').insert(payload).select().single()
    if (data) router.push(`/admin/projects/${data.id}`)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Nom du projet *</Label>
          <Input value={form.name} onChange={(v) => update('name', v)} required placeholder="Site vitrine Dupont" />
        </div>

        <div>
          <Label>Client *</Label>
          <select
            value={form.client_id}
            onChange={(e) => update('client_id', e.target.value)}
            required
            title="Client"
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
          >
            <option value="">Sélectionner un client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <Label>Type</Label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            title="Type de projet"
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors capitalize"
          >
            {PROJECT_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
        </div>

        <div>
          <Label>Statut</Label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            title="Statut du projet"
            className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
          >
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <Label>Montant (€)</Label>
          <Input type="number" value={form.amount} onChange={(v) => update('amount', v)} placeholder="2500" />
        </div>

        <div>
          <Label>Date de début</Label>
          <Input type="date" value={form.start_date} onChange={(v) => update('start_date', v)} />
        </div>

        <div>
          <Label>Date de livraison prévue</Label>
          <Input type="date" value={form.delivery_date} onChange={(v) => update('delivery_date', v)} />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          placeholder="Détails du projet..."
          className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Link href="/admin/projects" className="px-4 py-2.5 rounded-xl text-sm font-[family-name:var(--font-dm)] font-medium text-[var(--text-primary)]/50 border border-[var(--border-input)] hover:text-[var(--text-primary)] transition-colors">Annuler</Link>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90 text-[#080d14] text-sm font-[family-name:var(--font-dm)] font-medium disabled:opacity-50 transition-colors">
          {loading ? 'Création...' : 'Créer le projet'}
        </button>
      </div>
    </form>
  )
}

export default function NewProjectPage() {
  return (
    <div className="p-6 lg:p-10 w-full">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Projets
      </Link>

      <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] mb-8">Nouveau projet</h1>

      <Suspense fallback={null}>
        <NewProjectForm />
      </Suspense>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">{children}</label>
}

function Input({ value, onChange, required, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
    />
  )
}
