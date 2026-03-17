import type { Metadata } from 'next'
import Sidebar from '@/components/admin/Sidebar'

export const metadata: Metadata = {
  title: 'Kliv CRM',
  description: 'Espace d\'administration Kliv',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="min-h-full pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
