/**
 * Testimonials.tsx — Section 8 : Témoignages clients
 * Grille 2x2, initiales en cercle, étoiles en bleu, texte italic
 * Framer Motion : fade-in au scroll avec stagger 150ms
 */

'use client'

import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/constants'
import { staggerContainer, fadeUpVariant, viewportOnce } from '@/lib/animations'
import { Star } from 'lucide-react'

export default function Testimonials() {
  return (
    <section
      id="temoignages"
      style={{ background: 'var(--bg-surface)' }}
      className="py-28 md:py-36"
      aria-labelledby="testimonials-title"
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
            08 — Ils nous font confiance
          </p>
          <h2
            id="testimonials-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 52px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Ce qu'ils{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              en disent.
            </span>
          </h2>
        </motion.div>

        {/* ── Grille 2x2 témoignages ──────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.blockquote
              key={t.name}
              variants={fadeUpVariant}
              className="p-7 rounded-[6px] flex flex-col gap-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {/* Étoiles */}
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label={`${t.stars} étoiles sur 5`}
              >
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill="#7BA7BC"
                    color="#7BA7BC"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Témoignage */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '1.75',
                  color: 'rgba(var(--text-rgb), 0.8)',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Auteur */}
              <footer className="flex items-center gap-3">
                {/* Cercle initiales */}
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(var(--text-rgb), 0.08)',
                    border: '1px solid rgba(var(--text-rgb), 0.12)',
                  }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-syne-var), sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-var), sans-serif',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-var), sans-serif',
                      fontSize: '12px',
                      fontWeight: 300,
                      color: 'var(--text-faint)',
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
