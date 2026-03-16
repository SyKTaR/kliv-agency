/**
 * constants.ts — Données statiques du site Kliv
 * Centralise tout le contenu : témoignages, FAQ, offres, réalisations, bénéfices
 */

export const NAV_LINKS = [
  { label: 'Services',  href: '#benefices' },
  { label: 'À propos',  href: '#processus' },
  { label: 'Tarifs',    href: '#offres' },
] as const

export const HERO_STATS = [
  { value: '48h',   label: 'Délai de réponse' },
  { value: '100%',  label: 'Sur mesure' },
  { value: '5★',    label: 'Note client' },
] as const

export const TOOLS = [
  'WordPress', 'Webflow', 'Shopify', 'React', 'Make',
  'HubSpot', 'Notion', 'Figma', 'Framer', 'Stripe', 'WooCommerce', 'Airtable',
] as const

export const TARGETS = [
  {
    id: 'artisan',
    title: 'Vous êtes artisan ou indépendant',
    description: "Vous avez un super savoir-faire mais votre présence en ligne ne le reflète pas. Vous n'avez pas le temps de gérer ça vous-même.",
    bg: 'rgba(255,255,255,0.03)',
    textColor: '#F5F0E4',
  },
  {
    id: 'pme',
    title: 'Vous dirigez une PME',
    description: "Vos outils digitaux sont éparpillés, votre site date d'il y a 5 ans, et vous perdez du temps sur des tâches qui pourraient être automatisées.",
    bg: '#EDEAE0',
    textColor: '#1a1a1a',
  },
  {
    id: 'lancement',
    title: 'Vous lancez votre activité',
    description: "Vous démarrez et vous avez besoin d'une base solide dès le départ — sans vous ruiner et sans vous perdre dans la technique.",
    bg: '#7BA7BC',
    textColor: '#080d14',
  },
] as const

export const BENEFITS = [
  {
    num: '01',
    title: 'Sans jargon',
    desc: "On traduit la complexité en résultats concrets. Vous comprenez toujours ce qu'on fait et pourquoi.",
  },
  {
    num: '02',
    title: 'Livré à temps',
    desc: "Un calendrier réaliste, des jalons clairs. On s'engage sur des délais et on les tient.",
  },
  {
    num: '03',
    title: 'Transparent sur les prix',
    desc: 'Un devis détaillé avant de commencer. Aucune surprise à la facture.',
  },
  {
    num: '04',
    title: 'Sur mesure',
    desc: 'Aucun template copié-collé. Chaque solution est pensée pour votre activité spécifique.',
  },
  {
    num: '05',
    title: 'Accompagnement long terme',
    desc: "On livre et on reste. Suivi, formation, évolutions — on est là après la mise en ligne.",
  },
  {
    num: '06',
    title: 'Pensé pour durer',
    desc: "Des technologies stables et évolutives. Ce qu'on construit tient dans le temps.",
  },
] as const

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'On écoute',
    desc: 'Un appel pour comprendre votre situation, vos besoins, vos contraintes réelles.',
  },
  {
    num: '02',
    title: 'On propose',
    desc: 'Une solution claire, un devis détaillé, un calendrier réaliste. Pas de surprise.',
  },
  {
    num: '03',
    title: 'On construit',
    desc: 'Vous validez les étapes clés, on exécute. Communication régulière tout au long du projet.',
  },
  {
    num: '04',
    title: 'Vous avancez',
    desc: "On livre, on forme, on reste disponibles. Le projet continue d'évoluer avec vous.",
  },
] as const

export const REALIZATIONS = [
  {
    num: '01',
    tag: 'Site vitrine',
    title: 'Refonte complète pour un artisan menuisier',
    result: '+40% de demandes de devis en 3 mois',
    stack: 'WordPress · Elementor',
    bg: '#EDEAE0',
    textColor: '#1a1a1a',
  },
  {
    num: '02',
    tag: 'E-commerce',
    title: 'Boutique en ligne pour une PME textile',
    result: 'Mise en ligne en 3 semaines, 0 bug au lancement',
    stack: 'Shopify · Custom theme',
    bg: '#7BA7BC',
    textColor: '#080d14',
  },
  {
    num: '03',
    tag: 'Automatisation',
    title: 'Automatisation des devis pour un cabinet RH',
    result: '2h économisées par jour sur les tâches admin',
    stack: 'Make · Notion · HubSpot',
    bg: '#F5F0E4',
    textColor: '#1a1a1a',
  },
] as const

