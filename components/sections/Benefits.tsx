/**
 * Benefits.tsx — Section 4 : Bénéfices Kliv (pourquoi nous)
 * Grille 3x2 avec séparateurs horizontaux/verticaux
 * Framer Motion : fade-in au scroll avec stagger 100ms
 */

'use client'

import { motion } from 'framer-motion'
import { BENEFITS } from '@/lib/constants'
import { staggerFast, fadeUpVariant, viewportOnce } from '@/lib/animations'

export default function Benefits() {
  return (
    <section
      id="benefices"
      style={{ background: 'var(--bg-surface)' }}
      className="py-28 md:py-36"
      aria-labelledby="benefits-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── En-tête section ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 max-w-xl"
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
            04 — Pourquoi Kliv ?
          </p>
          <h2
            id="benefits-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Ce qui nous{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              différencie.
            </span>
          </h2>
        </motion.div>

        {/* ── Grille 3x2 avec séparateurs ─────────────────────────── */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.num}
              variants={fadeUpVariant}
              className="p-8 flex flex-col gap-3"
              style={{
                borderRight:
                  (i + 1) % 3 !== 0
                    ? '1px solid var(--border-subtle)'
                    : 'none',
                borderBottom:
                  i < 3
                    ? '1px solid var(--border-subtle)'
                    : 'none',
              }}
            >
              {/* Numéro en bleu */}
              <span
                style={{
                  fontFamily: 'var(--font-syne-var), sans-serif',
                  fontWeight: 700,
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.1em',
                }}
              >
                {benefit.num}
              </span>
              {/* Titre bénéfice */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}
              >
                {benefit.title}
              </p>
              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontWeight: 300,
                  fontSize: '13px',
                  lineHeight: '1.7',
                  color: 'var(--text-muted)',
                }}
              >
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
