'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building, Briefcase, Trash2, Edit3, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '@/types/crm'
import type { Client, Project, Note } from '@/types/crm'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const [{ data: clientData }, { data: projectsData }, { data: notesData }] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('projects').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    ])
    setClient(clientData)
    setProjects(projectsData ?? [])
    setNotes(notesData ?? [])
    if (clientData) {
      setForm({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone ?? '',
        company: clientData.company ?? '',
        notes: clientData.notes ?? '',
      })
    }
    setLoading(false)
  }

  async function saveEdit() {
    const { data } = await supabase.from('clients').update(form).eq('id', id).select().single()
    if (data) {
      setClient(data)
      setEditing(false)
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return
    const { data } = await supabase.from('notes').insert({ content: newNote, client_id: id }).select().single()
    if (data) {
      setNotes([data, ...notes])
      setNewNote('')
    }
  }

  async function deleteNote(noteId: string) {
    await supabase.from('notes').delete().eq('id', noteId)
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  async function deleteClient() {
    if (!confirm('Supprimer ce client et toutes ses données ?')) return
    await supabase.from('notes').delete().eq('client_id', id)
    await supabase.from('clients').delete().eq('id', id)
    router.push('/admin/clients')
  }

  if (loading) {
    return <div className="p-10 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#7BA7BC] border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!client) {
    return <div className="p-10 text-center text-[var(--text-faint)] font-[family-name:var(--font-dm)]">Client introuvable. <Link href="/admin/clients" className="text-[#7BA7BC] hover:underline">Retour</Link></div>
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">{client.name}</h1>
          {client.company && <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">{client.company}</p>}
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-[#7BA7BC] hover:bg-[#7BA7BC]/10 border border-[var(--border-input)] transition-colors">
              <Edit3 size={16} />
            </button>
          ) : (
            <>
              <button onClick={saveEdit} className="p-2 rounded-xl text-green-400 hover:bg-green-500/10 border border-green-500/30 transition-colors"><Check size={16} /></button>
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-[var(--text-primary)] border border-[var(--border-input)] transition-colors"><X size={16} /></button>
            </>
          )}
          <button onClick={deleteClient} className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-input)] transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Contact card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">Fiche client</h2>
            {editing ? (
              <div className="space-y-3">
                <EditField label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <EditField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
                <EditField label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <EditField label="Entreprise" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                <div>
                  <label className="block text-xs text-[var(--text-faint)] mb-1.5 font-[family-name:var(--font-dm)]">Notes libres</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={client.email} />
                <InfoRow icon={Phone} label="Téléphone" value={client.phone} />
                <InfoRow icon={Building} label="Entreprise" value={client.company} />
                {client.notes && (
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-[var(--text-faint)] text-xs font-[family-name:var(--font-dm)] mb-1">Notes</p>
                    <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">{client.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Projets */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)]">Projets</h2>
              <Link href={`/admin/projects/new?client_id=${id}`} className="text-[#7BA7BC] text-xs hover:underline font-[family-name:var(--font-dm)]">
                + Nouveau projet
              </Link>
            </div>
            <div className="space-y-2">
              {projects.map((project) => (
                <Link key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] transition-colors group">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-[var(--text-ghost)]" />
                    <span className="text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] group-hover:text-[#7BA7BC] transition-colors">{project.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-[family-name:var(--font-dm)] ${PROJECT_STATUS_COLORS[project.status]}`}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                </Link>
              ))}
              {projects.length === 0 && (
                <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)] text-center py-4">Aucun projet</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">Notes internes</h2>
            <form onSubmit={addNote} className="flex gap-2 mb-4">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#7BA7BC]/15 hover:bg-[#7BA7BC]/25 text-[#7BA7BC] border border-[#7BA7BC]/30 text-sm font-[family-name:var(--font-dm)] font-medium transition-colors">
                Ajouter
              </button>
            </form>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] group">
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">{note.content}</p>
                    <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)] mt-1">{new Date(note.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-ghost)] hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {notes.length === 0 && <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)] text-center py-4">Aucune note</p>}
            </div>
          </div>
        </div>

        {/* Quick info sidebar */}
        <div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] text-sm mb-4">Résumé</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">Projets</p>
                <p className="text-[var(--text-primary)] text-xl font-bold font-[family-name:var(--font-syne)]">{projects.length}</p>
              </div>
              <div>
                <p className="text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">Client depuis</p>
                <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)]">
                  {new Date(client.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-[var(--text-ghost)] shrink-0" />
      <span className="text-xs text-[var(--text-faint)] font-[family-name:var(--font-dm)] w-20 shrink-0">{label}</span>
      <span className="text-sm text-[var(--text-primary)]/80 font-[family-name:var(--font-dm)]">{value}</span>
    </div>
  )
}

function EditField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-[var(--text-faint)] mb-1.5 font-[family-name:var(--font-dm)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
      />
    </div>
  )
}
