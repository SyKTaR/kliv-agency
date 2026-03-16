/**
 * TrustBand.tsx — Section 2 : Bande de confiance / outils
 * Défilement horizontal infini (marquee) des technologies maîtrisées
 * Animation Framer Motion : x: 0% → -50% en boucle, pausée au hover
 */

'use client'

import { motion } from 'framer-motion'
import { TOOLS } from '@/lib/constants'

export default function TrustBand() {
  // Doubler les items pour un défilement sans à-coup
  const doubled = [...TOOLS, ...TOOLS]

  return (
    <section
      id="outils"
      style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}
      className="py-8"
      aria-label="Technologies et outils maîtrisés"
    >
      {/* ── Label centré ────────────────────────────────────────── */}
      <p
        className="text-center mb-6"
        style={{
          fontFamily: 'var(--font-dm-var), sans-serif',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-ghost)',
        }}
      >
        Technologies & outils maîtrisés
      </p>

      {/* ── Marquee ─────────────────────────────────────────────── */}
      <div
        className="marquee-wrapper"
        style={{ cursor: 'default' }}
        role="list"
        aria-label="Liste des outils"
      >
        <motion.div
          className="marquee-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {doubled.map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              role="listitem"
              className="inline-flex items-center"
            >
              <span
                style={{
                  fontFamily: 'var(--font-syne-var), sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--text-ghost)',
                  whiteSpace: 'nowrap',
                  padding: '0 20px',
                }}
              >
                {tool}
              </span>
              {/* Séparateur bleu · */}
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--accent)',
                  fontSize: '16px',
                  opacity: 0.6,
                }}
              >
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
