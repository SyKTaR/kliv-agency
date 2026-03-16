/**
 * AnimatedText.tsx — Titre animé ligne par ligne avec Framer Motion
 * Chaque ligne est enveloppée dans overflow:hidden + translateY(100%)→0
 * Supporte le mélange Syne (sans-serif) + Playfair italic (signature Kliv)
 *
 * Usage :
 * <AnimatedText
 *   lines={[
 *     { text: 'On construit.', font: 'syne' },
 *     { text: 'Vous avancez.', font: 'playfair' },
 *   ]}
 *   className="text-5xl"
 * />
 */

'use client'

import { motion } from 'framer-motion'
import { heroContainer, heroLineVariant } from '@/lib/animations'

export type TextLine = {
  /** Texte de la ligne */
  text: string
  /** 'syne' = Syne 800 sans-serif | 'playfair' = Playfair italic serif */
  font: 'syne' | 'playfair'
}

interface AnimatedTextProps {
  lines: TextLine[]
  /** Classes Tailwind appliquées au wrapper global */
  className?: string
  /** Tag HTML du wrapper (h1 par défaut) */
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Délai avant que l'animation commence (ms) */
  delay?: number
}

export default function AnimatedText({
  lines,
  className = '',
  as: Tag = 'h1',
  delay = 0,
}: AnimatedTextProps) {

  const containerVariants = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: delay / 1000,
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'block' }}
      >
        {lines.map((line, i) => (
          /* wrapper overflow:hidden pour l'effet "rideau" */
          <span
            key={i}
            style={{ display: 'block', overflow: 'hidden', lineHeight: 1.1 }}
          >
            <motion.span
              variants={heroLineVariant}
              style={{
                display: 'block',
                fontFamily:
                  line.font === 'syne'
                    ? 'var(--font-syne-var), sans-serif'
                    : 'var(--font-playfair-var), serif',
                fontStyle:   line.font === 'playfair' ? 'italic' : 'normal',
                fontWeight:  line.font === 'syne'     ? 800       : 400,
                letterSpacing: line.font === 'syne'   ? '-0.04em' : '-0.01em',
              }}
            >
              {line.text}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
