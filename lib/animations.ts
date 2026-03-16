/**
 * animations.ts — Variants Framer Motion réutilisables
 * Utilisés sur toutes les sections (scroll, hover, chargement)
 */

import type { Variants } from 'framer-motion'

// ─── Fade + slide up (élément seul) ───────────────────────────────────────
export const fadeUpVariant: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// ─── Fade seul ────────────────────────────────────────────────────────────
export const fadeVariant: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7 },
  },
}

// ─── Slide depuis la droite ───────────────────────────────────────────────
export const slideRightVariant: Variants = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

// ─── Conteneur stagger (grilles, listes) ─────────────────────────────────
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// ─── Stagger plus rapide pour petits éléments ────────────────────────────
export const staggerFast: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// ─── Hero — ligne par ligne (overflow hidden + slide depuis bas) ──────────
export const heroLineVariant: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// ─── Conteneur hero (stagger 0.2s entre lignes) ──────────────────────────
export const heroContainer: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
}

// ─── Scale léger pour cards au hover ─────────────────────────────────────
export const cardHoverVariant = {
  rest:  { y: 0,  transition: { duration: 0.25, ease: 'easeOut' } },
  hover: { y: -6, transition: { duration: 0.25, ease: 'easeOut' } },
}

// ─── viewport commun (déclenche à 15% visible) ───────────────────────────
export const viewportOnce = { once: true, amount: 0.15 } as const
