/**
 * ProblemTarget.tsx — Section 3 : Problème & cible
 * 3 cards : Artisan, PME, Lancement
 * Framer Motion : stagger au scroll, chaque card monte depuis +40px
 */

'use client'

import { motion } from 'framer-motion'
import { TARGETS } from '@/lib/constants'
import { staggerContainer, fadeUpVariant, viewportOnce } from '@/lib/animations'

export default function ProblemTarget() {
  return (
    <section
      id="pour-qui"
      style={{ background: 'var(--bg-primary)' }}
      className="py-28 md:py-36"
      aria-labelledby="target-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── En-tête section ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16"
        >
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--font-dm-var), sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            03 — Pour qui ?
          </p>
          <h2
            id="target-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Vous vous{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              reconnaissez ?
            </span>
          </h2>
        </motion.div>

        {/* ── Grille 3 cards ──────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {TARGETS.map((target) => (
            <motion.div
              key={target.id}
              variants={fadeUpVariant}
              className="rounded-[6px] p-9 flex flex-col gap-4"
              style={{
                background: target.bg === 'rgba(255,255,255,0.03)' ? 'var(--bg-card)' : target.bg,
                border: target.bg === 'rgba(255,255,255,0.03)'
                  ? '1px solid var(--border-subtle)'
                  : 'none',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-syne-var), sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  letterSpacing: '-0.02em',
                  color: target.bg === 'rgba(255,255,255,0.03)' ? 'var(--text-primary)' : target.textColor,
                  lineHeight: 1.2,
                }}
              >
                {target.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '1.7',
                  color: target.bg === 'rgba(255,255,255,0.03)'
                    ? 'var(--text-muted)'
                    : target.textColor === '#F5F0E4'
                    ? 'rgba(245,240,228,0.6)'
                    : 'rgba(10,15,10,0.65)',
                }}
              >
                {target.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
