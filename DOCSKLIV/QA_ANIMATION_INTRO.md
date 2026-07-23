# Rapport QA — Animation d’intro KLIV « Le pigment devient signe »

**Date de contrôle :** 23 juillet 2026

**Périmètre :** home KLIV et intégration de l’intro avant commit/déploiement

**Décision :** **NO-GO pour le commit et le déploiement**

## 1. Résumé général

L’intégration compile et le flux nominal est cohérent avec le comportement demandé récemment par Lucas :

- l’intro est armée à chaque chargement complet ;
- le relais vers le hero est déclenché à `1 680 ms` ;
- l’overlay est retiré à `1 820 ms` dans le flux nominal ;
- le timeout indépendant retire l’overlay à `2 050 ms` si le contrôleur ne s’exécute pas ;
- la variante `prefers-reduced-motion` utilise un logo statique et termine à `300 ms` ;
- aucun stockage navigateur n’est lu ou écrit ;
- la simulation instrumentée n’a constaté qu’un seul déclenchement du reveal pour chacun des six éléments du hero ;
- le budget JS + CSS ajouté reste inférieur à `15 Ko`.

Deux non-conformités importantes empêchent cependant de valider la livraison :

1. avec JavaScript désactivé, l’overlay est bien masqué, mais les contenus portant `.animate-reveal` restent à `opacity: 0` ; le hero, son CTA et de nombreux contenus de page sont donc invisibles ;
2. si le bundle/module `main.js` ne charge pas ou si son graphe de modules échoue, le timeout retire bien l’overlay à `2 050 ms`, mais `reveal.js` ne rend pas le hero visible. Le mécanisme est « fail open » pour l’overlay, mais pas pour le contenu.

Ces défauts contredisent directement les critères 2 et 7 du comportement attendu. Ils justifient le **NO-GO**, même si Lucas a validé le rendu visuel nominal.

## 2. Niveau de confiance

**Confiance globale : moyenne.**

- **Élevée** sur le build, les chemins JavaScript, les temporisations, l’absence de stockage, le nombre de déclenchements du reveal et les poids de fichiers : contrôles exécutés ou déductions déterministes à partir du code réellement compilé.
- **Élevée** sur les deux anomalies importantes : leurs causes sont directement présentes dans le CSS/JS et le scénario de bundle absent a été reproduit dans une simulation exécutant le vrai script de boot.
- **Faible à moyenne** sur le rendu visuel, le CLS réel, le flash du premier frame, le bfcache réel et les compatibilités navigateur : aucun moteur de rendu n’a pu être lancé correctement dans le sandbox.

Ce rapport ne revendique pas une conformité WCAG complète ni une validation multi-navigateurs.

## 3. Références et fichiers inspectés

Documents demandés :

- `DOCSKLIV/BRIEF_ANIMATION_INTRO.md`
- `src/pages/index.html`
- `src/js/intro.js`
- `src/css/components/intro.css`
- `src/js/reveal.js`
- `src/js/main.js`

Fichiers complémentaires nécessaires à l’analyse :

- `src/css/main.css`
- `src/css/base/reset.css`
- `src/css/sections/animations.css`
- `src/css/components/hero.css`
- `package.json`
- `vite.config.js`
- build produit dans `dist/`

Le brief original décrit une lecture unique par session. Pour cet audit, cette règle a été volontairement remplacée par l’instruction plus récente de Lucas : **lecture à chaque chargement complet**.

## 4. Parcours critiques contrôlés

1. chargement complet standard ;
2. fin nominale et timeout de sécurité ;
3. préférence de mouvement réduit ;
4. retour arrière avec restauration bfcache ;
5. retrait de l’overlay et stabilité de la mise en page ;
6. premier frame sans flash du hero ou fond blanc ;
7. JavaScript désactivé ;
8. stockage navigateur indisponible ;
9. synchronisation entre l’intro et `reveal.js` ;
10. budget de poids JS + CSS ;
11. absence d’interaction, de focus ou de contenu accessible parasite dans l’overlay ;
12. échec de chargement du contrôleur principal.

## 5. Environnement et contrôles exécutés

