'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Trash2, FileCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from '@/types/crm'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/crm'

const STATUSES: InvoiceStatus[] = ['brouillon', 'envoyé', 'accepté', 'refusé', 'facturé']

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [invoice, setInvoice] = useState<(Invoice & { client?: { name: string; email: string; company?: string }; items?: InvoiceItem[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [id])

  async function fetchData() {
    const { data } = await supabase
      .from('invoices')
      .select('*, client:clients(name, email, company), items:invoice_items(*)')
      .eq('id', id)
      .single()
    setInvoice(data)
    setLoading(false)
  }

  async function updateStatus(status: InvoiceStatus) {
    await supabase.from('invoices').update({ status }).eq('id', id)
    setInvoice((prev) => prev ? { ...prev, status } : prev)

    // Sync project amount when quote is accepted
    if (status === 'accepté' && invoice?.project_id) {
      const items = invoice.items ?? []
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
      const total = subtotal + subtotal * ((invoice.tva ?? 0) / 100)
      await supabase.from('projects').update({ amount: Math.round(total * 100) / 100 }).eq('id', invoice.project_id)
    }
  }

  async function convertToInvoice() {
    const newNumber = invoice?.number.replace('DEV-', 'FAC-') ?? ''
    await supabase.from('invoices').update({ is_quote: false, status: 'envoyé', number: newNumber }).eq('id', id)
    setInvoice((prev) => prev ? { ...prev, is_quote: false, status: 'envoyé', number: newNumber } : prev)
  }

  async function deleteInvoice() {
    if (!confirm('Supprimer ce document ?')) return
    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    await supabase.from('invoices').delete().eq('id', id)
    router.push('/admin/invoices')
  }

  function downloadPDF() {
    window.print()
  }

  if (loading) return <div className="p-10 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#7BA7BC] border-t-transparent rounded-full animate-spin" /></div>
  if (!invoice) return <div className="p-10 text-center text-[var(--text-faint)] font-[family-name:var(--font-dm)]">Document introuvable.</div>

  const items = invoice.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const tvaAmount = subtotal * ((invoice.tva ?? 0) / 100)
  const total = subtotal + tvaAmount

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {/* Print header — visible only in print */}
      <div className="hidden print:block mb-8">
        <div className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <p className="text-2xl font-bold tracking-tight text-gray-900 font-[family-name:var(--font-syne)]">Kliv</p>
            <p className="text-sm text-gray-500 mt-1">kliv.fr · contact@kliv.fr</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{invoice.number}</p>
            <p className="text-sm text-gray-500 capitalize">{invoice.is_quote ? 'Devis' : 'Facture'}</p>
            <p className="text-sm text-gray-500 mt-1">
              Émis le {new Date(invoice.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {invoice.valid_until && (
              <p className="text-sm text-gray-500">
                Valable jusqu&apos;au {new Date(invoice.valid_until).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Screen nav — hidden in print */}
      <div className="print:hidden">
        <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
          <ArrowLeft size={16} /> Devis & Factures
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">{invoice.number}</h1>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] border border-[var(--border-input)] text-[var(--text-primary)]/50 font-[family-name:var(--font-dm)]">
                {invoice.is_quote ? 'Devis' : 'Facture'}
              </span>
            </div>
            <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)]">
              Émis le {new Date(invoice.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {invoice.is_quote && invoice.status === 'accepté' && (
              <button
                type="button"
                onClick={convertToInvoice}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-600 border border-green-500/30 text-sm font-[family-name:var(--font-dm)] font-medium transition-colors"
              >
                <FileCheck size={15} />
                Convertir en facture
              </button>
            )}
            <button
              type="button"
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] border border-[var(--border-input)] text-sm font-[family-name:var(--font-dm)] transition-colors"
            >
              <Download size={15} />
              Télécharger PDF
            </button>
            <button
              type="button"
              aria-label="Supprimer ce document"
              onClick={deleteInvoice}
              className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-input)] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 print:block print:space-y-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Client info */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 print:rounded-none print:border-gray-200 print:bg-white">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-3 print:text-gray-900">Client</h2>
            {invoice.client ? (
              <div>
                <p className="text-[var(--text-primary)] text-sm font-medium font-[family-name:var(--font-dm)] print:text-gray-900">{invoice.client.name}</p>
                {invoice.client.company && <p className="text-[var(--text-primary)]/50 text-sm font-[family-name:var(--font-dm)] print:text-gray-500">{invoice.client.company}</p>}
                <p className="text-[var(--text-primary)]/50 text-sm font-[family-name:var(--font-dm)] print:text-gray-500">{invoice.client.email}</p>
              </div>
            ) : <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)]">—</p>}
          </div>

          {/* Items table */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 print:rounded-none print:border-gray-200 print:bg-white">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4 print:text-gray-900">Prestations</h2>

            {items.length > 0 ? (
              <div>
                <div className="grid grid-cols-12 gap-2 text-xs text-[var(--text-ghost)] font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider pb-2 border-b border-[var(--border-subtle)] mb-3 print:text-gray-400 print:border-gray-200">
                  <div className="col-span-6">Désignation</div>
                  <div className="col-span-2 text-right">Qté</div>
                  <div className="col-span-2 text-right">P.U.</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 py-2.5 border-b border-[var(--border-subtle)] last:border-0 print:border-gray-100">
                    <div className="col-span-6 text-[var(--text-primary)]/80 text-sm font-[family-name:var(--font-dm)] print:text-gray-800">{item.description}</div>
                    <div className="col-span-2 text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)] text-right print:text-gray-600">{item.quantity}</div>
                    <div className="col-span-2 text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)] text-right print:text-gray-600">{item.unit_price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                    <div className="col-span-2 text-[var(--text-primary)] text-sm font-medium font-[family-name:var(--font-dm)] text-right print:text-gray-900">{(item.quantity * item.unit_price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                  </div>
                ))}

                {/* Totals */}
                <div className="mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-[family-name:var(--font-dm)]">
                    <span className="text-[var(--text-primary)]/50 print:text-gray-500">Sous-total HT</span>
                    <span className="text-[var(--text-primary)] print:text-gray-900">{subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                  </div>
                  {invoice.tva > 0 && (
                    <div className="flex justify-between text-sm font-[family-name:var(--font-dm)]">
                      <span className="text-[var(--text-primary)]/50 print:text-gray-500">TVA ({invoice.tva}%)</span>
                      <span className="text-[var(--text-primary)]/70 print:text-gray-600">{tvaAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)] print:border-gray-200">
                    <span className="text-[var(--text-primary)] font-medium font-[family-name:var(--font-dm)] print:text-gray-900">Total TTC</span>
                    <span className="text-[#7BA7BC] font-bold text-lg font-[family-name:var(--font-syne)] print:text-gray-900">{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)] text-center py-4">Aucune prestation</p>
            )}

            {invoice.notes && (
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] print:border-gray-200">
                <p className="text-[var(--text-faint)] text-xs font-[family-name:var(--font-dm)] mb-1 print:text-gray-400">Notes</p>
                <p className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)] leading-relaxed print:text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar statut — hidden in print */}
        <div className="print:hidden">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] text-sm mb-3">Statut</h3>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(s)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border text-left transition-colors
                    ${invoice.status === s ? INVOICE_STATUS_COLORS[s] : 'bg-transparent text-[var(--text-faint)] border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
                >
                  {INVOICE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            {invoice.valid_until && (
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">Valable jusqu&apos;au</p>
                <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] mt-0.5">
                  {new Date(invoice.valid_until).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
