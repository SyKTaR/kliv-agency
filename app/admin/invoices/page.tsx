import { createServerSupabaseClient } from '@/lib/supabase.server'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from '@/types/crm'
import type { Invoice, InvoiceStatus } from '@/types/crm'

export const dynamic = 'force-dynamic'

const STATUSES: InvoiceStatus[] = ['brouillon', 'envoyé', 'accepté', 'refusé', 'facturé']

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>
}) {
  const { status, type } = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('invoices')
    .select('*, client:clients(name), items:invoice_items(*)')
    .order('created_at', { ascending: false })

  if (status && STATUSES.includes(status as InvoiceStatus)) {
    query = query.eq('status', status)
  }
  if (type === 'devis') {
    query = query.eq('is_quote', true)
  } else if (type === 'factures') {
    query = query.eq('is_quote', false)
  }

  const { data: invoices } = await query

  return (
    <div className="p-6 lg:p-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">Devis & Factures</h1>
          <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">{invoices?.length ?? 0} document{(invoices?.length ?? 0) > 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90 text-white text-sm font-[family-name:var(--font-dm)] font-medium transition-colors"
        >
          <Plus size={16} />
          Nouveau devis
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        <FilterLink href="/admin/invoices" active={!type && !status} label="Tous" />
        <FilterLink href="/admin/invoices?type=devis" active={type === 'devis'} label="Devis" />
        <FilterLink href="/admin/invoices?type=factures" active={type === 'factures'} label="Factures" />
        {STATUSES.map((s) => (
          <FilterLink key={s} href={`/admin/invoices?status=${s}`} active={status === s} label={INVOICE_STATUS_LABELS[s]} colorClass={INVOICE_STATUS_COLORS[s]} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
        {invoices && invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  {['N°', 'Type', 'Client', 'Statut', 'Total HT', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider text-[var(--text-ghost)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {(invoices as (Invoice & { client?: { name: string }; items?: { quantity: number; unit_price: number }[] })[]).map((invoice) => {
                  const subtotal = (invoice.items ?? []).reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
                  return (
                    <tr key={invoice.id} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-[var(--text-ghost)]" />
                          <span className="text-[var(--text-primary)] text-sm font-medium font-[family-name:var(--font-dm)]">{invoice.number}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-card-hover)] border border-[var(--border-input)] text-[var(--text-primary)]/50 font-[family-name:var(--font-dm)]">
                          {invoice.is_quote ? 'Devis' : 'Facture'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)]">
                        {(invoice.client as { name: string } | undefined)?.name ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md border font-[family-name:var(--font-dm)] font-medium ${INVOICE_STATUS_COLORS[invoice.status]}`}>
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[var(--text-primary)]/80 text-sm font-[family-name:var(--font-dm)] font-medium">
                        {subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </td>
                      <td className="px-5 py-4 text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)]">
                        {new Date(invoice.issued_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/invoices/${invoice.id}`} className="text-[#7BA7BC] text-xs hover:underline font-[family-name:var(--font-dm)]">
                          Voir →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)]">Aucun document trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterLink({ href, active, label, colorClass }: { href: string; active: boolean; label: string; colorClass?: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border transition-colors text-center
        ${active ? (colorClass ?? 'bg-[#7BA7BC]/15 text-[#7BA7BC] border-[#7BA7BC]/30') : 'bg-transparent text-[var(--text-primary)]/50 border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
    >
      {label}
    </Link>
  )
}