### Contrôles réellement exécutés

| Contrôle | Résultat | Preuve / observation |
| --- | --- | --- |
| `npm run build` | **OK** | Vite `5.4.21`, 21 modules transformés, build terminé en `138 ms`. |
| Parse JavaScript | **OK** | `node --check` réussi sur `intro.js`, `reveal.js` et `main.js`. |
| Présence de l’intégration dans le build | **OK** | Le bundle `dist/assets/main-BUKlaZ5j.js` contient le contrôleur d’intro et le relais du hero ; le CSS compilé contient les règles `.intro`. |
| Assets de logo | **OK** | `logo-white.png` et `logo-anthracite.png` présents, tous deux en PNG `246 × 198`. |
| Simulation standard avec les scripts réels | **OK** | Retrait à `1 820 ms`, événement hero à `1 680 ms`, 6/6 éléments du hero visibles, un seul ajout de `.is-visible` par élément. |
| Simulation reduced motion | **OK** | Événement hero à `180 ms`, retrait à `300 ms`, 6/6 éléments visibles une seule fois. |
| Simulation sans chargement du graphe de modules | **KO** | Overlay retiré par sécurité à `2 050 ms`, mais 0/6 élément du hero rendu visible. |
| Deux chargements complets isolés | **OK** | Les deux démarrent avec `data-intro="play"` et `is-intro-active`; aucune mémorisation entre chargements. |
| Stockage bloqué/instrumenté | **OK** | Zéro accès à `sessionStorage` ou `localStorage` dans tous les scénarios simulés ; recherche statique négative également. |
| Simulation `pageshow` avec `persisted: true` | **OK, logique uniquement** | Un appel à `location.reload()` est effectué par événement simulé. |
| Contrôle accessibilité statique ciblé | **OK pour l’overlay** | `aria-hidden="true"`, image décorative `alt=""`, aucun descendant focusable, aucune capture de focus. |
| Scan accessibilité automatisé du dossier `src/pages` | **Exécuté, hors décision intro** | 17 signalements globaux ; aucun ne vise l’overlay. Plusieurs résultats sur la navigation/skip-link ne tiennent pas compte des partials ou du sélecteur réel et ne sont pas utilisés comme anomalies de cette intro. |
| Recherche sécurité de base | **OK** | Aucun secret, stockage, cookie, appel réseau, HTML injecté ou dépendance externe ajouté par l’intro. |

### Contrôles impossibles dans ce sandbox

| Contrôle | Statut | Raison |
| --- | --- | --- |
| `npm run dev -- --host 127.0.0.1` | **Non testable** | Le serveur échoue avec `Error: listen EPERM: operation not permitted 127.0.0.1:5173`. C’est une restriction d’environnement, pas un échec applicatif. |
| Chrome headless | **Non testable** | Chrome `150.0.7871.129` est installé, mais s’arrête avec le code `134`, y compris sur une page `data:` minimale et avec les options headless/sandbox usuelles. |
| CLS mesuré par `PerformanceObserver` | **Non testable** | Nécessite un moteur de rendu fonctionnel. |
| Filmstrip du premier frame / flash blanc | **Non testable** | Nécessite une capture navigateur dès la navigation. |
| Retour arrière bfcache réel | **Non testable** | Nécessite une session navigateur avec plusieurs navigations. |
| Safari macOS/iOS, Firefox, Chrome Android | **Non testable** | Navigateurs/appareils non pilotables dans l’environnement. |
| Fluidité avec throttling CPU ×4 | **Non testable** | Nécessite DevTools ou un runner navigateur fonctionnel. |
| Responsive visuel desktop/tablette/mobile | **Non testable visuellement** | Les règles ont été inspectées, mais aucun rendu réel ne peut être certifié. |

Le projet ne fournit aucune commande `lint`, `test`, TypeScript ou E2E dans `package.json`. Il n’existe donc pas d’autre suite projet à exécuter.

## 6. Résultat des dix critères demandés

