// ─── Types CRM Kliv ───────────────────────────────────────────────────────

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

export type LeadStatus = 'nouveau' | 'contacté' | 'qualifié' | 'perdu'
export type ProjectStatus = 'en attente' | 'en cours' | 'en révision' | 'livré' | 'en pause'
export type ProjectType = 'site web' | 'crm' | 'automatisation' | 'autre'
export type InvoiceStatus = 'brouillon' | 'envoyé' | 'accepté' | 'refusé' | 'facturé'
export type EventType = 'rdv' | 'deadline' | 'autre'

export interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  service?: string
  budget?: string
  status: LeadStatus
  notes?: string
  converted_to_client_id?: string
  related_lead_id?: string
}

export interface Client {
  id: string
  created_at: string
  name: string
  company?: string
  email: string
  phone?: string
  notes?: string
  lead_id?: string
  projects?: Project[]
}

export interface Project {
  id: string
  created_at: string
  client_id: string
  client?: Client
  name: string
  type?: ProjectType
  status: ProjectStatus
  start_date?: string
  delivery_date?: string
  amount?: number
  description?: string
}

export interface Event {
  id: string
  created_at: string
  title: string
  start_at: string
  end_at?: string
  description?: string
  client_id?: string
  client?: Client
  project_id?: string
  project?: Project
  type: EventType
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
}

export interface Invoice {
  id: string
  created_at: string
  client_id: string
  client?: Client
  project_id?: string
  project?: Project
  number: string
  status: InvoiceStatus
  is_quote: boolean
  tva: number
  notes?: string
  issued_at: string
  valid_until?: string
  items?: InvoiceItem[]
}

export interface Note {
  id: string
  created_at: string
  content: string
  lead_id?: string
  client_id?: string
  project_id?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: 'Nouveau',
  contacté: 'Contacté',
  qualifié: 'Qualifié',
  perdu: 'Perdu',
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  nouveau: 'bg-blue-500/15 text-blue-600 border-blue-500/25',
  contacté: 'bg-amber-500/15 text-amber-600 border-amber-500/25',
  qualifié: 'bg-green-500/15 text-green-600 border-green-500/25',
  perdu: 'bg-red-500/15 text-red-600 border-red-500/25',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'en attente': 'En attente',
  'en cours': 'En cours',
  'en révision': 'En révision',
  livré: 'Livré',
  'en pause': 'En pause',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  'en attente': 'bg-slate-500/15 text-slate-600 border-slate-500/25',
  'en cours': 'bg-blue-500/15 text-blue-600 border-blue-500/25',
  'en révision': 'bg-amber-500/15 text-amber-600 border-amber-500/25',
  livré: 'bg-green-500/15 text-green-600 border-green-500/25',
  'en pause': 'bg-orange-500/15 text-orange-600 border-orange-500/25',
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: 'Brouillon',
  envoyé: 'Envoyé',
  accepté: 'Accepté',
  refusé: 'Refusé',
  facturé: 'Facturé',
}

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  brouillon: 'bg-slate-500/15 text-slate-600 border-slate-500/25',
  envoyé: 'bg-blue-500/15 text-blue-600 border-blue-500/25',
  accepté: 'bg-green-500/15 text-green-600 border-green-500/25',
  refusé: 'bg-red-500/15 text-red-600 border-red-500/25',
  facturé: 'bg-purple-500/15 text-purple-600 border-purple-500/25',
}
