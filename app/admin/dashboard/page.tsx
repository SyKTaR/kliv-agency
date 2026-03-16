import { createServerSupabaseClient } from '@/lib/supabase.server'
import Link from 'next/link'
import {
  UserCircle,
  Briefcase,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '@/types/crm'
import type { Lead, Project, Event } from '@/types/crm'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: leadsCount },
    { count: newLeadsCount },
    { count: projectsCount },
    { count: activeProjectsCount },
    { data: recentLeads },
    { data: upcomingEvents },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'en cours'),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('events').select('*, client:clients(name)').gte('start_at', new Date().toISOString()).order('start_at').limit(5),
    supabase.from('projects').select('*, client:clients(name)').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="p-6 lg:p-10 w-full">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="font-[family-name:var(--font-syne)] text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Dashboard
        </h1>
        <p
          className="text-sm font-[family-name:var(--font-dm)] mt-1"
          style={{ color: 'var(--text-faint)' }}
        >
          Bienvenue dans votre espace Kliv CRM
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Leads total" value={leadsCount ?? 0} icon={UserCircle} href="/admin/leads" sub="Toutes demandes" />
        <StatCard label="Nouveaux leads" value={newLeadsCount ?? 0} icon={TrendingUp} href="/admin/leads" sub="À traiter" highlight />
        <StatCard label="Projets en cours" value={activeProjectsCount ?? 0} icon={Briefcase} href="/admin/projects" sub="Projets actifs" />
        <StatCard label="Projets total" value={projectsCount ?? 0} icon={Clock} href="/admin/projects" sub="Tous projets" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads récents */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-[family-name:var(--font-syne)] font-bold text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Leads récents
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm hover:underline flex items-center gap-1 font-[family-name:var(--font-dm)]"
              style={{ color: 'var(--accent)' }}
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads && recentLeads.length > 0 ? (
              (recentLeads as Lead[]).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-xl transition-colors group"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <p
                      className="text-sm font-medium font-[family-name:var(--font-dm)]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lead.name}
                    </p>
                    <p
                      className="text-xs font-[family-name:var(--font-dm)] mt-0.5"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      {lead.email} · {lead.company || 'Particulier'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md border font-[family-name:var(--font-dm)] font-medium ${LEAD_STATUS_COLORS[lead.status]}`}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </span>
                </Link>
              ))
            ) : (
              <p
                className="text-sm font-[family-name:var(--font-dm)] text-center py-8"
                style={{ color: 'var(--text-ghost)' }}
              >
                Aucun lead pour l&apos;instant
              </p>
            )}
          </div>
        </div>

        {/* Prochains événements */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-[family-name:var(--font-syne)] font-bold text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              À venir
            </h2>
            <Link
              href="/admin/planning"
              className="text-sm hover:underline flex items-center gap-1 font-[family-name:var(--font-dm)]"
              style={{ color: 'var(--accent)' }}
            >
              Planning <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              (upcomingEvents as (Event & { client?: { name: string } })[]).map((event) => {
                const date = new Date(event.start_at)
                return (
                  <div
                    key={event.id}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="text-center min-w-[40px]">
                      <p
                        className="font-bold text-sm font-[family-name:var(--font-syne)]"
                        style={{ color: 'var(--accent)' }}
                      >
                        {date.getDate()}
                      </p>
                      <p
                        className="text-xs font-[family-name:var(--font-dm)] uppercase"
                        style={{ color: 'var(--text-faint)' }}
                      >
                        {date.toLocaleString('fr-FR', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium font-[family-name:var(--font-dm)]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {event.title}
                      </p>
                      {event.client && (
                        <p
                          className="text-xs font-[family-name:var(--font-dm)] mt-0.5"
                          style={{ color: 'var(--text-faint)' }}
                        >
                          {event.client.name}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p
                className="text-sm font-[family-name:var(--font-dm)] text-center py-8"
                style={{ color: 'var(--text-ghost)' }}
              >
                Aucun événement à venir
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Projets récents */}
      <div
        className="mt-6 rounded-2xl p-6"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-[family-name:var(--font-syne)] font-bold text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            Projets récents
          </h2>
          <Link
            href="/admin/projects"
            className="text-sm hover:underline flex items-center gap-1 font-[family-name:var(--font-dm)]"
            style={{ color: 'var(--accent)' }}
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentProjects && recentProjects.length > 0 ? (
            (recentProjects as (Project & { client?: { name: string } })[]).map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="p-4 rounded-xl transition-colors group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <p
                  className="text-sm font-medium font-[family-name:var(--font-dm)] truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {project.name}
                </p>
                <p
                  className="text-xs font-[family-name:var(--font-dm)] mt-1"
                  style={{ color: 'var(--text-faint)' }}
                >
                  {(project.client as { name: string } | undefined)?.name ?? '—'}
                </p>
                {project.amount && (
                  <p
                    className="text-sm font-medium font-[family-name:var(--font-dm)] mt-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    {project.amount.toLocaleString('fr-FR')} €
                  </p>
                )}
              </Link>
            ))
          ) : (
            <p
              className="text-sm font-[family-name:var(--font-dm)] col-span-3 text-center py-8"
              style={{ color: 'var(--text-ghost)' }}
            >
              Aucun projet pour l&apos;instant
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon: Icon, href, sub, highlight,
}: {
  label: string; value: number; icon: React.ElementType; href: string; sub: string; highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className="p-5 rounded-2xl transition-all group"
      style={{
        background: highlight ? 'rgba(123,167,188,0.1)' : 'var(--bg-surface)',
        border: highlight ? '1px solid rgba(123,167,188,0.2)' : '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon
          size={20}
          style={{ color: highlight ? 'var(--accent)' : 'var(--text-ghost)' }}
        />
      </div>
      <p
        className="font-[family-name:var(--font-syne)] text-2xl font-bold"
        style={{ color: highlight ? 'var(--accent)' : 'var(--text-primary)' }}
      >
        {value}
      </p>
      <p
        className="text-xs font-[family-name:var(--font-dm)] mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>
      <p
        className="text-xs font-[family-name:var(--font-dm)] mt-0.5"
        style={{ color: 'var(--text-ghost)' }}
      >
        {sub}
      </p>
    </Link>
  )
}
