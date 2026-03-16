import { createServerSupabaseClient } from '@/lib/supabase.server'
import Link from 'next/link'
import { Plus, Search, Building, Mail } from 'lucide-react'
import type { Client } from '@/types/crm'

export const dynamic = 'force-dynamic'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase.from('clients').select('*, projects(id, name, status)').order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`)
  }

  const { data: clients } = await query

  return (
    <div className="p-6 lg:p-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">
            Clients
          </h1>
          <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">
            {clients?.length ?? 0} client{(clients?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90
            text-white text-sm font-[family-name:var(--font-dm)] font-medium transition-colors"
        >
          <Plus size={16} />
          Nouveau client
        </Link>
      </div>

      {/* Search */}
      <form className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)]" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher un client..."
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-input)] rounded-xl
            text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
            placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
        />
      </form>

      {/* Grid */}
      {clients && clients.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(clients as (Client & { projects?: { id: string; name: string; status: string }[] })[]).map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 hover:bg-[var(--bg-surface)]/80
                hover:border-[var(--border-medium)] transition-all group"
            >
              {/* Avatar initials */}
              <div className="w-10 h-10 rounded-xl bg-[#7BA7BC]/15 border border-[#7BA7BC]/20 flex items-center justify-center mb-4">
                <span className="font-[family-name:var(--font-syne)] font-bold text-[#7BA7BC] text-sm">
                  {client.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>

              <h3 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] text-base group-hover:text-[#7BA7BC] transition-colors">
                {client.name}
              </h3>

              {client.company && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Building size={12} className="text-[var(--text-ghost)]" />
                  <p className="text-[var(--text-primary)]/50 text-xs font-[family-name:var(--font-dm)]">{client.company}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 mt-1">
                <Mail size={12} className="text-[var(--text-ghost)]" />
                <p className="text-[var(--text-primary)]/50 text-xs font-[family-name:var(--font-dm)] truncate">{client.email}</p>
              </div>

              {client.projects && client.projects.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">
                    {client.projects.length} projet{client.projects.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl text-center py-16">
          <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)]">Aucun client trouvé</p>
        </div>
      )}
    </div>
  )
}