| # | Critère | Résultat | Justification |
| --- | --- | --- | --- |
| 1 | Intro à chaque chargement complet | **OK** | Le boot pose systématiquement `data-intro="play"` ; aucun stockage ni garde de session. Deux chargements isolés simulés démarrent l’intro. |
| 2 | Timeout de sécurité vers `2 050 ms`, jamais bloqué | **KO** | L’overlay est bien retiré à `2 050 ms` si les modules ne chargent pas, mais le hero reste invisible car `reveal.js` ne s’exécute pas. Accès visuel non garanti. |
| 3 | Reduced motion : logo statique, environ `300 ms`, aucun mouvement | **OK par code et simulation** | Couches pigment/grain/axe masquées, animations et transforms annulés, retrait à `300 ms`. Un fondu d’opacité est prévu, sans déplacement. |
| 4 | Retour bfcache forcé en reload sans boucle | **Non testable en navigateur** | L’analyse et la simulation montrent un seul `reload()` lorsque `persisted === true`, et aucun reload sur un `pageshow` normal. Aucune boucle n’est visible dans le code, mais le cycle réel du navigateur n’a pas été testé. |
| 5 | Aucun CLS causé par l’overlay | **Non testable en rendu réel** | Structure favorable : overlay `position: fixed`, dimensions explicites du logo, `scrollbar-gutter: stable`. Aucune mesure CLS n’a pu être collectée. |
| 6 | Aucun flash blanc/contenu avant l’overlay | **Non testable visuellement** | Décision de lecture prise dans le `<head>`, CSS render-blocking et overlay présent dans le HTML avant le contenu. Cela réduit fortement le risque de flash du hero, sans permettre de certifier le premier frame. |
| 7 | JavaScript désactivé : site accessible et utilisable | **KO** | L’intro reste cachée, mais `.animate-reveal` conserve `opacity: 0` sans JavaScript. Le hero, le CTA et de nombreux contenus sont invisibles. |
| 8 | Stockage bloqué/indisponible | **OK** | Aucun accès à un stockage navigateur dans l’intégration ; zéro accès dans la simulation instrumentée. |
| 9 | Hero net/utilisable après l’overlay, sans double reveal | **OK pour le flux logique nominal ; visuel non testable** | Un événement à `1 680 ms`, garde globale contre le double dispatch, écoute `{ once: true }`, un seul `.is-visible` par élément simulé. Netteté réelle non mesurable ici. |
| 10 | Poids JS + CSS sous environ `15 Ko` | **OK** | Voir section suivante : `9 267 octets` bruts selon une mesure conservatrice de tout le code JS/CSS ajouté ou modifié pour l’intro. |

## 7. Poids réel ajouté

### Mesure stricte des deux nouveaux fichiers

- `src/js/intro.js` : `1 580 octets` bruts ; `613 octets` gzip mesurés séparément.
- `src/css/components/intro.css` : `5 469 octets` bruts ; `1 470 octets` gzip mesurés séparément.
- Total dédié : **`7 049 octets` bruts** ; **`2 083 octets` gzip** en compression séparée.

### Mesure conservatrice de toute l’intégration JS + CSS

Cette mesure ajoute au total dédié :

- script de boot inline : `1 567 octets` de JavaScript ;
- évolution de `reveal.js` : `+597 octets` ;
- évolution de `main.js` : `+20 octets` ;
- import ajouté dans `main.css` : `+34 octets`.

Total conservateur : **`9 267 octets` bruts**, soit environ **`9,05 Kio`**. Le budget demandé de `15 Ko` est respecté avec une marge de `5 733 octets`.

Le logo blanc pèse `3 884 octets`, mais il existait déjà et était suivi dans le dépôt avant cette intégration. Même en l’ajoutant au coût de premier chargement de l’intro, l’ensemble conservateur reste à `13 151 octets`. Le masque anthracite était également déjà présent et utilisé ailleurs sur la home.

Les tailles de build globales ne représentent pas le delta de l’intro :

- CSS compilé global : `44,49 kB`, `8,12 kB` gzip ;
- bundle JS partagé principal : `6,38 kB`, `2,29 kB` gzip.

## 8. Anomalies confirmées

### QA-INTRO-001 — Important — Contenu principal invisible sans JavaScript

