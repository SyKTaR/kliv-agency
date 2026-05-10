# KLIV AGENCY — PRODUCTION & DESIGN BRIEF
> Document de référence pour la conception et le développement du site web de Kliv Agency.  
> Version : 1.0 — Mai 2026

---

## 1. IDENTITÉ & POSITIONNEMENT

### Qui est Kliv Agency ?

**Kliv Agency** est une agence web premium qui conçoit et développe :
- Sites web sur-mesure (vitrine, e-commerce, SaaS)
- Outils internes métier (CRM, ERP, dashboards)
- Automatisations de processus internes
- Branding & identité de marque

**Positionnement** : Partenaire stratégique et technique pour des entreprises ambitieuses. Kliv ne vend pas de templates — elle construit des systèmes pensés pour durer.

**Ton de communication** : Confiant, direct, expert. Peu de mots, beaucoup d'impact. Pas de jargon inutile.

---

## 2. DESIGN SYSTEM

### 2.1 Palette de couleurs

```css
:root {
  /* Backgrounds */
  --color-bg-primary:      #FFFFFF;       /* Blanc pur — fond principal */
  --color-bg-secondary:    #F5F5F3;       /* Blanc cassé — sections alternées */
  --color-bg-dark:         #111110;       /* Noir profond — sections hero / footer */
  --color-bg-card:         #FAFAFA;       /* Blanc carte */

  /* Textes */
  --color-text-primary:    #0E0E0D;       /* Noir anthracite — titres */
  --color-text-secondary:  #3D3D3A;       /* Gris foncé — corps de texte */
  --color-text-muted:      #888884;       /* Gris moyen — labels, captions */
  --color-text-inverse:    #F5F5F3;       /* Texte clair sur fond sombre */

  /* Bordures */
  --color-border:          #E4E4E0;       /* Séparateurs subtils */
  --color-border-strong:   #C8C8C2;       /* Bordures de cartes */

  /* Accents (utilisés avec parcimonie) */
  --color-accent:          #0E0E0D;       /* Noir — CTA principaux */
  --color-accent-hover:    #2A2A28;       /* Noir légèrement adouci au hover */
}
```

**Règle d'or** : 90% blanc/gris, 10% noir anthracite fort. Aucune couleur vive. L'impact vient de la typographie, de l'espace et du mouvement.

---

### 2.2 Typographie

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  /* Display — titres hero, sections impactantes */
  --font-display: 'Fraunces', Georgia, serif;

  /* Body — tout le texte courant */
  --font-body: 'DM Sans', sans-serif;

  /* Échelle typographique */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  2rem;      /* 32px */
  --text-4xl:  2.75rem;   /* 44px */
  --text-5xl:  3.75rem;   /* 60px */
  --text-6xl:  5rem;      /* 80px */
  --text-hero: clamp(3.5rem, 8vw, 7rem); /* Fluide */

  /* Line heights */
  --leading-tight:  1.1;
  --leading-snug:   1.3;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  /* Letter spacing */
  --tracking-tight:  -0.03em;
  --tracking-normal:  0em;
  --tracking-wide:    0.08em;
  --tracking-wider:   0.15em;
}
```

**Usage** :
- Titres H1/H2 : `Fraunces` weight 300–400 — élégance editoriale
- Corps / navigation / boutons : `DM Sans` weight 300–500
- Labels uppercase : `DM Sans` weight 500 + `letter-spacing: 0.12em`

---

### 2.3 Espacement & Layout

```css
:root {
  /* Espacement (système 8pt) */
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* Container */
  --container-max: 1200px;
  --container-pad: clamp(1.25rem, 5vw, 4rem);

  /* Section padding */
  --section-pad-y: clamp(5rem, 10vw, 9rem);

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 999px;
}
```

---

### 2.4 Effets & Shadows

```css
:root {
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.12);

  /* Effets de verre (sections sombres) */
  --glass-bg:     rgba(255,255,255,0.04);
  --glass-border: rgba(255,255,255,0.08);

  /* Transitions */
  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:    cubic-bezier(0.7, 0, 0.84, 0);
  --ease-inout: cubic-bezier(0.87, 0, 0.13, 1);
  --duration-fast:   150ms;
  --duration-base:   300ms;
  --duration-slow:   600ms;
  --duration-xslow:  1000ms;
}
```

---

## 3. STRUCTURE DU SITE

### Architecture des pages

```
/                  → Landing page principale
/services          → Détail des services
/realisations      → Portfolio / Études de cas
/agence            → À propos
/contact           → Contact
/mentions-legales  → Légal
```

---

### 3.1 Landing Page — Structure des sections

```
[01] NAVBAR
[02] HERO
[03] MARQUEE CLIENTS / LOGOS
[04] SERVICES
[05] POURQUOI KLIV (différenciateur)
[06] RÉALISATIONS — SÉLECTION
[07] PROCESSUS DE TRAVAIL
[08] TÉMOIGNAGES
[09] CTA FINAL
[10] FOOTER
```

---

## 4. SECTIONS — DÉTAIL & CODE

### [01] NAVBAR

**Comportement** :
- Transparente au top, fond blanc avec `backdrop-filter: blur(20px)` au scroll
- Logo gauche, liens centre, CTA droit
- Sur mobile : hamburger → menu plein écran avec animation slide

```html
<nav class="navbar" id="navbar">
  <div class="navbar__inner container">

    <a href="/" class="navbar__logo" aria-label="Kliv Agency">
      <span class="logo-text">Kliv</span>
      <span class="logo-dot">.</span>
    </a>

    <ul class="navbar__links" role="list">
      <li><a href="/services">Services</a></li>
      <li><a href="/realisations">Réalisations</a></li>
      <li><a href="/agence">Agence</a></li>
    </ul>

    <div class="navbar__actions">
      <a href="/contact" class="btn btn--primary btn--sm">Démarrer un projet</a>
    </div>

    <button class="navbar__toggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span>
    </button>

  </div>
