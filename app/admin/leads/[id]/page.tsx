'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Building, MessageSquare, Trash2, UserPlus, Link2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '@/types/crm'
import type { Lead, LeadStatus, Note } from '@/types/crm'

const STATUSES: LeadStatus[] = ['nouveau', 'contacté', 'qualifié', 'perdu']

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [lead, setLead] = useState<Lead | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const [{ data: leadData }, { data: notesData }] = await Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
      supabase.from('notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    ])
    setLead(leadData)
    setNotes(notesData ?? [])
    setLoading(false)
  }

  async function updateStatus(status: LeadStatus) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLead((prev) => prev ? { ...prev, status } : prev)
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return
    const { data } = await supabase.from('notes').insert({ content: newNote, lead_id: id }).select().single()
    if (data) {
      setNotes([data, ...notes])
      setNewNote('')
    }
  }

  async function deleteNote(noteId: string) {
    await supabase.from('notes').delete().eq('id', noteId)
    setNotes(notes.filter((n) => n.id !== noteId))
  }

  async function convertToClient() {
    if (!lead) return
    setConverting(true)
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        lead_id: id,
      })
      .select()
      .single()

    if (!error && client) {
      await supabase.from('leads').update({ status: 'qualifié', converted_to_client_id: client.id }).eq('id', id)
      router.push(`/admin/clients/${client.id}`)
    }
    setConverting(false)
  }

  async function deleteLead() {
    if (!confirm('Supprimer ce lead ?')) return
    await supabase.from('notes').delete().eq('lead_id', id)
    await supabase.from('leads').delete().eq('id', id)
    router.push('/admin/leads')
  }

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#7BA7BC] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-10 text-center text-[var(--text-faint)] font-[family-name:var(--font-dm)]">
        Lead introuvable.{' '}
        <Link href="/admin/leads" className="text-[#7BA7BC] hover:underline">Retour</Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {/* Back */}
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-[var(--text-faint)] hover:text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] mb-6 transition-colors">
        <ArrowLeft size={16} /> Leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">
            {lead.name}
          </h1>
          <p className="text-[var(--text-faint)] text-sm font-[family-name:var(--font-dm)] mt-1">
            Reçu le {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!lead.converted_to_client_id && (
            <button
              onClick={convertToClient}
              disabled={converting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25
                text-green-400 border border-green-500/30 text-sm font-[family-name:var(--font-dm)] font-medium
                transition-colors disabled:opacity-50"
            >
              <UserPlus size={15} />
              {converting ? 'Conversion...' : 'Convertir en client'}
            </button>
          )}
          {lead.converted_to_client_id && (
            <Link
              href={`/admin/clients/${lead.converted_to_client_id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7BA7BC]/15
                text-[#7BA7BC] border border-[#7BA7BC]/30 text-sm font-[family-name:var(--font-dm)] font-medium"
            >
              <User size={15} /> Voir la fiche client
            </Link>
          )}
          {lead.related_lead_id && (
            <Link
              href={`/admin/leads/${lead.related_lead_id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10
                text-amber-500 border border-amber-500/25 text-sm font-[family-name:var(--font-dm)] font-medium"
            >
              <Link2 size={15} /> Lead récurrent
            </Link>
          )}
          <button
            onClick={deleteLead}
            className="p-2 rounded-xl text-[var(--text-ghost)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-input)] transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Infos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">
              Informations de contact
            </h2>
            <div className="space-y-3">
              <Info icon={Mail} label="Email" value={lead.email} />
              <Info icon={Phone} label="Téléphone" value={lead.phone} />
              <Info icon={Building} label="Entreprise" value={lead.company} />
              <Info icon={User} label="Service" value={lead.service} />
              <Info icon={MessageSquare} label="Budget" value={lead.budget} />
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
              <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-3">
                Message
              </h2>
              <p className="text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">
                {lead.message}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] mb-4">
              Notes internes
            </h2>
            <form onSubmit={addNote} className="flex gap-2 mb-4">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 px-3 py-2.5 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl
                  text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
                  placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#7BA7BC]/15 hover:bg-[#7BA7BC]/25
                  text-[#7BA7BC] border border-[#7BA7BC]/30 text-sm font-[family-name:var(--font-dm)] font-medium
                  transition-colors"
              >
                Ajouter
              </button>
            </form>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] group">
                  <p className="flex-1 text-[var(--text-primary)]/70 text-sm font-[family-name:var(--font-dm)] leading-relaxed">
                    {note.content}
                  </p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-ghost)] hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-[var(--text-ghost)] text-sm font-[family-name:var(--font-dm)] text-center py-4">
                  Aucune note
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statut sidebar */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-[family-name:var(--font-syne)] font-bold text-[var(--text-primary)] text-sm mb-3">
              Statut
            </h3>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-[family-name:var(--font-dm)] font-medium border text-left transition-colors
                    ${lead.status === s ? LEAD_STATUS_COLORS[s] : 'bg-transparent text-[var(--text-faint)] border-[var(--border-input)] hover:text-[var(--text-primary)]'}`}
                >
                  {LEAD_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-[var(--text-ghost)] shrink-0" />
      <span className="text-xs text-[var(--text-faint)] font-[family-name:var(--font-dm)] w-20 shrink-0">{label}</span>
      <span className="text-sm text-[var(--text-primary)]/80 font-[family-name:var(--font-dm)]">{value}</span>
    </div>
  )
}
