'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Edit3, Check, X, Calendar, Euro } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '@/types/crm'
import type { Project, ProjectStatus, ProjectType, Client, Note } from '@/types/crm'

const PROJECT_STATUSES: ProjectStatus[] = ['en attente', 'en cours', 'en révision', 'livré', 'en pause']
const PROJECT_TYPES: ProjectType[] = ['site web', 'crm', 'automatisation', 'autre']

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [project, setProject] = useState<Project & { client?: Client } | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'site web' as ProjectType, status: 'en attente' as ProjectStatus,
    start_date: '', delivery_date: '', amount: '', description: '',
  })

  useEffect(() => { fetchData() }, [id])

  async function fetchData() {
    const [{ data: proj }, { data: notesData }] = await Promise.all([
      supabase.from('projects').select('*, client:clients(*)').eq('id', id).single(),
      supabase.from('notes').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    ])
    setProject(proj)
    setNotes(notesData ?? [])
    if (proj) {
      setForm({
        name: proj.name,
        type: proj.type ?? 'site web',
        status: proj.status,
        start_date: proj.start_date ?? '',
        delivery_date: proj.delivery_date ?? '',
        amount: proj.amount?.toString() ?? '',
        description: proj.description ?? '',
      })
    }
    setLoading(false)
  }

  async function updateStatus(status: ProjectStatus) {
    await supabase.from('projects').update({ status }).eq('id', id)
    setProject((prev) => prev ? { ...prev, status } : prev)
  }

  async function saveEdit() {
    const payload = { ...form, amount: form.amount ? parseFloat(form.amount) : null, start_date: form.start_date || null, delivery_date: form.delivery_date || null }
    const { data } = await supabase.from('projects').update(payload).eq('id', id).select('*, client:clients(*)').single()
    if (data) { setProject(data); setEditing(false) }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return
    const { data } = await supabase.from('notes').insert({ content: newNote, project_id: id }).select().single()
    if (data) { setNotes([data, ...notes]); setNewNote('') }
  }

  async function deleteNote(noteId: string) {
    await supabase.from('notes').delete().eq('id', noteId)
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  async function deleteProject() {
    if (!confirm('Supprimer ce projet ?')) return
    await supabase.from('notes').delete().eq('project_id', id)
    await supabase.from('projects').delete().eq('id', id)
    router.push('/admin/projects')
  }

  if (loading) return <div className="p-10 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#7BA7BC] border-t-transparent rounded-full animate-spin" /></div>
  if (!project) return <div className="p-10 text-center text-[var(--text-faint)] font-[family-name:var(--font-dm)]">Projet introuvable. <Link href="/admin/projects" className="text-[#7BA7BC] hover:underline">Retour</Link></div>

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Projets
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">{project.name}</h1>
          {project.client && (
            <Link href={`/admin/clients/${project.client.id}`} className="text-[#7BA7BC] text-sm font-[family-name:var(--font-dm)] hover:underline mt-1 inline-block">
              {project.client.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-[#7BA7BC] hover:bg-[#7BA7BC]/10 border border-[var(--border-input)] transition-colors"><Edit3 size={16} /></button>
          ) : (
            <>
              <button onClick={saveEdit} className="p-2 rounded-xl text-green-400 hover:bg-green-500/10 border border-green-500/30 transition-colors"><Check size={16} /></button>
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-[var(--text-primary)] border border-[var(--border-input)] transition-colors"><X size={16} /></button>
            </>
          )}
          <button onClick={deleteProject} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-input)] transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">Détails du projet</h2>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <ELabel>Nom</ELabel>
                  <EInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <ELabel>Type</ELabel>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })} className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors capitalize">
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <ELabel>Montant (€)</ELabel>
                    <EInput type="number" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="2500" />
                  </div>
                  <div>
                    <ELabel>Date de début</ELabel>
                    <EInput type="date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} />
                  </div>
                  <div>
                    <ELabel>Date de livraison</ELabel>
                    <EInput type="date" value={form.delivery_date} onChange={(v) => setForm({ ...form, delivery_date: v })} />
                  </div>
                </div>
                <div>
                  <ELabel>Description</ELabel>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors resize-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Row label="Type" value={project.type} />
                <Row label="Montant" value={project.amount ? `${project.amount.toLocaleString('fr-FR')} €` : undefined} icon={Euro} />
                <Row label="Début" value={project.start_date ? new Date(project.start_date).toLocaleDateString('fr-FR') : undefined} icon={Calendar} />
                <Row label="Livraison" value={project.delivery_date ? new Date(project.delivery_date).toLocaleDateString('fr-FR') : undefined} icon={Calendar} />
                {project.description && (
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-[var(--text-faint)] text-xs font-[family-name:var(--font-dm)] mb-1">Description</p>
                    <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">{project.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">Notes</h2>
            <form onSubmit={addNote} className="flex gap-2 mb-4">
              <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Ajouter une note..." className="flex-1 px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors" />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#7BA7BC]/15 hover:bg-[#7BA7BC]/25 text-[#7BA7BC] border border-[#7BA7BC]/30 text-sm font-[family-name:var(--font-dm)] font-medium transition-colors">Ajouter</button>
            </form>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] group">
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">{note.content}</p>
                    <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)] mt-1">{new Date(note.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-ghost)] hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              ))}
              {notes.length === 0 && <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)] text-center py-4">Aucune note</p>}
            </div>
          </div>
        </div>

        {/* Sidebar statut */}
        <div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] text-sm mb-3">Statut</h3>
            <div className="space-y-2">
              {PROJECT_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border text-left transition-colors
                    ${project.status === s ? PROJECT_STATUS_COLORS[s] : 'bg-transparent text-[var(--text-faint)] border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
                >
                  {PROJECT_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      {Icon ? <Icon size={15} className="text-[var(--text-ghost)] shrink-0" /> : <span className="w-[15px]" />}
      <span className="text-xs text-[var(--text-faint)] font-[family-name:var(--font-dm)] w-20 shrink-0">{label}</span>
      <span className="text-sm text-[var(--text-primary)]/80 font-[family-name:var(--font-dm)] capitalize">{value}</span>
    </div>
  )
}

function ELabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-[var(--text-faint)] mb-1.5 font-[family-name:var(--font-dm)]">{children}</label>
}

function EInput({ value, onChange, required, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
      className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors" />
  )
}
