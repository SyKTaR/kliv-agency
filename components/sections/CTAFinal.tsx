/**
 * CTAFinal.tsx — Section 10 : CTA final + formulaire de contact
 * Formulaire React Hook Form (3 champs) avec validation
 * Enregistre automatiquement les soumissions dans Supabase (table leads)
 * Framer Motion : fade-up au scroll
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { fadeUpVariant, staggerContainer, viewportOnce } from '@/lib/animations'
import { Send } from 'lucide-react'

interface ContactFormData {
  prenom: string
  email: string
  projet: string
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-input)',
  borderRadius: '4px',
  padding: '14px 16px',
  fontFamily: 'var(--font-dm-var), sans-serif',
  fontSize: '14px',
  fontWeight: 300,
  color: 'var(--text-primary)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-dm-var), sans-serif',
  fontSize: '12px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '8px',
}

export default function CTAFinal() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.prenom, email: data.email, message: data.projet }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erreur serveur')
      setSubmitted(true)
    } catch (err: unknown) {
      const e = err as { message?: string }
      console.error('Erreur envoi lead:', e?.message)
      setSubmitError("Une erreur est survenue. Réessayez ou contactez-nous directement.")
    }
  }

  return (
    <section
      id="contact"
      style={{ background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}
      className="py-28 md:py-36"
      aria-labelledby="cta-title"
    >
      {/* ── Watermark "K" ─────────────────────────────────────── */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-8vw',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-syne-var), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(200px, 35vw, 500px)',
          color: 'var(--text-primary)',
          opacity: 0.03,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}
      >
        K
      </span>

      <div className="max-w-2xl mx-auto px-6 lg:px-12 relative">

        {/* ── Titre H2 ────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12 text-center"
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
            10 — Démarrer
          </p>
          <h2
            id="cta-title"
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 48px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.0,
            }}
          >
            Un projet en tête ?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-syne-var), sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 48px)',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1.0,
              marginTop: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair-var), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              On s&apos;occupe du comment.
            </span>
          </p>
        </motion.div>

        {/* ── Formulaire ou confirmation ───────────────────────────── */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p
              style={{
                fontFamily: 'var(--font-syne-var), sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              Message envoyé ✓
            </p>
            <p style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '14px', color: 'var(--text-muted)' }}>
              On vous répond sous 48h.
            </p>
          </motion.div>
        ) : (
          <motion.form
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulaire de contact Kliv"
          >
            {/* ── Prénom ───────────────────────────────────────── */}
            <motion.div variants={fadeUpVariant} className="mb-4">
              <label htmlFor="prenom" style={labelStyle}>
                Prénom <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="prenom"
                type="text"
                autoComplete="given-name"
                placeholder="Votre prénom"
                aria-required="true"
                aria-invalid={!!errors.prenom}
                aria-describedby={errors.prenom ? 'prenom-error' : undefined}
                className="kliv-input"
                style={{
                  ...inputBase,
                  borderColor: errors.prenom ? 'var(--error-border)' : 'var(--border-input)',
                }}
                {...register('prenom', {
                  required: 'Votre prénom est requis',
                  minLength: { value: 2, message: 'Minimum 2 caractères' },
                })}
              />
              {errors.prenom && (
                <p id="prenom-error" role="alert" style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '12px', color: 'var(--error)', marginTop: '6px' }}>
                  {errors.prenom.message}
                </p>
              )}
            </motion.div>

            {/* ── Email ────────────────────────────────────────── */}
            <motion.div variants={fadeUpVariant} className="mb-4">
              <label htmlFor="email" style={labelStyle}>
                Email <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="votre@email.fr"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="kliv-input"
                style={{
                  ...inputBase,
                  borderColor: errors.email ? 'var(--error-border)' : 'var(--border-input)',
                }}
                {...register('email', {
                  required: 'Votre email est requis',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Adresse email invalide',
                  },
                })}
              />
              {errors.email && (
                <p id="email-error" role="alert" style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '12px', color: 'var(--error)', marginTop: '6px' }}>
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* ── Projet ───────────────────────────────────────── */}
            <motion.div variants={fadeUpVariant} className="mb-8">
              <label htmlFor="projet" style={labelStyle}>
                Votre projet <span aria-hidden="true" style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <textarea
                id="projet"
                rows={3}
                placeholder="Décrivez votre projet en quelques mots..."
                aria-required="true"
                aria-invalid={!!errors.projet}
                aria-describedby={errors.projet ? 'projet-error' : undefined}
                className="kliv-input"
                style={{
                  ...inputBase,
                  resize: 'vertical',
                  minHeight: '96px',
                  borderColor: errors.projet ? 'var(--error-border)' : 'var(--border-input)',
                }}
                {...register('projet', {
                  required: 'Décrivez votre projet',
                  minLength: { value: 10, message: 'Minimum 10 caractères' },
                })}
              />
              {errors.projet && (
                <p id="projet-error" role="alert" style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '12px', color: 'var(--error)', marginTop: '6px' }}>
                  {errors.projet.message}
                </p>
              )}
            </motion.div>

            {/* ── Erreur globale ─────────────────────────────── */}
            {submitError && (
              <p role="alert" className="mb-4 text-center" style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '13px', color: 'var(--error)' }}>
                {submitError}
              </p>
            )}

            {/* ── Submit ───────────────────────────────────────── */}
            <motion.div variants={fadeUpVariant}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-[4px]"
                style={{
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  border: 'none',
                  transition: 'opacity 200ms ease',
                }}
                aria-label="Envoyer ma demande de contact"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    Envoyer ma demande
                    <Send size={14} aria-hidden="true" />
                  </>
                )}
              </motion.button>

              <p className="text-center mt-4" style={{ fontFamily: 'var(--font-dm-var), sans-serif', fontSize: '12px', color: 'var(--text-ghost)' }}>
                Réponse garantie sous 48h. Aucun engagement.
              </p>
            </motion.div>
          </motion.form>
        )}
      </div>
    </section>
  )
}