</nav>
```

```css
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: var(--space-4) 0;
  transition: background var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}
.navbar.scrolled {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-sm);
}
.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}
.logo-dot { color: var(--color-text-primary); }
.navbar__links {
  display: flex;
  gap: var(--space-8);
  list-style: none;
  margin: 0; padding: 0;
}
.navbar__links a {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast);
}
.navbar__links a:hover { color: var(--color-text-primary); }
```

---

### [02] HERO

**Concept** : Grande typographie editoriale, mouvement de parallaxe subtil, texte qui se révèle ligne par ligne au chargement.

```html
<section class="hero">
  <div class="hero__bg-grid" aria-hidden="true"></div>

  <div class="container hero__content">
    <div class="hero__label animate-reveal">
      <span>Agence Web & Digitale</span>
    </div>

    <h1 class="hero__title">
      <span class="hero__line animate-reveal" data-delay="0">On conçoit</span>
      <span class="hero__line hero__line--italic animate-reveal" data-delay="1">des expériences</span>
      <span class="hero__line animate-reveal" data-delay="2">qui convertissent.</span>
    </h1>

    <p class="hero__sub animate-reveal" data-delay="3">
      Sites web, outils métier, automatisations, branding.<br>
      Du design à la mise en production — Kliv s'occupe de tout.
    </p>

    <div class="hero__actions animate-reveal" data-delay="4">
      <a href="/contact" class="btn btn--primary btn--lg">
        Démarrer un projet
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </a>
      <a href="/realisations" class="btn btn--ghost btn--lg">Voir nos réalisations</a>
    </div>
  </div>

  <div class="hero__scroll-hint animate-reveal" data-delay="5" aria-hidden="true">
    <span class="hero__scroll-line"></span>
    <span>Défiler</span>
  </div>
</section>
```

```css
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--space-32) + 4rem) 0 var(--space-24);
  position: relative;
  overflow: hidden;
}

/* Grille décorative en fond */
.hero__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.4;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
}

.hero__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.hero__label::before {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: var(--color-text-muted);
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 300;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
}
.hero__line--italic { font-style: italic; color: var(--color-text-secondary); }

.hero__sub {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 300;
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin-bottom: var(--space-10);
}

.hero__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