export const OFFERS = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: '1 500€',
    desc: 'Pour les artisans et indépendants qui veulent une présence solide.',
    features: [
      "Site vitrine (jusqu'à 5 pages)",
      'Design sur mesure',
      'Responsive mobile',
      'SEO de base',
      '1 mois de support',
    ],
    highlight: false,
    badge: null as string | null,
  },
  {
    id: 'structure',
    name: 'Structuré',
    price: '3 500€',
    desc: 'Pour les PME qui veulent structurer leur digital.',
    features: [
      'Tout Essentiel inclus',
      'CRM ou outil intégré',
      'Formation incluse',
      '3 mois de support',
      'Rapport de performance',
    ],
    highlight: true,
    badge: 'Le plus choisi' as string | null,
  },
  {
    id: 'complet',
    name: 'Complet',
    price: '6 000€',
    desc: 'Pour un écosystème digital complet et automatisé.',
    features: [
      'Tout Structuré inclus',
      'Automatisation des processus',
      'Suivi trimestriel',
      'Évolutions incluses 6 mois',
      'Priorité de support',
    ],
    highlight: false,
    badge: null as string | null,
  },
]

export const TESTIMONIALS = [
  {
    initials: 'MD',
    name: 'Marie D.',
    role: 'Menuisière artisanale',
    quote: "Lucas a tout géré du début à la fin. Mon site est magnifique et j'ai déjà eu 3 nouveaux clients grâce à lui.",
    stars: 5,
  },
  {
    initials: 'TR',
    name: 'Thomas R.',
    role: 'Gérant PME (12 salariés)',
    quote: "On avait un vrai besoin de structurer nos outils. Kliv a tout mis en place en moins d'un mois. Bluffant.",
    stars: 5,
  },
  {
    initials: 'SK',
    name: 'Sarah K.',
    role: 'Consultante RH indépendante',
    quote: "La transparence sur les prix et les délais m'a convaincue. Aucune surprise, aucun stress.",
    stars: 5,
  },
  {
    initials: 'AM',
    name: 'Antoine M.',
    role: 'Co-fondateur startup',
    quote: "On voulait aller vite sans sacrifier la qualité. C'est exactement ce qu'on a eu.",
    stars: 5,
  },
] as const

export const FAQ_ITEMS = [
  {
    q: 'Combien coûte un site web chez Kliv ?',
    a: "Les tarifs démarrent à 1 500€ pour un site vitrine. Chaque projet est unique, on établit un devis détaillé après un premier échange sans engagement.",
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: "Un site vitrine est livré en 2 à 4 semaines selon sa complexité. On vous communique un calendrier précis avant de démarrer — et on le respecte.",
  },
  {
    q: 'Je ne suis pas technique. Est-ce un problème ?',
    a: "C'est exactement pour ça que Kliv existe. On s'occupe de tout et on vous explique ce dont vous avez besoin de savoir — rien de plus.",
  },
  {
    q: "Que se passe-t-il après la livraison ?",
    a: "On reste disponibles. Selon votre formule, vous bénéficiez d'un suivi de 1 à 6 mois. Et on peut toujours s'arranger pour des évolutions.",
  },
  {
    q: 'Vous travaillez avec quelles technologies ?',
    a: "WordPress, Shopify, Webflow, React, Make, HubSpot, Notion et bien d'autres. On choisit toujours la techno la plus adaptée à votre besoin, pas la plus compliquée.",
  },
  {
    q: 'Comment se passe le premier contact ?',
    a: "On répond sous 48h et on organise un appel découverte gratuit de 30 minutes pour comprendre votre projet. Sans engagement.",
  },
] as const
