import { createServerSupabaseClient } from '@/lib/supabase.server'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '@/types/crm'
import type { Lead, LeadStatus } from '@/types/crm'

export const dynamic = 'force-dynamic'

const STATUSES: LeadStatus[] = ['nouveau', 'contacté', 'qualifié', 'perdu']

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (status && STATUSES.includes(status as LeadStatus)) {
    query = query.eq('status', status)
  }
  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`)
  }

  const { data: leads } = await query

  return (
    <div className="p-6 lg:p-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">
            Leads
          </h1>
          <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">
            {leads?.length ?? 0} demande{(leads?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/leads/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90
            text-white text-sm font-[family-name:var(--font-dm)] font-medium transition-colors"
        >
          <Plus size={16} />
          Nouveau lead
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <form className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)]" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-input)] rounded-xl
              text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
              placeholder:text-[var(--text-ghost)] outline-none
              focus:border-[#7BA7BC]/40 transition-colors"
          />
        </form>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin/leads"
            className={`px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border transition-colors text-center
              ${!status ? 'bg-[#7BA7BC]/15 text-[#7BA7BC] border-[#7BA7BC]/30' : 'bg-transparent text-[var(--text-primary)]/50 border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
          >
            Tous
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/leads?status=${s}`}
              className={`px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border transition-colors text-center
                ${status === s ? LEAD_STATUS_COLORS[s] : 'bg-transparent text-[var(--text-primary)]/50 border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
            >
              {LEAD_STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
        {leads && leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  {['Nom', 'Email', 'Entreprise', 'Service', 'Statut', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider text-[var(--text-ghost)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {(leads as Lead[]).map((lead) => (
                  <tr key={lead.id} className="group hover:bg-[var(--bg-card)] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/leads/${lead.id}`} className="text-[var(--text-primary)] text-sm font-medium font-[family-name:var(--font-dm)] hover:text-[#7BA7BC] transition-colors">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)]">{lead.email}</td>
                    <td className="px-5 py-4 text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)]">{lead.company || '—'}</td>
                    <td className="px-5 py-4 text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)]">{lead.service || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-md border font-[family-name:var(--font-dm)] font-medium ${LEAD_STATUS_COLORS[lead.status]}`}>
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)]">
                      {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)]">
              Aucun lead trouvé
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