/* Scroll hint */
.hero__scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  left: var(--container-pad);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--color-text-muted));
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50%       { opacity: 1;   transform: scaleY(1); }
}
```

---

### [03] MARQUEE CLIENTS

```html
<section class="marquee-section">
  <p class="marquee-section__label">Ils nous font confiance</p>
  <div class="marquee">
    <div class="marquee__track">
      <!-- Répéter 2x pour boucle infinie -->
      <span>Studio Aurore</span>
      <span>Nexlink</span>
      <span>Forma Pro</span>
      <span>Axiom Labs</span>
      <span>Renov & Co</span>
      <span>Belvida</span>
      <!-- ... dupliquer ... -->
    </div>
  </div>
</section>
```

```css
.marquee-section {
  padding: var(--space-12) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}
.marquee-section__label {
  text-align: center;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
}
.marquee { overflow: hidden; }
.marquee__track {
  display: flex;
  gap: var(--space-16);
  animation: marqueeScroll 20s linear infinite;
  width: max-content;
}
.marquee__track span {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: color var(--duration-base);
}
.marquee__track span:hover { color: var(--color-text-primary); }
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

---

### [04] SERVICES

**Concept** : Grid de cartes. Au hover, la carte s'élève légèrement et un texte détaillé apparaît. Sur mobile, stack vertical.

```html
<section class="services section">
  <div class="container">

    <div class="section-header">
      <span class="section-label">Ce qu'on fait</span>
      <h2 class="section-title">Des solutions pensées<br><em>pour votre croissance</em></h2>
    </div>

    <div class="services__grid">

      <article class="service-card" data-index="01">
        <div class="service-card__number">01</div>
        <div class="service-card__icon">
          <!-- SVG icône site web -->
        </div>
        <h3 class="service-card__title">Sites Web</h3>
        <p class="service-card__desc">
          Vitrines, e-commerces, SaaS. Des interfaces performantes,
          optimisées SEO et converties pour vos visiteurs.
        </p>
        <a href="/services#web" class="service-card__link">
          En savoir plus
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </a>
      </article>

      <article class="service-card" data-index="02">
        <div class="service-card__number">02</div>
        <h3 class="service-card__title">Outils Internes</h3>
        <p class="service-card__desc">
          CRM, ERP, dashboards sur-mesure. On remplace vos Excel
          par des outils pensés pour vos équipes.
        </p>
        <a href="/services#tools" class="service-card__link">En savoir plus →</a>
      </article>

      <article class="service-card" data-index="03">
        <h3 class="service-card__title">Automatisations</h3>
        <p class="service-card__desc">
          Connectez vos outils, éliminez les tâches répétitives.
          On automatise vos processus de A à Z.
        </p>
        <a href="/services#automation" class="service-card__link">En savoir plus →</a>
      </article>

      <article class="service-card" data-index="04">
        <h3 class="service-card__title">Branding</h3>
        <p class="service-card__desc">
          Identité visuelle, logo, charte graphique. Une marque
          cohérente qui inspire confiance dès le premier regard.
        </p>
        <a href="/services#branding" class="service-card__link">En savoir plus →</a>
      </article>

    </div>
  </div>
</section>
```

```css
.services__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.service-card {
  background: var(--color-bg-primary);
  padding: var(--space-10) var(--space-8);
  position: relative;
  transition: background var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
  cursor: default;
}
.service-card:hover {
  background: var(--color-bg-dark);
  z-index: 1;
}
.service-card:hover .service-card__title,
.service-card:hover .service-card__desc,
.service-card:hover .service-card__number {
  color: var(--color-text-inverse);
}
.service-card:hover .service-card__link {
  color: var(--color-text-inverse);
  opacity: 1;
}

.service-card__number {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 300;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
  transition: color var(--duration-base);
}
.service-card__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  transition: color var(--duration-base);
}
.service-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 300;
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  transition: color var(--duration-base);
}
.service-card__link {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  opacity: 0.7;
  transition: all var(--duration-base);
}

@media (max-width: 640px) {
  .services__grid { grid-template-columns: 1fr; }
}
```

---

### [05] POURQUOI KLIV

**Concept** : Section sombre (bg anthracite), texte blanc, stats animées au scroll.

