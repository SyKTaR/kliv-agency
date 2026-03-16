'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  UserCircle,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: UserCircle },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/projects', label: 'Projets', icon: Briefcase },
  { href: '/admin/planning', label: 'Planning', icon: Calendar },
  { href: '/admin/invoices', label: 'Devis & Factures', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div data-sidebar className="print:hidden contents">
      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex
        `}
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/picto-anthracite.png"
              alt="Kliv"
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            />
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{
                background: 'rgba(123,167,188,0.15)',
                color: 'var(--accent)',
                border: '1px solid rgba(123,167,188,0.25)',
                fontFamily: 'var(--font-dm-var), sans-serif',
              }}
            >
              CRM
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150 group
                `}
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  background: active ? 'rgba(123,167,188,0.12)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-faint)',
                  border: active ? '1px solid rgba(123,167,188,0.2)' : '1px solid transparent',
                }}
              >
                <Icon size={18} style={{ color: active ? 'var(--accent)' : 'var(--text-ghost)' }} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--accent)', opacity: 0.6 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Theme toggle + Logout */}
        <div className="p-4 space-y-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <span
              style={{
                fontFamily: 'var(--font-dm-var), sans-serif',
                fontSize: '13px',
                color: 'var(--text-faint)',
                flex: 1,
              }}
            >
              Thème
            </span>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-150"
            style={{
              fontFamily: 'var(--font-dm-var), sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-faint)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  )
}
