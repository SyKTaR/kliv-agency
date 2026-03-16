'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import InvoiceBuilder from '@/components/admin/InvoiceBuilder'
import type { InvoiceStatus, LineItem } from '@/types/crm'

type PartialClient = { id: string; name: string }
type PartialProject = { id: string; name: string }

export default function NewInvoicePage() {
  const router = useRouter()
  const supabase = createClient()

  const [clients, setClients] = useState<PartialClient[]>([])
  const [projects, setProjects] = useState<PartialProject[]>([])
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
  ])
  const [tva, setTva] = useState(0)
  const [form, setForm] = useState({
    client_id: '',
    project_id: '',
    number: `DEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    is_quote: true,
    status: 'brouillon' as InvoiceStatus,
    issued_at: new Date().toISOString().split('T')[0],
    valid_until: '',
    notes: '',
  })

  useEffect(() => {
    supabase.from('clients').select('id, name').order('name').then(({ data }) => setClients(data ?? []))
    supabase.from('projects').select('id, name').order('name').then(({ data }) => setProjects(data ?? []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: invoice, error } = await supabase.from('invoices').insert({
      ...form,
      tva,
      project_id: form.project_id || null,
      valid_until: form.valid_until || null,
    }).select().single()

    if (error || !invoice) { setLoading(false); return }

    // Insert items
    const itemsPayload = items
      .filter((item) => item.description.trim())
      .map(({ description, quantity, unit_price }) => ({
        invoice_id: invoice.id,
        description,
        quantity,
        unit_price,
      }))

    if (itemsPayload.length > 0) {
      await supabase.from('invoice_items').insert(itemsPayload)
    }

    router.push(`/admin/invoices/${invoice.id}`)
    setLoading(false)
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Devis & Factures
      </Link>

      <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)] mb-8">Nouveau devis</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meta */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-4">
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-2">Informations</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <FField label="Numéro *">
              <input required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className={iCls} />
            </FField>

            <FField label="Type">
              <select value={form.is_quote ? 'devis' : 'facture'} onChange={(e) => setForm({ ...form, is_quote: e.target.value === 'devis' })} className={iCls}>
                <option value="devis">Devis</option>
                <option value="facture">Facture</option>
              </select>
            </FField>

            <FField label="Client *">
              <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className={iCls}>
                <option value="">Sélectionner un client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FField>

            <FField label="Projet">
              <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className={iCls}>
                <option value="">—</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FField>

            <FField label="Date d'émission">
              <input type="date" value={form.issued_at} onChange={(e) => setForm({ ...form, issued_at: e.target.value })} className={iCls} />
            </FField>

            <FField label="Valable jusqu'au">
              <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className={iCls} />
            </FField>
          </div>
        </div>

        {/* Items */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">Prestations</h2>
          <InvoiceBuilder items={items} onChange={setItems} tva={tva} onTvaChange={setTva} />
        </div>

        {/* Notes */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <FField label="Notes / Conditions">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Conditions de paiement, mentions légales..."
              className={`${iCls} resize-none`}
            />
          </FField>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/invoices" className="px-4 py-2.5 rounded-xl text-sm font-[family-name:var(--font-dm)] font-medium text-[var(--text-primary)]/50 border border-[var(--border-input)] hover:text-[var(--text-primary)] transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90 text-[#080d14] text-sm font-[family-name:var(--font-dm)] font-medium disabled:opacity-50 transition-colors">
            {loading ? 'Création...' : 'Créer le devis'}
          </button>
        </div>
      </form>
    </div>
  )
}

const iCls = "w-full px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"

function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