```html
<section class="why-kliv section">
  <div class="container">

    <div class="why-kliv__header">
      <span class="section-label section-label--light">Notre approche</span>
      <h2 class="why-kliv__title">
        Pas une agence de plus.<br>
        <em>Votre partenaire technique.</em>
      </h2>
    </div>

    <div class="why-kliv__stats">
      <div class="stat">
        <span class="stat__number" data-count="48">0</span>
        <span class="stat__unit">h</span>
        <p class="stat__label">Délai moyen de réponse et brief projet</p>
      </div>
      <div class="stat">
        <span class="stat__number" data-count="30">0</span>
        <span class="stat__unit">+</span>
        <p class="stat__label">Projets livrés en 2024–2025</p>
      </div>
      <div class="stat">
        <span class="stat__number" data-count="100">0</span>
        <span class="stat__unit">%</span>
        <p class="stat__label">Sur-mesure — zéro template</p>
      </div>
    </div>

    <div class="why-kliv__points">
      <div class="point">
        <div class="point__icon">→</div>
        <div>
          <h4>On pense business avant tout</h4>
          <p>Chaque décision design ou tech est prise en fonction de vos objectifs métier, pas de nos préférences esthétiques.</p>
        </div>
      </div>
      <div class="point">
        <div class="point__icon">→</div>
        <div>
          <h4>Une équipe, pas une agence anonyme</h4>
          <p>Vous parlez directement aux personnes qui conçoivent et développent. Pas de chef de projet inutile entre vous et la production.</p>
        </div>
      </div>
      <div class="point">
        <div class="point__icon">→</div>
        <div>
          <h4>On livre — vraiment</h4>
          <p>Délais tenus. Code propre. Documentation incluse. On vous laisse un actif, pas une dépendance.</p>
        </div>
      </div>
    </div>

  </div>
</section>
```

```css
.why-kliv {
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
}
.why-kliv__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 300;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-inverse);
  margin-bottom: var(--space-16);
}
.why-kliv__title em {
  font-style: italic;
  color: rgba(255,255,255,0.5);
}
.why-kliv__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  padding: var(--space-12) 0;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: var(--space-16);
}
.stat__number {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 300;
  line-height: 1;
  color: #fff;
}
.stat__unit {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
}
.stat__label {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.5);
  margin-top: var(--space-2);
  max-width: 180px;
}
.why-kliv__points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}
.point {
  display: flex;
  gap: var(--space-4);
}
.point__icon {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.3);
  flex-shrink: 0;
  margin-top: 2px;
}
.point h4 {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 500;
  color: #fff;
  margin-bottom: var(--space-2);
}
.point p {
  font-size: var(--text-sm);
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  line-height: var(--leading-normal);
}
@media (max-width: 768px) {
  .why-kliv__stats,
  .why-kliv__points { grid-template-columns: 1fr; }
}
```

---

### [06] RÉALISATIONS — SÉLECTION

```html
<section class="work section">
  <div class="container">
    <div class="section-header section-header--split">
      <div>
        <span class="section-label">Portfolio</span>
        <h2 class="section-title">Projets récents</h2>
      </div>
      <a href="/realisations" class="btn btn--outline">Voir tout le portfolio →</a>
    </div>

    <div class="work__list">

      <article class="work-item">
        <a href="/realisations/projet-1" class="work-item__link">
          <div class="work-item__media">
            <img src="/assets/projects/project-1.webp" alt="Nexlink — Site web SaaS" loading="lazy" />
            <div class="work-item__overlay">
              <span>Voir le projet →</span>
            </div>
          </div>
          <div class="work-item__info">
            <div class="work-item__tags">
              <span>Site Web</span>
              <span>SaaS</span>
            </div>
            <h3 class="work-item__title">Nexlink</h3>
            <p class="work-item__year">2025</p>
          </div>
        </a>
      </article>

      <!-- Répéter pour 3–4 projets -->

    </div>
  </div>
</section>
```

```css
.work__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}
.work-item__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
}
.work-item__media img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}
.work-item:hover .work-item__media img {
  transform: scale(1.04);
}
.work-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(14,14,13,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-out);
  font-family: var(--font-body);
  font-weight: 500;
  color: #fff;
  font-size: var(--text-base);
}
.work-item:hover .work-item__overlay { opacity: 1; }
.work-item__info {
  padding: var(--space-4) 0 var(--space-2);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
}
.work-item__tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.work-item__tags span {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
}
.work-item__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}
.work-item__year {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
@media (max-width: 640px) {
  .work__list { grid-template-columns: 1fr; }
}
```

---

