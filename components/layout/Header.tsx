/**
 * Header.tsx — Navigation sticky avec backdrop blur
 * - Logo image Kliv (PNG)
 * - Liens de navigation desktop
 * - CTA "Parlons-en →" + toggle thème
 * - Menu hamburger mobile (drawer plein écran)
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── Header principal ─────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ paddingTop: '20px' }}>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pointer-events-auto h-14 w-full mx-4"
        style={{
          maxWidth: '1100px',
          background: 'var(--bg-header)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '999px',
          border: scrolled
            ? '1px solid var(--border-medium)'
            : '1px solid var(--border-subtle)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          transition: 'border-color 300ms ease',
        }}
        role="banner"
      >
        <div className="h-full flex items-center justify-between px-6 lg:px-8">

          {/* ── Logo ─────────────────────────────────────── */}
          <a
            href="/"
            className="flex items-center"
            aria-label="Kliv — Retour à l'accueil"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/picto-anthracite.png"
              alt="Kliv"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
          </a>

          {/* ── Nav desktop ──────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'var(--text-muted)',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── CTA + Theme toggle desktop ───────────────── */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <motion.a
              href="#contact"
              style={{
                fontFamily: 'var(--font-dm-var), sans-serif',
                fontSize: '13px',
                color: 'var(--text-primary)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                padding: '8px 20px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.02 } as never}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Parlons-en →
            </motion.a>
          </div>

          {/* ── Hamburger mobile ─────────────────────────── */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="flex items-center justify-center w-10 h-10 rounded-sm"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={20} style={{ color: 'var(--text-primary)' }} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>
      </div>

      {/* ── Menu mobile drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: 'var(--bg-surface)' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header drawer */}
            <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo1.png"
                alt="Kliv"
                style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              />
              <button
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="flex items-center justify-center w-10 h-10"
              >
                <X size={20} style={{ color: 'var(--text-primary)' }} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <nav
              className="flex flex-col gap-2 px-6 mt-8"
              aria-label="Navigation mobile"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="py-4"
                  style={{
                    fontFamily: 'var(--font-syne-var), sans-serif',
                    fontWeight: 700,
                    fontSize: '28px',
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* CTA mobile */}
            <div className="px-6 mt-8">
              <motion.a
                href="#contact"
                onClick={closeMenu}
                className="block text-center py-4 rounded-[4px] text-sm"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  color: 'var(--text-primary)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
              >
                Parlons-en →
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
