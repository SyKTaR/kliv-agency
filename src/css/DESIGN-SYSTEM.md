# KLIV — Design system phase 1

Projet : `kliv-website`. Référence : maquette desktop 1512 × 7139 fournie pour la mission `design-kliv-refonte-home-systeme`.

## Chargement et compatibilité

La home charge `home.css` et `home.js`. Elle ne charge plus les composants de l’ancienne home, son intro animée ni son curseur personnalisé.

Les pages internes continuent de charger `main.css` : leurs contenus et styles historiques restent en place. Les nouveaux composants partagés utilisent le préfixe `kliv-` et les tokens `--kliv-*` pour éviter les collisions. `navbar.html` et `footer.html` sont toujours injectés par le plugin Vite existant.

Pour une page de phase 2, importer le reset, les tokens et les composants utiles ; remplacer ensuite les styles historiques de cette page. Ne pas remplacer globalement les anciens `--color-*` avant d’avoir recetté les pages concernées.

## Tokens

| Rôle | Token | Valeur |
| --- | --- | --- |
| Bleu de marque / grandes surfaces | `--kliv-blue` | `#017eff` |
| Bleu des petits boutons à texte blanc | `--kliv-blue-action` | `#0068d5` |
| Texte principal | `--kliv-ink` | `#232323` |
| Cartes foncées / petits textes sur bleu | `--kliv-dark` | `#161616` |
| Texte secondaire sur blanc | `--kliv-muted` | `#707070` |
| Formulaire / switch / contrôles | `--kliv-surface` | `#efefef` |
| Fond secondaire | `--kliv-paper` | `#fafafa` |
| Filets | `--kliv-line` | `#d6d6d6` |
| Police courante | `--kliv-font` | Geist locale, puis Arial |
| Accroches / chiffres | `--kliv-serif` | Fraunces, puis Georgia |
| Rayons | `--kliv-radius-sm/md/lg` | 18 / 28 / 36 px |
| Pill | `--kliv-pill` | 999 px |
| Largeur des contenus | `--kliv-content` | 1224 px |

L’échelle d’espacement réutilisable est 8, 16, 24, 32, 48 et 64 px (`--kliv-space-1` à `--kliv-space-6`). Les espacements de section reprennent les valeurs de la référence : 50, 120, 140, 160 et 190 px sur desktop.

## Composants

- `design-system.css` : boutons `.kliv-button` (variantes `--blue`, `--white`, `--outline`), titres `.kliv-heading` et leur `em`, texte `.kliv-copy`, en-tête `.kliv-header`, texte accessible `.kliv-sr-only`.
- `components/navbar.css` et `src/js/navbar.js` : pill fixe, menu mobile fermé hors écran de lecture grâce à `hidden`, fermeture avec Échap, clic extérieur, perte du focus et changement de breakpoint. Menu non modal : aucune capture du focus ni blocage du scroll nécessaires.
- `components/footer.css` : CTA final, colonnes, informations légales et liens SEO dans un `details` natif.
- `components/accordion.css` : `.kliv-faq__item` est un `details` avec `summary`. Fonctionne sans JS. Le contrôleur home synchronise `aria-expanded` et assure un seul élément ouvert sur les navigateurs sans prise en charge de `details[name]`.
- `components/forms.css` : champs `.kliv-field`, formulaire `.kliv-form`, onglets `.kliv-tabs`, retours `.kliv-feedback`, iframe `.kliv-calendar`. Les input, select et textarea sont redessinés explicitement. Le select conserve son comportement natif, son chevron est dessiné en SVG CSS.
- `home.css` : composition de la page, liste de services, stats, cartes d’approche, cartes de projets. Les images de projets ont un ratio réservé et des dimensions HTML ; les cartes n’ont aucun lien tant que l’URL publique n’est pas confirmée.

## Comportements et API

`src/js/contact.js` est partagé entre la home et `/contact`. Noms attendus par l’API : `nom`, `email`, `societe`, `type_projet`, `message`, `website` (honeypot). Le téléphone reste facultatif sur la page contact existante. La provenance et les paramètres UTM sont conservés. Le succès garde l’URL courante et ajoute `envoye=1` ; il ne redirige plus la home vers `/contact`.

Les onglets utilisent les rôles ARIA tablist/tab/tabpanel, les flèches gauche/droite et Home/End. Le lien `/#reserver` sélectionne Calendly, lui affecte sa véritable URL et descend au contact. Aucune réservation n’est prise automatiquement. L’iframe n’a pas de `src` au chargement initial.

La marquee se met en pause au survol ou au focus. Avec `prefers-reduced-motion`, elle devient une liste statique et les révélations sont désactivées. Les contenus restent visibles si JavaScript échoue.

## Responsive et accessibilité

CSS mobile d’abord, enrichi à 768 et 1024 px. Navigation complète à partir de 768 px ; à vérifier visuellement à 820 px. Sur mobile : services, stats, cartes et champs empilés.

La référence présente certains contrastes insuffisants pour de petits textes. Les boutons bleus utilisent donc `#0068d5`. Sur les grandes surfaces `#017eff`, les petits textes du footer sont foncés et les paragraphes blancs sont en 20 px gras. Les boutons et éléments de navigation ont des cibles d’au moins 44 px, contrairement aux pills 38 px de la source. Ces différences sont explicites et restent à valider visuellement.

## Vérification

Les scripts de recette sont dans le dossier de mission `qa/` :

- `check-static.py` : métadonnées, JSON-LD, liens, champs, images, contrastes calculés, comparaison des fichiers préexistants.
- `contact-contract.mjs` : contrôleur formulaire dans un double de DOM et handler API avec fetch simulé ; aucun appel Airtable.
- `visual-check.cjs` : recette Playwright préparée pour 1440 / 820 / 390, menu, FAQ, calendrier, formulaire et pages internes. **Non exécutée pendant la mission : accès navigateur refusé.** Les captures et l’audit visuel restent à faire avant validation de la phase 1.