### [07] PROCESSUS DE TRAVAIL

```html
<section class="process section">
  <div class="container">
    <span class="section-label">Comment on travaille</span>
    <h2 class="section-title">4 étapes, 0 surprise</h2>

    <ol class="process__steps">
      <li class="process-step">
        <div class="process-step__num">01</div>
        <div class="process-step__content">
          <h3>Brief & Discovery</h3>
          <p>On comprend votre business, vos objectifs, vos contraintes. Un atelier de 1h qui pose les bases solides du projet.</p>
        </div>
      </li>
      <li class="process-step">
        <div class="process-step__num">02</div>
        <div class="process-step__content">
          <h3>Design & Prototypage</h3>
          <p>Maquettes Figma, wireframes interactifs. Vous validez chaque étape avant qu'une ligne de code ne soit écrite.</p>
        </div>
      </li>
      <li class="process-step">
        <div class="process-step__num">03</div>
        <div class="process-step__content">
          <h3>Développement</h3>
          <p>Code propre, documenté et scalable. Sprints de 2 semaines avec accès à un board de suivi en temps réel.</p>
        </div>
      </li>
      <li class="process-step">
        <div class="process-step__num">04</div>
        <div class="process-step__content">
          <h3>Livraison & Suivi</h3>
          <p>Mise en production, formation si besoin, support post-lancement. On ne disparaît pas après livraison.</p>
        </div>
      </li>
    </ol>
  </div>
</section>
```

```css
.process__steps {
  list-style: none;
  padding: 0;
  margin: var(--space-12) 0 0;
  counter-reset: steps;
}
.process-step {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: var(--space-6);
  padding: var(--space-8) 0;
  border-top: 1px solid var(--color-border);
  transition: background var(--duration-base);
}
.process-step:last-child { border-bottom: 1px solid var(--color-border); }
.process-step__num {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 300;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  padding-top: 4px;
}
.process-step__content h3 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}
.process-step__content p {
  font-size: var(--text-base);
  font-weight: 300;
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
  max-width: 600px;
}
```

---

### [08] TÉMOIGNAGES

```html
<section class="testimonials section">
  <div class="container">
    <span class="section-label">Ce qu'ils disent</span>
    <h2 class="section-title">Nos clients parlent<br>mieux que nous</h2>

    <div class="testimonials__grid">

      <blockquote class="testimonial">
        <p class="testimonial__quote">
          "Kliv a transformé notre CRM interne en 6 semaines. Ce que nos équipes IT estimaient à 6 mois de travail, livré proprement et dans les délais."
        </p>
        <footer class="testimonial__author">
          <div class="testimonial__avatar"></div>
          <div>
            <cite class="testimonial__name">Marc Lefèvre</cite>
            <span class="testimonial__role">COO — Nexlink</span>
          </div>
        </footer>
      </blockquote>

      <blockquote class="testimonial">
        <p class="testimonial__quote">
          "Le site web qu'on avait avant était correct. Celui de Kliv convertit 3x plus. L'attention au détail UX est vraiment remarquable."
        </p>
        <footer class="testimonial__author">
          <div class="testimonial__avatar"></div>
          <div>
            <cite class="testimonial__name">Sophie Durand</cite>
            <span class="testimonial__role">Fondatrice — Studio Aurore</span>
          </div>
        </footer>
      </blockquote>

    </div>
  </div>
</section>
```

```css
.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  margin-top: var(--space-12);
}
.testimonial {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin: 0;
  transition: box-shadow var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}
.testimonial:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
.testimonial__quote {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 300;
  line-height: var(--leading-snug);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  font-style: italic;
}
.testimonial__author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.testimonial__avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--color-border-strong);
  flex-shrink: 0;
}
.testimonial__name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  font-style: normal;
  display: block;
}
.testimonial__role {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
@media (max-width: 640px) {
  .testimonials__grid { grid-template-columns: 1fr; }
}
```

---

### [09] CTA FINAL

