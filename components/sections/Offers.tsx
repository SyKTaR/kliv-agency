/**
 * Offers.tsx — Section 7 : Offres / tarifs
 * 3 cards formule avec prix Syne 800
 * Card centrale (Structuré) légèrement plus grande (scale 1.02)
 * Framer Motion : fade-up au scroll
 */

'use client'

import { motion } from 'framer-motion'
import { OFFERS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { staggerContainer, fadeUpVariant, viewportOnce } from '@/lib/animations'
import { Check } from 'lucide-react'

export default function Offers() {
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

        {/* ── Grille 3 cards formules ──────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
        >
          {OFFERS.map((offer) => (
            <motion.div
              key={offer.id}
              variants={fadeUpVariant}
              className="rounded-[6px] p-8 flex flex-col gap-6"
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
        </motion.div>
      </div>
    </section>
  )
}
