/**
 * useScrollAnimation.ts — Hook Intersection Observer custom
 * Déclenche une classe CSS "visible" quand l'élément entre dans le viewport
 * Utilisé en complément de Framer Motion pour les cas sans variant
 */

'use client'

import { useEffect, useRef } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

/**
 * Retourne une ref à attacher à l'élément cible.
 * Ajoute la classe "visible" quand l'élément devient visible (once).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px' } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // once = true
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}

/**
 * useScrollAnimationMultiple — Version pour plusieurs enfants
 * Passe en revue tous les enfants avec [data-animate] et les anime en stagger
 */
export function useScrollAnimationMultiple(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1 } = options
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = Array.from(
      container.querySelectorAll('[data-animate]')
    ) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  return containerRef
}
