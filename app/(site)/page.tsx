/**
 * page.tsx — Page d'accueil Kliv
 * Assemblage de toutes les sections dans l'ordre défini par les consignes
 * Chaque section est un composant autonome importé depuis /components/sections
 */

import Hero          from '@/components/sections/Hero'
import TrustBand     from '@/components/sections/TrustBand'
import ProblemTarget from '@/components/sections/ProblemTarget'
import Benefits      from '@/components/sections/Benefits'
import Process       from '@/components/sections/Process'
import Realizations  from '@/components/sections/Realizations'
import Offers        from '@/components/sections/Offers'
import Testimonials  from '@/components/sections/Testimonials'
import FAQ           from '@/components/sections/FAQ'
import CTAFinal      from '@/components/sections/CTAFinal'

export default function HomePage() {
  return (
    <>
      {/* 01 — Hero */}
      <Hero />

      {/* 02 — Bande de confiance / outils */}
      <TrustBand />

      {/* 03 — Problème & cible */}
      <ProblemTarget />

      {/* 04 — Bénéfices */}
      <Benefits />

      {/* 05 — Processus */}
      <Process />

      {/* 06 — Réalisations */}
      <Realizations />

      {/* 07 — Offres */}
      <Offers />

      {/* 08 — Témoignages */}
      <Testimonials />

      {/* 09 — FAQ */}
      <FAQ />

      {/* 10 — CTA final + formulaire */}
      <CTAFinal />
    </>
  )
}
