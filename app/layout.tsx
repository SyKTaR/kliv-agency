/**
 * layout.tsx — Layout global Kliv
 * Polices : Syne 800 (titres), DM Sans 300/400 (corps), Playfair Display italic (accents)
 * Métadonnées Next.js complètes pour SEO et partage social
 */
import type { Metadata } from 'next'
import { Syne, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ui/ThemeProvider'

// ─── Polices Google via next/font ──────────────────────────────────────────
const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne-var',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-var',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['italic'],
  variable: '--font-playfair-var',
  display: 'swap',
})

// ─── Métadonnées SEO & Open Graph ─────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Kliv — On construit, vous avancez.',
  description:
    "Kliv est une agence digitale française qui accompagne les PME et artisans dans la structuration de leur présence en ligne : sites web, CRM, automatisation et applications sur mesure.",
  keywords: ['agence web', 'site vitrine PME', 'artisan', 'CRM', 'automatisation', 'Next.js', 'Kliv', 'Paris'],
  authors: [{ name: 'Kliv', url: 'https://kliv.fr' }],
  creator: 'Kliv',
  metadataBase: new URL('https://kliv.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://kliv.fr',
    title: 'Kliv — On construit, vous avancez.',
    description: 'Agence digitale pour PME et artisans. Sites web, CRM, automatisation.',
    siteName: 'Kliv',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kliv — Agence digitale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kliv — On construit, vous avancez.',
    description: 'Agence digitale pour PME et artisans. Sites web, CRM, automatisation.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Layout Root ───────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${playfair.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
