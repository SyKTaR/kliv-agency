import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Kliv — couleurs officielles
        'kliv-bg':      '#080d14',   // fond principal : bleu nuit profond
        'kliv-surface': '#0e1520',   // fond sections alternées
        'kliv-footer':  '#060a11',   // fond footer
        'kliv-cream':   '#F5F0E4',   // texte principal
        'kliv-cream-dark': '#EDEAE0',
        'kliv-blue':    '#7BA7BC',   // accent bleu Kliv
      },
      fontFamily: {
        syne:     ['var(--font-syne)', 'sans-serif'],
        dm:       ['var(--font-dm-sans)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      letterSpacing: {
        'section': '0.15em',
        'wide-xs': '0.12em',
      },
      lineHeight: {
        'relaxed-xl': '1.75',
      },
    },
  },
  plugins: [],
}

export default config
