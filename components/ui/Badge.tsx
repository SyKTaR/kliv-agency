/**
 * Badge.tsx — Badge / tag pour les cards et sections
 * Fond semi-transparent, bordure fine, texte petit uppercase
 * Variante "blue" pour les badges de mise en avant (offre recommandée)
 */

import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'blue' | 'dark'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const base =
    'inline-block text-[10px] font-dm font-medium uppercase tracking-[0.15em] px-3 py-1 rounded-sm'

  const variants = {
    default:
      'bg-[var(--bg-card)] border border-[var(--border-medium)] text-[var(--text-muted)]',
    blue:
      'bg-[#7BA7BC] border border-[#7BA7BC] text-[#080d14]',
    dark:
      'bg-[rgba(8,13,20,0.6)] border border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.7)]',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
