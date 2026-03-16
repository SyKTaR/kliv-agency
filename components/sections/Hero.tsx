/**
 * Hero.tsx — Section 1 : Hero Kliv
 * - Titre H1 animé ligne par ligne (Syne + Playfair italic)
 * - Sous-titre, 2 CTA, bande de stats
 * - Watermark "K" géant en opacity 2%
 * - Framer Motion : stagger au chargement (0ms → 1000ms)
 */

'use client'

import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/AnimatedText'
import Button from '@/components/ui/Button'
import { HERO_STATS } from '@/lib/constants'
import { fadeVariant, staggerContainer, fadeUpVariant } from '@/lib/animations'

export default function Hero() {
  return (
    <section
      id="hero"
      style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}
      className="min-h-screen flex flex-col justify-center pt-16"
      aria-label="Section hero — Kliv agence digitale"
    >
      {/* ── Watermark picto ─────────────────────────────────────── */}
      <img
        src="/picto-anthracite.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(200px, 35vw, 500px)',
          opacity: 0.04,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 md:py-32">

        {/* ── Label section ─────────────────────────────────────── */}
        <motion.p
          variants={fadeVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0 }}
          style={{
            fontFamily: 'var(--font-dm-var), sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
            marginBottom: '32px',
          }}
        >
          — Agence digitale
        </motion.p>

        {/* ── Titre H1 animé ────────────────────────────────────── */}
        <div
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 1.0,
            color: 'var(--text-primary)',
            maxWidth: '700px',
            marginBottom: '32px',
          }}
        >
          <AnimatedText
            lines={[
              { text: 'On construit.', font: 'syne' },
              { text: 'Vous avancez.', font: 'playfair' },
            ]}
            as="h1"
            delay={100}
          />
        </div>

        {/* ── Sous-titre ────────────────────────────────────────── */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: 'var(--font-dm-var), sans-serif',
            fontWeight: 300,
            fontSize: '17px',
            lineHeight: '1.75',
            color: 'var(--text-muted)',
            maxWidth: '460px',
            marginBottom: '40px',
          }}
        >
          Sites web, CRM, automatisation. On prend toute la complexité en charge
          pour que vous restiez concentré sur votre métier.
        </motion.p>

        {/* ── CTAs ──────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.8, staggerChildren: 0.15 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <motion.div variants={fadeUpVariant}>
            <Button variant="primary" href="#contact">
              Démarrer un projet
            </Button>
          </motion.div>
          <motion.div variants={fadeUpVariant}>
            <Button variant="ghost" href="#benefices">
              Voir nos services →
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Bande de stats ────────────────────────────────────── */}
        <motion.div
          variants={fadeVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0, duration: 0.7 }}
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '28px',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 justify-center">
            {HERO_STATS.map((stat) => (
              <div key={stat.value} className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-syne-var), sans-serif',
                    fontWeight: 800,
                    fontSize: '28px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-var), sans-serif',
                    fontSize: '11px',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-ghost)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