**Fait observé**

La règle `src/css/sections/animations.css:1` applique sans condition :

```css
.animate-reveal {
  opacity: 0;
  transform: translateY(24px);
}
```

La visibilité dépend ensuite de l’ajout JavaScript de `.is-visible`. Avec JavaScript désactivé :

- la classe `.js` n’est jamais ajoutée, donc `.intro` reste bien `display: none` grâce à `src/css/components/intro.css:1-16` ;
- `reveal.js` ne s’exécute pas ;
- tous les éléments `.animate-reveal`, dont les six éléments du hero et son CTA, restent transparents.

**Étapes de reproduction**

1. Désactiver JavaScript dans le navigateur.
2. Charger `/pages/index.html`.
3. Observer le hero, son CTA et les sections portant `.animate-reveal`.

**Résultat attendu**

L’intro ne doit pas bloquer la page et tous les contenus essentiels doivent être visibles et utilisables immédiatement.

**Résultat observé**

L’overlay est masqué, mais les contenus animés restent à `opacity: 0`. Les liens peuvent encore exister dans l’arbre et recevoir le focus, mais l’interface visuelle n’est pas utilisable.

**Zones concernées**

- `src/css/sections/animations.css:1-10`
- `src/js/reveal.js:1-38`
- hero dans `src/pages/index.html:232-264`

**Risque**

Non-respect explicite du critère 7, perte du message principal et du CTA, expérience inaccessible pour les utilisateurs sans JavaScript ou avec JavaScript bloqué.

**Recommandation**

Rendre les contenus visibles par défaut et n’appliquer l’état initial masqué qu’après confirmation que le contrôleur de reveal est opérationnel. Une simple dépendance à `.js` ne couvre pas le scénario où le boot inline fonctionne mais où le bundle module échoue ; une classe de type « reveal prêt » posée par `reveal.js` serait plus robuste.

### QA-INTRO-002 — Important — Le timeout libère l’overlay mais pas le hero si le bundle module échoue

**Fait observé et reproduit**

Le timeout inline de `src/pages/index.html:59-62` appelle bien `failOpen()` à `2 050 ms`. La simulation qui exécute le vrai boot inline sans charger le graphe `main.js` donne :

- overlay retiré à `2 050 ms` ;
- `is-intro-active`, `data-intro` et `data-intro-motion` supprimés ;
- événement `kliv:intro-complete` émis une fois avec la raison `safety-timeout` ;
- **0/6 élément du hero avec `.is-visible`**.

L’événement ne suffit pas : lorsque le bundle n’a pas chargé, `reveal.js` n’a installé aucun listener. Le CSS conserve alors les éléments à `opacity: 0`.

**Étapes de reproduction**

1. Bloquer le chargement du bundle JS principal ou provoquer une erreur de chargement du graphe de modules.
2. Charger la home.
3. Attendre plus de `2 050 ms`.
4. Vérifier l’overlay et la visibilité du hero.

**Résultat attendu**

Le timeout doit libérer l’overlay, restaurer le scroll et rendre le vrai site immédiatement visible, même si le contrôleur ou son bundle plante.

**Résultat observé**

L’overlay et le verrou de scroll sont retirés, mais le hero et les autres contenus `.animate-reveal` restent invisibles. Le fail-open n’est donc que partiel.

**Zones concernées**

- boot inline dans `src/pages/index.html:26-69`
- import du contrôleur dans `src/js/main.js:1`
- écoute du relais dans `src/js/reveal.js:24-38`
- état masqué dans `src/css/sections/animations.css:1-6`

**Risque**

Non-respect du critère 2. Une erreur réseau, une erreur de module ou une politique bloquant le bundle peut laisser la home visuellement vide après l’intro.

**Recommandation**

Faire de la visibilité du contenu le véritable état de secours indépendant du bundle. Le boot/fail-open doit pouvoir produire un état CSS visible même en l’absence totale de `reveal.js`, sans supprimer le stagger du chemin nominal.

## 9. Risques et hypothèses non confirmés

### Risque mineur — Premier frame anthracite non certifié

**Faits**

