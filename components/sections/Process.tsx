/**
 * Process.tsx — Section 5 : Notre processus
 * 4 étapes interactives : clic → mise en avant avec fond #111a11
 * Framer Motion : slide-in depuis la droite + transition douce entre étapes
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROCESS_STEPS } from '@/lib/constants'
import { slideRightVariant, fadeUpVariant, viewportOnce } from '@/lib/animations'

export default function Process() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      id="processus"
      style={{ background: 'var(--bg-primary)' }}
      className="py-28 md:py-36"
      aria-labelledby="process-title"
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
            05 — Comment ça marche
          </p>
          <h2
            id="process-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Simple.{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Toujours.
            </span>
          </h2>
        </motion.div>

        {/* ── Barre d'étapes ──────────────────────────────────────── */}
        <motion.div
          variants={slideRightVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-4 gap-2"
          role="tablist"
          aria-label="Étapes du processus"
        >
          {PROCESS_STEPS.map((step, i) => {
            const isActive = activeStep === i

            return (
              <motion.button
                key={step.num}
                role="tab"
                aria-selected={isActive}
                aria-controls={`step-panel-${i}`}
                id={`step-tab-${i}`}
                onClick={() => setActiveStep(i)}
                className="text-left p-6 rounded-[4px] cursor-pointer w-full"
                style={{
                  background: isActive
                    ? 'var(--bg-surface)'
                    : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
                  transition: 'background 300ms ease, border-color 300ms ease',
                }}
                whileHover={!isActive ? { opacity: 0.9 } : {}}
                transition={{ duration: 0.2 }}
              >
                {/* Numéro */}
                <p
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-syne-var), sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: isActive ? 'var(--accent)' : 'var(--text-ghost)',
                    letterSpacing: '0.1em',
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.num}
                </p>

                {/* Titre étape */}
                <p
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-syne-var), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    letterSpacing: '-0.02em',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.title}
                </p>

                {/* Description (visible seulement sur l'active en desktop) */}
                <motion.p
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    height: 'auto',
                  }}
                  style={{
                    fontFamily: 'var(--font-dm-var), sans-serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: '1.7',
                    color: 'var(--text-muted)',
                  }}
                  id={`step-panel-${i}`}
                  role="tabpanel"
                  aria-labelledby={`step-tab-${i}`}
                >
                  {step.desc}
                </motion.p>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