```html
<section class="cta-final section">
  <div class="container">
    <div class="cta-final__inner">
      <span class="section-label section-label--light">Prêt à démarrer ?</span>
      <h2 class="cta-final__title">
        Parlons de votre<br>prochain projet.
      </h2>
      <p class="cta-final__sub">
        Un brief, un appel de 30 min, et on vous dit ce qu'on peut faire — sans engagement.
      </p>
      <a href="/contact" class="btn btn--inverse btn--lg">
        Prendre contact
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

```css
.cta-final {
  background: var(--color-bg-dark);
}
.cta-final__inner {
  text-align: center;
  padding: var(--space-24) var(--container-pad);
  max-width: 700px;
  margin: 0 auto;
}
.cta-final__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 300;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: #fff;
  margin-bottom: var(--space-6);
}
.cta-final__sub {
  font-size: var(--text-lg);
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  margin-bottom: var(--space-10);
  line-height: var(--leading-normal);
}
```

---

### [10] FOOTER

```html
<footer class="footer">
  <div class="container footer__inner">

    <div class="footer__brand">
      <a href="/" class="footer__logo">Kliv<span>.</span></a>
      <p>Agence Web & Digitale.<br>Bordeaux — Paris — Remote</p>
    </div>

    <nav class="footer__nav">
      <div class="footer__col">
        <h4>Services</h4>
        <ul>
          <li><a href="/services#web">Sites Web</a></li>
          <li><a href="/services#tools">Outils Internes</a></li>
          <li><a href="/services#automation">Automatisations</a></li>
          <li><a href="/services#branding">Branding</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Agence</h4>
        <ul>
          <li><a href="/agence">À propos</a></li>
          <li><a href="/realisations">Réalisations</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:hello@kliv.agency">hello@kliv.agency</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </nav>

  </div>
  <div class="footer__bottom container">
    <p>© 2025 Kliv Agency. Tous droits réservés.</p>
    <a href="/mentions-legales">Mentions légales</a>
  </div>
</footer>
```

```css
.footer {
  background: var(--color-bg-dark);
  color: rgba(255,255,255,0.5);
  padding-top: var(--space-16);
}
.footer__inner {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.footer__logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 300;
  color: #fff;
  text-decoration: none;
  display: block;
  margin-bottom: var(--space-4);
}
.footer__logo span { color: rgba(255,255,255,0.3); }
.footer__brand p {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}
.footer__nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}
.footer__col h4 {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: var(--space-4);
}
.footer__col ul { list-style: none; padding: 0; margin: 0; }
.footer__col li { margin-bottom: var(--space-3); }
.footer__col a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--duration-fast);
}
.footer__col a:hover { color: #fff; }
.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) 0;
  font-size: var(--text-xs);
}
.footer__bottom a {
  color: rgba(255,255,255,0.4);
  text-decoration: none;
}
@media (max-width: 768px) {
  .footer__inner { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer__nav { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 5. COMPOSANTS PARTAGÉS

### Boutons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
  border: none;
  white-space: nowrap;
}
/* Tailles */
.btn--sm  { padding: 8px 18px;  font-size: var(--text-sm); }
.btn--md  { padding: 12px 24px; font-size: var(--text-base); }
.btn--lg  { padding: 16px 32px; font-size: var(--text-base); }

/* Variantes */
.btn--primary {
  background: var(--color-bg-dark);
  color: #fff;
}
.btn--primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.btn--outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-strong);
}
.btn--outline:hover {
  border-color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}
.btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
.btn--ghost:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border-strong);
}
.btn--inverse {
  background: #fff;
  color: var(--color-bg-dark);
}
.btn--inverse:hover {
  background: var(--color-bg-secondary);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(255,255,255,0.15);
}

/* Section headers */
.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: var(--space-4);
}
.section-label--light { color: rgba(255,255,255,0.4); }
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 300;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-12);
}
.section-title em {
  font-style: italic;
  color: var(--color-text-muted);
}
```

---

## 6. SYSTÈME D'ANIMATIONS

### 6.1 Animations au chargement — Reveal

```javascript
// reveal.js — Intersection Observer pour les animations au scroll
const revealElements = document.querySelectorAll('.animate-reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay * 100);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => observer.observe(el));
```

```css
/* État initial — caché */
.animate-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}
/* État visible */
.animate-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 6.2 Compteurs animés au scroll

```javascript
// counter.js
const counters = document.querySelectorAll('.stat__number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      let start = 0;
      const duration = 1500;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        entry.target.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));
```

### 6.3 Navbar au scroll

```javascript
// navbar.js
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
```