- La décision d’afficher l’intro est prise tôt dans le `<head>`.
- La feuille CSS est render-blocking.
- L’overlay est présent dans le HTML avant la navigation et le hero.
- Le fond anthracite de l’overlay se trouve néanmoins uniquement dans la feuille CSS externe.

**Hypothèse**

L’implémentation devrait empêcher un flash du contenu. Un frame blanc avant l’application de la feuille externe ne peut toutefois pas être exclu sans filmstrip sur une navigation froide/throttlée.

**Recommandation de vérification**

Capturer le chargement dès le premier frame sur Chrome, Safari et Firefox avec cache désactivé et réseau ralenti. Ne classer un défaut qu’en cas de flash reproduit.

### Risque non classé — CLS et scrollbar

L’overlay est fixe et n’entre pas dans le flux. Le `scrollbar-gutter: stable` posé pendant le verrouillage réduit le risque de décalage horizontal lorsque le scroll revient. Aucun bug n’est confirmé, mais une mesure CLS réelle reste obligatoire avant déploiement.

### Risque non classé — bfcache réel

Le code ne montre pas de boucle : `reload()` n’est appelé que pour `event.persisted === true`, et un chargement complet normal reçoit en principe un `pageshow` non persistant. Le comportement réel, le maintien de la position de scroll et l’absence de rechargements répétés doivent être validés dans Safari, Chrome et Firefox.

## 10. Conformité accessibilité ciblée

### Points conformes par inspection

- overlay `aria-hidden="true"` ;
- logo décoratif avec `alt=""` ;
- aucun bouton, lien ou `tabindex` dans l’overlay ;
- aucun changement de focus ;
- couches pigment, grain et axe masquées en reduced motion ;
- transformations et animations spatiales annulées en reduced motion ;
- fin réduite garantie par timers, sans dépendre d’un `transitionend`.

### Limites

- aucune navigation clavier réelle n’a pu être exécutée ;
- aucun lecteur d’écran n’a été testé ;
- le défaut sans JavaScript rend le contenu visuel inutilisable et doit être corrigé avant de considérer le fallback accessible ;
- ce contrôle ciblé ne constitue pas une certification WCAG du site.

## 11. Points validés par analyse statique mais à confirmer visuellement

- composition desktop `clamp(92px, 8vw, 124px)` ;
- composition mobile `clamp(76px, 22vw, 88px)` sous `640px` ;
- couverture viewport `fixed`, `inset: 0`, `100vh` puis `100dvh` ;
- grain et pigment limités au masque du logo ;
- couleurs limitées à l’anthracite, au blanc et au KLIV Blue ;
- absence de WebGL, vidéo, canvas, particules DOM ou dépendance d’animation ;
- blur limité au petit logo ;
- animations principales basées sur `transform` et `opacity` ;
- logo préchargé ;
- overlay retiré du DOM en fin de séquence ;
- pas de double dispatch du relais hero grâce aux gardes globales.

## 12. Priorités avant nouvelle recette

1. Corriger le fallback visuel sans JavaScript.
2. Corriger le fail-open lorsque le bundle module principal ne charge pas.
3. Relancer `npm run build` et les simulations de temporisation/reveal.
4. Exécuter une vraie recette navigateur :
   - Chrome et Firefox desktop ;
   - Safari macOS ;
   - Safari iOS et Chrome Android si possible ;
   - desktop, tablette, mobile ;
   - reduced motion ;
   - JavaScript désactivé ;
   - bundle principal bloqué ;
   - retour bfcache ;
   - cache froid et réseau ralenti ;
   - mesure CLS et filmstrip du premier frame ;
   - CPU ×4.

## 13. Décision de livraison

**NO-GO pour le commit et le déploiement.**

Le flux nominal, les timings, la réduction de mouvement, l’absence de stockage, le poids et la synchronisation logique du reveal sont satisfaisants. La livraison reste néanmoins déconseillée tant que les deux chemins de secours explicitement demandés laissent le contenu principal invisible. Une nouvelle vérification QA est requise après correction, puis une recette navigateur réelle doit couvrir les points visuels et bfcache que le sandbox n’a pas permis de tester.
