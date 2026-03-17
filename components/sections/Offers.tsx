/**
 * Offers.tsx — Section 7 : Offres / tarifs
 * 3 cards formule avec prix Syne 800
 * Card centrale (Structuré) légèrement plus grande (scale 1.02)
 * Framer Motion : fade-up au scroll
 * Mobile : carousel 1 item à la fois avec flèches prev/next
 */

'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { OFFERS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { staggerContainer, fadeUpVariant, viewportOnce } from '@/lib/animations'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Offers() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollToIndex(index: number) {
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index] as HTMLElement
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActiveIndex(index)
  }

  return (
    <section
      id="offres"
      style={{ background: 'var(--bg-primary)' }}
      className="py-28 md:py-36"
      aria-labelledby="offers-title"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── En-tête section ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-4"
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
            07 — Nos formules
          </p>
          <h2
            id="offers-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(26px, 3vw, 38px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
          >
            Transparent.{' '}
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

        {/* Sous-titre */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16"
          style={{
            fontFamily: 'var(--font-dm-var), sans-serif',
            fontSize: '14px',
            fontWeight: 300,
            color: 'var(--text-muted)',
            maxWidth: '480px',
          }}
        >
          Chaque projet est unique — les tarifs ci-dessous sont indicatifs
          et établis sur devis.
        </motion.p>

        {/* ── Carousel mobile / Grille desktop ────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Piste de scroll */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-x-visible md:items-center"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            {OFFERS.map((offer) => (
              <motion.div
                key={offer.id}
                variants={fadeUpVariant}
                className="w-[calc(100vw-3rem)] flex-shrink-0 snap-center md:w-auto rounded-[6px] p-8 flex flex-col gap-6"
                style={{
                  background: offer.highlight ? 'var(--bg-surface)' : 'var(--bg-card)',
                  border: offer.highlight
                    ? '1px solid rgba(123,167,188,0.25)'
                    : '1px solid var(--border-subtle)',
                  transform: offer.highlight ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
              >
                {/* Badge + nom */}
                <div className="flex flex-col gap-2">
                  {offer.badge && (
                    <Badge variant="blue">{offer.badge}</Badge>
                  )}
                  <h3
                    style={{
                      fontFamily: 'var(--font-syne-var), sans-serif',
                      fontWeight: 800,
                      fontSize: '20px',
                      letterSpacing: '-0.03em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {offer.name}
                  </h3>
                </div>

                {/* Prix */}
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-var), sans-serif',
                      fontSize: '11px',
                      color: 'var(--text-faint)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    À partir de
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-syne-var), sans-serif',
                      fontWeight: 800,
                      fontSize: '36px',
                      letterSpacing: '-0.04em',
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                      marginTop: '2px',
                    }}
                  >
                    {offer.price}
                  </p>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-dm-var), sans-serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: '1.7',
                    color: 'var(--text-muted)',
                  }}
                >
                  {offer.desc}
                </p>

                {/* Séparateur */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3" role="list">
                  {offer.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: 'var(--font-dm-var), sans-serif',
                        fontSize: '13px',
                        fontWeight: 300,
                        color: 'var(--text-muted)',
                        lineHeight: '1.5',
                      }}
                    >
                      <Check
                        size={14}
                        color="#7BA7BC"
                        strokeWidth={2}
                        style={{ marginTop: '2px', flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={offer.highlight ? 'primary' : 'outline'}
                  href="#contact"
                  className="w-full justify-center"
                >
                  Obtenir un devis
                </Button>
              </motion.div>
            ))}
          </div>

          {/* ── Contrôles carousel (mobile uniquement) ──────────────── */}
          <div className="flex items-center justify-between mt-6 md:hidden">
            {/* Flèche précédent */}
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Formule précédente"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: activeIndex === 0 ? 'var(--text-faint)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'default' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>

            {/* Indicateurs dots */}
            <div className="flex gap-2">
              {OFFERS.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Formule ${i + 1}`}
                  style={{
                    width: i === activeIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === activeIndex ? 'var(--accent)' : 'var(--border-subtle)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'width 0.25s, background 0.25s',
                  }}
                />
              ))}
            </div>

            {/* Flèche suivant */}
            <button
              type="button"
              onClick={() => scrollToIndex(Math.min(OFFERS.length - 1, activeIndex + 1))}
              disabled={activeIndex === OFFERS.length - 1}
              aria-label="Formule suivante"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: activeIndex === OFFERS.length - 1 ? 'var(--text-faint)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === OFFERS.length - 1 ? 'default' : 'pointer',
                opacity: activeIndex === OFFERS.length - 1 ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