### 6.4 Curseur personnalisé (optionnel — desktop uniquement)

```javascript
// cursor.js
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Agrandir sur les liens et boutons
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
});
```

```css
.custom-cursor {
  position: fixed;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--color-text-primary);
  pointer-events: none;
  z-index: 9999;
  transition: transform 80ms linear, width 200ms var(--ease-out), height 200ms var(--ease-out);
  transform-origin: center;
  mix-blend-mode: multiply;
}
.custom-cursor.is-hovering {
  width: 40px; height: 40px;
  opacity: 0.15;
}
@media (pointer: coarse) { .custom-cursor { display: none; } }
```

---

## 7. RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile first */
/* xs:  < 480px  — petits téléphones */
/* sm:  480px    — téléphones */
/* md:  768px    — tablettes */
/* lg:  1024px   — petits écrans */
/* xl:  1280px   — desktop */
/* 2xl: 1440px   — grand desktop */

@media (max-width: 480px)  { /* Mobile xs */ }
@media (max-width: 640px)  { /* Mobile */ }
@media (max-width: 768px)  { /* Tablette portrait */ }
@media (max-width: 1024px) { /* Tablette paysage */ }
```

### Règles mobile prioritaires

```css
/* Navigation mobile */
@media (max-width: 768px) {
  .navbar__links { display: none; }
  .navbar__toggle { display: flex; flex-direction: column; gap: 5px; }

  /* Menu plein écran */
  .mobile-menu {
    position: fixed;
    inset: 0;
    background: var(--color-bg-dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    transform: translateY(-100%);
    transition: transform 0.5s var(--ease-out);
    z-index: 99;
  }
  .mobile-menu.is-open { transform: translateY(0); }
  .mobile-menu a {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: 300;
    color: #fff;
    text-decoration: none;
  }
}

/* Hero mobile */
@media (max-width: 640px) {
  .hero { padding-top: 7rem; min-height: auto; }
  .hero__actions { flex-direction: column; }
  .hero__actions .btn { width: 100%; justify-content: center; }
}

/* Touch interactions */
@media (hover: none) {
  .work-item__overlay { opacity: 1; } /* Toujours visible sur tactile */
  .service-card:hover { background: var(--color-bg-primary); } /* Pas de hover sur tactile */
}
```

---

## 8. PERFORMANCES & SEO

### Core Web Vitals — Cibles

| Métrique | Cible    |
|----------|----------|
| LCP      | < 2.5s   |
| FID/INP  | < 100ms  |
| CLS      | < 0.1    |
| Score Lighthouse | > 90 |

### Checklist technique

```html
<!-- HTML Head — métas essentielles -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Kliv Agency — Agence web & digitale. Sites web, outils internes, automatisations et branding sur-mesure.">
  <meta name="theme-color" content="#0E0E0D">

  <!-- Open Graph -->
  <meta property="og:title" content="Kliv Agency — Agence Web & Digitale">
  <meta property="og:description" content="Sites web, outils métier, automatisations, branding. Du design à la mise en production.">
  <meta property="og:image" content="/assets/og-image.jpg">
  <meta property="og:type" content="website">

  <!-- Preload fonts critiques -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- CSS critique inline, reste en defer -->
  <style>/* Critical CSS inline */</style>
  <link rel="stylesheet" href="/css/main.css">

  <title>Kliv Agency — Sites Web, Outils Métier & Automatisations</title>
</head>
```

```js
// Lazy loading images
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  // Les navigateurs modernes gèrent nativement loading="lazy"
  // Fallback Intersection Observer si nécessaire
});

