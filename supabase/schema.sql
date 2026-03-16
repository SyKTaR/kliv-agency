-- ═══════════════════════════════════════════════════════════════
--  KLIV CRM — Schéma Supabase complet
--  À exécuter dans l'éditeur SQL de ton projet Supabase
-- ═══════════════════════════════════════════════════════════════

-- ─── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Tables ────────────────────────────────────────────────────

-- Leads (demandes de contact depuis le site)
create table if not exists leads (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz default now(),
  name                    text not null,
  email                   text not null,
  phone                   text,
  company                 text,
  message                 text,
  service                 text,
  budget                  text,
  status                  text not null default 'nouveau'
    check (status in ('nouveau', 'contacté', 'qualifié', 'perdu')),
  notes                   text,
  converted_to_client_id  uuid,
  related_lead_id         uuid
);

-- Clients
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  company     text,
  email       text not null,
  phone       text,
  notes       text,
  lead_id     uuid references leads(id) on delete set null
);

-- Clé étrangère lead → client (après création des deux tables)
alter table leads
  add constraint leads_converted_to_client_id_fkey
  foreign key (converted_to_client_id)
  references clients(id)
  on delete set null;

-- Clé étrangère lead → lead parent (demande récurrente d'un lead existant)
alter table leads
  add constraint leads_related_lead_id_fkey
  foreign key (related_lead_id)
  references leads(id)
  on delete set null;

-- Projets
create table if not exists projects (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  client_id       uuid not null references clients(id) on delete cascade,
  name            text not null,
  type            text check (type in ('site web', 'crm', 'automatisation', 'autre')),
  status          text not null default 'en attente'
    check (status in ('en attente', 'en cours', 'en révision', 'livré', 'en pause')),
  start_date      date,
  delivery_date   date,
  amount          numeric(10, 2),
  description     text
);

-- Événements (planning)
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  title       text not null,
  start_at    timestamptz not null,
  end_at      timestamptz,
  description text,
  client_id   uuid references clients(id) on delete set null,
  project_id  uuid references projects(id) on delete set null,
  type        text not null default 'rdv'
    check (type in ('rdv', 'deadline', 'autre'))
);

-- Devis & Factures
create table if not exists invoices (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  client_id   uuid not null references clients(id) on delete cascade,
  project_id  uuid references projects(id) on delete set null,
  number      text not null,
  status      text not null default 'brouillon'
    check (status in ('brouillon', 'envoyé', 'accepté', 'refusé', 'facturé')),
  is_quote    boolean not null default true,
  tva         numeric(5, 2) not null default 0,
  notes       text,
  issued_at   date not null default current_date,
  valid_until date
);

-- Lignes de devis/facture
create table if not exists invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity    numeric(10, 2) not null default 1,
  unit_price  numeric(10, 2) not null
);

-- Notes internes (polymorphes)
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  content     text not null,
  lead_id     uuid references leads(id) on delete cascade,
  client_id   uuid references clients(id) on delete cascade,
  project_id  uuid references projects(id) on delete cascade
);

-- ─── Index ─────────────────────────────────────────────────────
create index if not exists idx_leads_status         on leads(status);
create index if not exists idx_leads_email          on leads(email);
create index if not exists idx_leads_related_lead   on leads(related_lead_id);
create index if not exists idx_projects_client_id   on projects(client_id);
create index if not exists idx_projects_status      on projects(status);
create index if not exists idx_events_start_at      on events(start_at);
create index if not exists idx_invoices_client_id   on invoices(client_id);
create index if not exists idx_invoices_is_quote    on invoices(is_quote);
create index if not exists idx_invoice_items_inv_id on invoice_items(invoice_id);
create index if not exists idx_notes_lead_id        on notes(lead_id);
create index if not exists idx_notes_client_id      on notes(client_id);
create index if not exists idx_notes_project_id     on notes(project_id);

-- ─── RLS (Row Level Security) ──────────────────────────────────
-- Active RLS sur toutes les tables
alter table leads          enable row level security;
alter table clients        enable row level security;
alter table projects       enable row level security;
alter table events         enable row level security;
alter table invoices       enable row level security;
alter table invoice_items  enable row level security;
alter table notes          enable row level security;

-- Policies : seul l'admin authentifié peut accéder
-- (seul utilisateur = toi, donc on autorise tout utilisateur authentifié)

create policy "Authenticated users can manage leads"
  on leads for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage clients"
  on clients for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage events"
  on events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage invoices"
  on invoices for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage invoice_items"
  on invoice_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage notes"
  on notes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
