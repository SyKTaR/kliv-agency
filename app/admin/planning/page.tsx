'use client'

import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Calendar from '@/components/admin/Calendar'
import type { Event, EventType } from '@/types/crm'

type PartialClient = { id: string; name: string }
type PartialProject = { id: string; name: string }
type EventWithRels = Event & { client?: { name: string }; project?: { name: string } }

const EVENT_TYPES: EventType[] = ['rdv', 'deadline', 'autre']

const emptyForm = {
  title: '', start_at: '', end_at: '', description: '',
  client_id: '', project_id: '', type: 'rdv' as EventType,
}

export default function PlanningPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<EventWithRels[]>([])
  const [clients, setClients] = useState<PartialClient[]>([])
  const [projects, setProjects] = useState<PartialProject[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [{ data: eventsData }, { data: clientsData }, { data: projectsData }] = await Promise.all([
      supabase.from('events').select('*, client:clients(name), project:projects(name)').order('start_at'),
      supabase.from('clients').select('id, name').order('name'),
      supabase.from('projects').select('id, name').order('name'),
    ])
    setEvents(eventsData ?? [])
    setClients(clientsData ?? [])
    setProjects(projectsData ?? [])
    setLoading(false)
  }

  function openNew(prefilledDate?: string) {
    setEditingId(null)
    setForm({
      ...emptyForm,
      start_at: prefilledDate ? `${prefilledDate}T09:00` : '',
      end_at: prefilledDate ? `${prefilledDate}T10:00` : '',
    })
    setShowModal(true)
  }

  function openEdit(event: EventWithRels) {
    setEditingId(event.id)
    setForm({
      title: event.title,
      start_at: event.start_at ? event.start_at.slice(0, 16) : '',
      end_at: event.end_at ? event.end_at.slice(0, 16) : '',
      description: event.description ?? '',
      client_id: event.client_id ?? '',
      project_id: event.project_id ?? '',
      type: event.type,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  async function saveEvent(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      start_at: form.start_at,
      end_at: form.end_at || null,
      description: form.description || null,
      client_id: form.client_id || null,
      project_id: form.project_id || null,
      type: form.type,
    }

    if (editingId) {
      // Update
      const { data } = await supabase
        .from('events')
        .update(payload)
        .eq('id', editingId)
        .select('*, client:clients(name), project:projects(name)')
        .single()
      if (data) {
        setEvents(events.map((ev) => (ev.id === editingId ? data : ev)))
      }
    } else {
      // Create
      const { data } = await supabase
        .from('events')
        .insert(payload)
        .select('*, client:clients(name), project:projects(name)')
        .single()
      if (data) {
        setEvents([...events, data])
      }
    }

    setSaving(false)
    closeModal()
  }

  if (loading) return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-syne-var), sans-serif', fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Planning</h1>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)' }}>
            {events.length} événement{events.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNew()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'var(--accent)', color: 'var(--bg-primary)', fontFamily: 'var(--font-dm-var), sans-serif' }}
        >
          <Plus size={16} />
          Nouvel événement
        </button>
      </div>

      {/* Calendar — clicking a day pre-fills the date in the modal */}
      <Calendar
        events={events}
        onDayClick={(dateStr) => openNew(dateStr)}
        onEventEdit={openEdit}
      />

      {/* Upcoming list */}
      <div className="mt-8 rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-syne-var), sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>Prochains événements</h2>
        <div className="space-y-2">
          {events
            .filter((e) => new Date(e.start_at) >= new Date())
            .slice(0, 10)
            .map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-center min-w-[52px]">
                  <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-syne-var), sans-serif', color: 'var(--accent)' }}>
                    {new Date(event.start_at).getDate()}
                  </p>
                  <p className="text-xs uppercase" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-ghost)' }}>
                    {new Date(event.start_at).toLocaleString('fr-FR', { month: 'short' })}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-primary)' }}>{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {event.client && <span className="text-xs" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)' }}>{event.client.name}</span>}
                    <span className="text-xs" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--accent)' }}>
                      {new Date(event.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-md capitalize" style={{ fontFamily: 'var(--font-dm-var), sans-serif', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}>
                    {event.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    className="text-xs px-2 py-0.5 rounded-md transition-colors"
                    style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--accent)', border: '1px solid rgba(123,167,188,0.3)', background: 'rgba(123,167,188,0.08)' }}
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          {events.filter((e) => new Date(e.start_at) >= new Date()).length === 0 && (
            <p className="text-sm text-center py-6" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-ghost)' }}>Aucun événement à venir</p>
          )}
        </div>
      </div>

      {/* Modal création / édition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: 'var(--font-syne-var), sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingId ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h3>
              <button type="button" aria-label="Fermer" onClick={closeModal} style={{ color: 'var(--text-faint)' }} className="transition-colors hover:opacity-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveEvent} className="space-y-4">
              <MField label="Titre *">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Réunion client..." className={inputCls} style={inputStyle} />
              </MField>
              <div className="grid grid-cols-2 gap-3">
                <MField label="Début *">
                  <input
                    required
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                  />
                </MField>
                <MField label="Fin">
                  <input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                  />
                </MField>
              </div>
              <MField label="Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })} className={inputCls} style={inputStyle}>
                  {EVENT_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </MField>
              <MField label="Client">
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className={inputCls} style={inputStyle}>
                  <option value="">—</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </MField>
              <MField label="Projet">
                <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} className={inputCls} style={inputStyle}>
                  <option value="">—</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </MField>
              <MField label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} style={inputStyle} />
              </MField>
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)', border: '1px solid var(--border-subtle)' }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium transition-colors" style={{ fontFamily: 'var(--font-dm-var), sans-serif', background: 'var(--accent)', color: 'var(--bg-primary)', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors'

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-dm-var), sans-serif',
}

function MField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs mb-1.5 font-medium" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)' }}>{label}</label>
      {children}
    </div>
  )
}
