/**
 * FAQ.tsx — Section 9 : Questions fréquentes
 * Accordion : une seule réponse ouverte à la fois
 * Framer Motion : animation hauteur fluide + rotation icône + au scroll
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/constants'
import { fadeUpVariant, staggerContainer, viewportOnce } from '@/lib/animations'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section
      id="faq"
      style={{ background: 'var(--bg-primary)' }}
      className="py-28 md:py-36"
      aria-labelledby="faq-title"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">

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
            09 — Questions fréquentes
          </p>
          <h2
            id="faq-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Tout ce que vous{' '}
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              voulez savoir.
            </span>
          </h2>
        </motion.div>

        {/* ── Accordion ───────────────────────────────────────────── */}
        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i

            return (
              <motion.div
                key={i}
                variants={fadeUpVariant}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {/* Question (bouton accordion) */}
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                    style={{ cursor: 'pointer' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-var), sans-serif',
                        fontWeight: 400,
                        fontSize: '15px',
                        color: isOpen ? 'var(--text-primary)' : 'rgba(var(--text-rgb), 0.75)',
                        lineHeight: '1.5',
                        transition: 'color 250ms ease',
                        flex: 1,
                      }}
                    >
                      {item.q}
                    </span>

                    {/* Icône + / × */}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ flexShrink: 0, display: 'flex' }}
                      aria-hidden="true"
                    >
                      <Plus
                        size={18}
                        color={isOpen ? 'var(--accent)' : 'var(--text-faint)'}
                        strokeWidth={1.5}
                      />
                    </motion.span>
                  </button>
                </dt>

                {/* Réponse (animée) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-dm-var), sans-serif',
                          fontWeight: 300,
                          fontSize: '14px',
                          lineHeight: '1.75',
                          color: 'var(--text-muted)',
                          paddingBottom: '24px',
                          paddingRight: '40px',
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.dl>
      </div>
    </section>
  )
}
