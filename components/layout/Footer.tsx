/**
 * Footer.tsx — Pied de page Kliv
 * 3 colonnes : logo+baseline / liens / contact
 */

import { NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-footer)',
        borderTop: '1px solid var(--border-subtle)',
      }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* ── Col 1 — Logo + baseline ──────────────────────── */}
          <div className="flex flex-col gap-3">
            <a
              href="/"
              aria-label="Kliv — Retour à l'accueil"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo1.png"
                alt="Kliv"
                style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              />
            </a>
            <p
              style={{
                fontFamily: 'var(--font-dm-var), sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-ghost)',
              }}
            >
              On construit, vous avancez.
            </p>
          </div>

          {/* ── Col 2 — Liens de navigation ──────────────────── */}
          <nav aria-label="Navigation footer">
            <ul className="flex flex-col gap-3">
              {[...NAV_LINKS, { label: 'Contact', href: '#contact' }].map(
                (link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-opacity hover:opacity-100"
                      style={{
                        fontFamily: 'var(--font-dm-var), sans-serif',
                        fontSize: '13px',
                        color: 'var(--text-faint)',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* ── Col 3 — Contact ──────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:hello@kliv.fr"
              className="transition-opacity hover:opacity-100"
              style={{
                fontFamily: 'var(--font-dm-var), sans-serif',
                fontSize: '13px',
                color: 'var(--text-faint)',
              }}
            >
              hello@kliv.fr
            </a>
            <p
              style={{
                fontFamily: 'var(--font-dm-var), sans-serif',
                fontSize: '13px',
                color: 'var(--text-faint)',
              }}
            >
              Paris, France
            </p>
          </div>
        </div>

        {/* ── Copyright ────────────────────────────────────────── */}
        <div
          className="mt-12 pt-6 text-center"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-var), sans-serif',
              fontSize: '12px',
              color: 'var(--text-ultra-faint)',
            }}
          >
            © 2025 Kliv — Tous droits réservés
            <a
              href="/admin"
              rel="nofollow noindex"
              tabIndex={-1}
              style={{
                color: 'rgba(245,240,230,0.15)',
                textDecoration: 'none',
                marginLeft: '0.4em',
                pointerEvents: 'auto',
              }}
            >·</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
