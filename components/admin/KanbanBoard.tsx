'use client'

import Link from 'next/link'
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '@/types/crm'
import type { Project, ProjectStatus } from '@/types/crm'

const COLUMNS: ProjectStatus[] = ['en attente', 'en cours', 'en révision', 'livré', 'en pause']

interface Props {
  projects: (Project & { client?: { name: string } })[]
}

export default function KanbanBoard({ projects }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const col = projects.filter((p) => p.status === status)
        return (
          <div key={status} className="min-w-[260px] flex-shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`text-xs px-2 py-0.5 rounded-md border font-[family-name:var(--font-dm)] font-medium ${PROJECT_STATUS_COLORS[status]}`}>
                {PROJECT_STATUS_LABELS[status]}
              </span>
              <span className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">{col.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {col.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="block bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4
                    hover:border-[var(--border-medium)] hover:bg-[var(--bg-card-hover)] transition-all group"
                >
                  <h3 className="text-[var(--text-primary)] text-sm font-medium font-[family-name:var(--font-dm)] group-hover:text-[#7BA7BC] transition-colors leading-snug">
                    {project.name}
                  </h3>
                  {project.client && (
                    <p className="text-[var(--text-faint)] text-xs font-[family-name:var(--font-dm)] mt-1">
                      {project.client.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {project.type && (
                      <span className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)] capitalize">
                        {project.type}
                      </span>
                    )}
                    {project.amount && (
                      <span className="text-[#7BA7BC] text-xs font-medium font-[family-name:var(--font-dm)]">
                        {project.amount.toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>
                  {project.delivery_date && (
                    <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)] mt-2">
                      Livraison : {new Date(project.delivery_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </Link>
              ))}
              {col.length === 0 && (
                <div className="border border-dashed border-[var(--border-subtle)] rounded-xl p-4 text-center">
                  <p className="text-[var(--text-ultra-faint)] text-xs font-[family-name:var(--font-dm)]">Vide</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
