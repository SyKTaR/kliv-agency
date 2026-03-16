/**
 * Button.tsx — Composant bouton réutilisable
 * Deux variantes : primary (fond crème) et ghost (texte seul)
 * Framer Motion : scale au tap, légère assombrissement au hover
 */

'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'outline'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  /** Cible cursor personnalisé */
  dataCursor?: string
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  dataCursor = 'pointer',
}: ButtonProps) {

  const baseClasses =
    'inline-flex items-center gap-2 font-dm text-sm font-medium tracking-wide transition-colors cursor-pointer select-none'

  const variantClasses = {
    primary:
      'px-6 py-3 rounded-sm',
    ghost:
      'px-2 py-1',
    outline:
      'px-6 py-3 rounded-sm',
  }

  const variantStyle = {
    primary: {
      background: 'var(--btn-primary-bg)',
      color: 'var(--btn-primary-text)',
    },
    ghost: { color: 'var(--text-muted)' },
    outline: { border: '1px solid var(--border-medium)', color: 'var(--text-primary)' },
  }[variant]

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  const motionProps = {
    whileHover: { scale: 1.02, filter: variant === 'primary' ? 'brightness(0.92)' : 'none' } as const,
    whileTap:   { scale: 0.98 } as const,
    transition: { duration: 0.15 },
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        style={variantStyle}
        data-cursor={dataCursor}
        {...motionProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      data-cursor={dataCursor}
      style={disabled ? { ...variantStyle, opacity: 0.4, cursor: 'not-allowed' } : variantStyle}
      {...(disabled ? {} : motionProps)}
    >
      {children}
    </motion.button>
  )
}
