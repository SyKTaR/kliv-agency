/**
 * Realizations.tsx — Section 6 : Réalisations
 * 3 cards projets avec numéros géants en watermark
 * Framer Motion : hover translateY(-6px) + stagger au scroll
 */

'use client'

import { motion } from 'framer-motion'
import { REALIZATIONS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import { staggerContainer, fadeUpVariant, viewportOnce } from '@/lib/animations'

export default function Realizations() {
  return (
    <section
      id="realisations"
      style={{ background: 'var(--bg-surface)' }}
      className="py-28 md:py-36"
      aria-labelledby="realizations-title"
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
            06 — Nos réalisations
          </p>
          <h2
            id="realizations-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Ce qu'on a{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              construit.
            </span>
          </h2>
        </motion.div>

        {/* ── Grille 3 cards projets ──────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {REALIZATIONS.map((project) => (
            <motion.article
              key={project.num}
              variants={fadeUpVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-[6px] p-9 flex flex-col gap-5 relative overflow-hidden"
              style={{
                background: project.bg,
                cursor: 'default',
              }}
            >
              {/* Numéro watermark */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '16px',
                  fontFamily: 'var(--font-syne-var), sans-serif',
                  fontWeight: 800,
                  fontSize: '90px',
                  letterSpacing: '-0.05em',
                  color: project.textColor,
                  opacity: 0.08,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {project.num}
              </span>

              {/* Tag */}
              <Badge variant="dark">{project.tag}</Badge>

              {/* Titre projet */}
              <h3
                style={{
                  fontFamily: 'var(--font-syne-var), sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  letterSpacing: '-0.03em',
                  color: project.textColor,
                  lineHeight: 1.2,
                  position: 'relative',
                }}
              >
                {project.title}
              </h3>

              {/* Résultat en italic */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: project.textColor,
                  opacity: 0.75,
                  position: 'relative',
                }}
              >
                {project.result}
              </p>

              {/* Stack technique */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: project.textColor,
                  opacity: 0.45,
                  position: 'relative',
                }}
              >
                {project.stack}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