// Preload LCP image (image hero)
// <link rel="preload" as="image" href="/assets/hero-visual.webp">
```

---

## 9. STACK TECHNIQUE RECOMMANDÉ

### Option A — Statique (recommandé pour démarrer)

```
Frontend   : HTML5 + CSS3 (custom, pas de framework)
JS         : Vanilla JS — minimal, aucune dépendance inutile
Build      : Vite (bundler ultra rapide)
Hébergement: Vercel ou Netlify (CDN global, déploiement Git)
CMS        : Sanity.io (pour gérer le portfolio sans coder)
Formulaire : Formspark ou Formspree
Analytics  : Plausible (privacy-first, RGPD natif)
```

### Option B — Next.js (pour évolution future)

```
Framework  : Next.js 14+ (App Router)
Styling    : CSS Modules + variables CSS custom
Animations : Framer Motion
CMS        : Sanity.io avec next-sanity
Déploiement: Vercel
```

### Structure de fichiers

```
kliv-agency/
├── public/
│   ├── assets/
│   │   ├── projects/          # Screenshots projets (WebP)
│   │   └── og-image.jpg
│   └── favicon.svg
├── src/
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   ├── variables.css  # Tout le design system
│   │   │   └── typography.css
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── services.css
│   │   │   ├── work.css
│   │   │   ├── testimonials.css
│   │   │   ├── footer.css
│   │   │   └── buttons.css
│   │   ├── sections/
│   │   │   ├── why-kliv.css
│   │   │   ├── process.css
│   │   │   └── cta-final.css
│   │   └── main.css           # Import de tout
│   ├── js/
│   │   ├── reveal.js
│   │   ├── counter.js
│   │   ├── navbar.js
│   │   ├── cursor.js
│   │   ├── marquee.js
│   │   └── main.js            # Point d'entrée
│   └── pages/
│       ├── index.html
│       ├── services.html
│       ├── realisations.html
│       ├── agence.html
│       └── contact.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 10. ACCESSIBILITÉ (A11Y)

```css
/* Focus visible systématique */
:focus-visible {
  outline: 2px solid var(--color-text-primary);
  outline-offset: 3px;
  border-radius: 2px;
}

/* Réduire les animations si préféré */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .marquee__track { animation: none; }
}

/* Contraste suffisant */
/* Tous les textes respectent WCAG AA (ratio ≥ 4.5:1) */
```

```html
<!-- Landmarks ARIA -->
<header role="banner">
<nav aria-label="Navigation principale">
<main id="main-content">
<footer role="contentinfo">

<!-- Skip link -->
<a href="#main-content" class="skip-link">Aller au contenu principal</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  background: var(--color-bg-dark);
  color: #fff;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  z-index: 200;
  transition: top var(--duration-fast);
}
.skip-link:focus { top: var(--space-4); }
```

---

## 11. CHECKLIST DE LANCEMENT

### Design
- [ ] Design system CSS complet implémenté
- [ ] Toutes les sections landing page développées
- [ ] Responsive testé sur iOS Safari, Chrome Android, Desktop
- [ ] Dark sections / Light sections alternées vérifiées
- [ ] Animations et transitions testées et smooth
- [ ] Curseur personnalisé desktop uniquement

### Contenu
- [ ] Textes finalisés et relus
- [ ] Images projets portfolio en WebP (< 300ko chacune)
- [ ] Témoignages validés par les clients
- [ ] Favicon SVG + PNG 192px + PNG 512px
- [ ] OG image 1200×630px

### Technique
- [ ] Score Lighthouse ≥ 90 (perf, accessibilité, SEO, best practices)
- [ ] Formulaire de contact fonctionnel et testé
- [ ] Analytics Plausible installé
- [ ] Sitemap.xml généré
- [ ] robots.txt configuré
- [ ] HTTPS actif (Vercel/Netlify l'inclut)
- [ ] Redirections 404 → page d'erreur custom configurée

### SEO
- [ ] Balises title uniques par page
- [ ] Meta descriptions (120–155 caractères)
- [ ] Balises Open Graph complètes
- [ ] Schema.org Organization JSON-LD
- [ ] Images avec attributs alt descriptifs

---

## 12. NOTES & DÉCISIONS DE DESIGN

> À compléter au fil du projet

| Date | Décision | Justification |
|------|----------|---------------|
| 2026-05 | Police Fraunces pour les titres | Élégance editoriale, contrast avec DM Sans sans-serif |
| 2026-05 | Pas de couleur d'accent colorée | Positionnement premium — la couleur = distraction |
| 2026-05 | Hover sur cartes services = inversion (blanc → noir) | Surprenant, mémorable, cohérent avec l'identité |
| 2026-05 | Marquee logos en texte, pas en images | Chargement plus rapide, meilleure lisibilité |

---

*Ce document est vivant. Mettez-le à jour à chaque décision structurante.*  
*Kliv Agency — brief v1.0 — Mai 2026*
