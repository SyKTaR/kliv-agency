import { createServerSupabaseClient } from '@/lib/supabase.server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import KanbanBoard from '@/components/admin/KanbanBoard'
import type { Project } from '@/types/crm'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, client:clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">Projets</h1>
          <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">
            {projects?.length ?? 0} projet{(projects?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7BA7BC] hover:bg-[#7BA7BC]/90
            text-white text-sm font-[family-name:var(--font-dm)] font-medium transition-colors"
        >
          <Plus size={16} />
          Nouveau projet
        </Link>
      </div>

      {/* Kanban */}
      {projects && projects.length > 0 ? (
        <KanbanBoard projects={projects as (Project & { client?: { name: string } })[]} />
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl text-center py-16">
          <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)]">Aucun projet pour l&apos;instant</p>
          <Link href="/admin/projects/new" className="inline-block mt-3 text-[#7BA7BC] text-sm hover:underline font-[family-name:var(--font-dm)]">
            Créer le premier projet →
          </Link>
        </div>
      )}
    </div>
  )
}
