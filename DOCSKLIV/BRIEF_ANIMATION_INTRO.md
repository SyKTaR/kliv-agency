# Brief direction artistique — Animation d’entrée KLIV

**Statut :** proposition créative prête à prototyper\
**Cible :** page d’accueil KLIV Agency\
**Durée cible :** **1 820 ms**\
**Technologie recommandée :** CSS + JavaScript vanilla

---

## 0. Recommandation en une phrase

Créer une intro courte nommée **« Le pigment devient signe »** : sur un fond anthracite parfaitement calme, le symbole KLIV apparaît depuis son centre, traversé par une matière bleu cobalt finement grainée qui se stabilise en blanc net ; le signe se condense ensuite en une ligne bleue, laquelle ouvre l’écran en deux et révèle le hero.

Ce n’est pas un faux écran de chargement. C’est une **ponctuation de marque de 1,82 seconde**, jouée une seule fois par session.

---

## 1. Lecture de l’identité existante

La proposition s’appuie sur les éléments observés dans :

- `logo.png` : symbole KLIV organique, fort et autonome, au centre évidé ;
- `DOCSKLIV/FONDATIONS.pdf` ;
- `DOCSKLIV/LANGAGE VISUEL.pdf` ;
- les tokens actuels de `src/css/base/variables.css` ;
- le hero de `src/css/components/hero.css` et `src/pages/index.html`.

Les principes de marque qui guident l’animation sont :

- **« Le numérique est déjà suffisamment complexe. Notre rôle est de le rendre évident. »**
- une esthétique **claire, éditoriale et maîtrisée** ;
- cinq sensations : **clair, calme, précis, humain, durable** ;
- le signe comme **point de clarté**, et non comme décoration répétée ;
- une palette volontairement courte :
  - KLIV Blue `#1A56F0` ;
  - anthracite `#26282C` ;
  - blanc `#FFFFFF` ;
- le bleu doit **signer**, pas remplir gratuitement ;
- l’anthracite apporte du statut ; le blanc laisse respirer.

### Problème de design à résoudre

Le logo doit sembler texturé et vivant sans basculer vers :

- un effet liquide ou 3D démonstratif ;
- un grain « vintage » plaqué sur toute la page ;
- des particules dispersées ;
- un dégradé multicolore ;
- un loader à pourcentage qui simule une progression technique ;
- une animation longue qui retarde artificiellement l’accès au contenu.

La matière doit donc être **locale, contenue dans le signe, brève et disciplinée**.

---

## 2. Concept retenu — « Le pigment devient signe »

### Idée

Le symbole débute comme une matière encore instable : un pigment bleu, dense et légèrement granuleux, circule à l’intérieur de sa silhouette. En moins d’une seconde, cette matière se range, se précise et laisse apparaître un signe blanc parfaitement net.

Le message implicite est simple :

> KLIV transforme une matière complexe en un résultat clair et maîtrisé.

Le mouvement part du centre évidé du logo, point le plus singulier du symbole. Il se termine par une ligne bleue parfaitement horizontale qui ouvre le cadre et donne accès au site.

### Pourquoi cette direction est adaptée à KLIV

- Elle traduit la promesse de **clarification** plutôt que de montrer une simple performance graphique.
- Elle utilise les trois couleurs officielles, sans créer de palette parallèle.
- Le bleu reste ponctuel et gagne en valeur parce qu’il n’occupe ni tout l’écran ni tout le logo pendant toute la séquence.
- Le grain donne une sensation tactile et humaine ; la stabilisation nette exprime la précision.
- L’ouverture finale est géométrique et contrôlée, en contraste avec les courbes organiques du signe.
- La mise en scène est mémorable, mais assez retenue pour ne pas concurrencer le hero.

### Direction alternative considérée, non recommandée

Une piste « gaufrage blanc sur papier » a été envisagée : fond blanc cassé, logo révélé par une lumière rasante et un grain papier. Elle serait élégante en print, mais moins juste ici :

- elle réduirait le contraste avec le hero blanc actuel ;
- elle dépendrait fortement d’ombres et de lumières simulées ;
- elle pourrait évoquer le luxe cosmétique plus que la clarté digitale ;
- elle rendrait le KLIV Blue trop secondaire.

La piste **pigment sur anthracite** est plus distinctive, plus cohérente avec le système actuel et techniquement plus robuste.

---

## 3. Storyboard détaillé et timings

Durée nominale totale : **1 820 ms**.\
Durée maximale absolue avant libération du site : **2 000 ms**.

| Temps | État visuel | Mouvement | Intention |
| --- | --- | --- | --- |
| `0–120 ms` | Écran anthracite `#26282C`, vide | Aucun mouvement | Installer un silence visuel très court ; éviter l’apparition immédiate façon pop-in. |
| `120–440 ms` | Le symbole apparaît au centre | Révélation circulaire depuis le vide central du signe ; opacité `0 → 1`, échelle `0.985 → 1`, flou local `4 px → 0` | Le signe émerge de son propre point de clarté. |
| `260–1 040 ms` | Matière visible à l’intérieur du logo | Un ruban de pigment KLIV Blue traverse lentement la silhouette de gauche à droite. Un micro-grain irrégulier se déplace par petits paliers, uniquement dans le masque du logo. | Créer la sensation de matière demandée sans salir le fond ni ajouter de particules. |
| `880–1 180 ms` | La matière se stabilise | Le grain perd progressivement en contraste ; le bleu se resserre en une bande centrale ; le reste du symbole devient blanc net. | Passage de la matière brute à la maîtrise. |
| `1 180–1 340 ms` | Logo blanc, net, avec une dernière signature bleue très fine | Pause optique de `80–120 ms`, puis la bande bleue se contracte vers l’axe horizontal du symbole | Laisser le cerveau reconnaître le logo avant la transition. |
| `1 340–1 500 ms` | Le logo disparaît ; une ligne bleue apparaît au centre de l’écran | Le signe baisse légèrement en opacité et se comprime visuellement ; une ligne de `1 px` s’étend du centre jusqu’aux bords | Transformer le signe en repère de composition. Pas de morphing SVG complexe nécessaire. |
| `1 500–1 820 ms` | Révélation du hero | Les deux moitiés anthracite quittent l’écran : panneau haut vers le haut, panneau bas vers le bas. La ligne s’efface. Le hero commence son reveal avec un chevauchement de `100–140 ms`. | Passage précis et continu entre intro et contenu. |

### Rythme

Le mouvement ne doit jamais sembler « élastique » ou ludique. Utiliser des courbes fermes :

- apparition du signe : `cubic-bezier(0.16, 1, 0.3, 1)` — équivalent de `--ease-out` ;
- stabilisation de la matière : `cubic-bezier(0.76, 0, 0.24, 1)` ;
- ouverture des panneaux : `cubic-bezier(0.87, 0, 0.13, 1)` — équivalent de `--ease-inout`.

Éviter :

- les rebonds ;
- l’overshoot ;
- les rotations du logo ;
- les zooms supérieurs à 2 % ;
- les pulsations répétées ;
- les sons.

---

## 4. Traitement visuel du logo texturé

### Composition

Le symbole seul est recommandé, sans nom « KLIV » accolé :

- taille desktop : `clamp(92px, 8vw, 124px)` de largeur ;
- taille mobile : `76–88px` de largeur ;
- centrage géométrique dans le viewport ;
- correction optique possible de `translateY(-2vh)` maximum si le symbole paraît trop bas ;
- aucun autre texte, pourcentage ou label de chargement.

Le fichier `logo.png` est un PNG transparent de `246 × 198 px`. Sa silhouette peut servir de **masque alpha** ; sa couleur source importe alors peu. Pour la production, utiliser un chemin canonique dans `public/assets` plutôt qu’un doublon isolé à la racine.

### Matière recommandée : pigment cobalt micro-grainé

La texture se compose de trois couches, toutes découpées par la silhouette du logo :

1. **Base blanche**

   - aplat `#FFFFFF` ;
   - donne la forme stable et la lisibilité finale.

2. **Ruban de pigment bleu**

   - uniquement `#1A56F0` et ses variations d’opacité ;
   - bande oblique très large et douce, environ `45–55 %` de la largeur du logo ;
   - déplacement horizontal unique ;
   - pas de violet, cyan, noir métallique ou reflet arc-en-ciel.

3. **Micro-grain**

   - texture monochrome de `64 × 64 px` ou `96 × 96 px`, idéalement WebP/PNG sous `4 Ko` ;
   - contraste faible, opacité visuelle maximale `16–20 %` ;
   - taille de grain perçue : environ `0,7–1,2 px` sur desktop ;
   - animation de `background-position` avec `steps(6, end)` pour une vibration organique non fluide ;
   - texture strictement limitée à la surface du signe.

Le grain ne doit pas être animé en continu pendant toute l’intro. Il vit pendant environ `600–700 ms`, puis se calme.

### Aspect attendu

La matière doit évoquer :

- une encre dense ;
- un papier légèrement fibreux observé de très près ;
- un pigment imprimé qui trouve sa netteté.

Elle ne doit pas évoquer :

- du chrome ;
- du verre liquide ;
- un nuage cosmique ;
- de la fumée ;
- un glitch numérique ;
- une dispersion de poussière.

### Niveau de contraste

Au pic de l’effet, conserver au moins **55–60 % de la silhouette en blanc lisible**. Le logo doit rester identifiable à tout moment après les `440 ms` initiaux.

---

## 5. Séquence complète : du premier frame au hero

### État initial

- L’overlay est déjà présent au premier rendu ; il ne doit pas être injecté après que le hero a flashé à l’écran.
- Le fond est anthracite uniforme.
- Le scroll est temporairement bloqué.
- Le hero existe dessous, mais son reveal est suspendu.

### Apparition du logo

- Le logo se révèle depuis son centre avec un `clip-path: circle(...)` porté par un wrapper.
- Le flou éventuel s’applique uniquement au petit logo, jamais à l’overlay plein écran.
- La silhouette atteint rapidement une netteté suffisante.

### Effet de texture

- La couche blanche reste la base.
- Le pigment bleu et le grain se déplacent à l’intérieur du masque.
- Le mouvement est asymétrique : un seul passage, sans aller-retour.

### Stabilisation

- Le grain baisse en contraste.
- Le ruban bleu se resserre.
- Le logo devient blanc et reste immobile un court instant.

### Transition

- Une ligne KLIV Blue de `1 px` part du centre.
- Les panneaux anthracite s’ouvrent depuis cette ligne.
- Cette transition révèle directement le vrai hero blanc ; aucun écran intermédiaire.

### Apparition du hero

Le reveal du hero doit démarrer pendant les `100–140 ms` finaux de l’ouverture :

1. grille du fond déjà visible ;
2. label ;
3. première ligne du titre ;
4. ligne en Fraunces bleu ;
5. texte ;
6. CTA ;
7. indication de scroll.

Le reveal actuel possède déjà un stagger fondé sur `data-delay`. Il faut le **synchroniser** avec la fin de l’intro au lieu de le laisser se jouer derrière l’overlay.

---

## 6. Recommandations techniques

### Choix de technologie

**Recommandation : CSS + JavaScript vanilla.**

GSAP n’est pas justifié pour cette seule séquence :

- le projet n’en dépend pas actuellement ;
- il n’y a ni morphing vectoriel réel, ni timeline interactive, ni physique complexe ;
- CSS gère correctement les transformations, opacités, masques et panneaux ;
- un contrôleur JavaScript de quelques lignes suffit pour la session et le passage de relais.

GSAP ne deviendrait pertinent que si KLIV décidait plus tard de construire un langage de motion partagé sur plusieurs pages et composants.

### Structure DOM indicative

Exemple de structure, à adapter par le développeur :

```html
<div class="intro" aria-hidden="true">
  <div class="intro__panel intro__panel--top"></div>
  <div class="intro__panel intro__panel--bottom"></div>

  <div class="intro__mark">
    <span class="intro__logo intro__logo--base"></span>
    <span class="intro__logo intro__logo--pigment"></span>
    <span class="intro__logo intro__logo--grain"></span>
  </div>

  <span class="intro__axis"></span>
</div>
```

L’overlay est purement décoratif :

- `aria-hidden="true"` ;
- aucun texte utile ;
- aucun contrôle ;
- aucun déplacement de focus.

### Masque CSS du logo

Extrait indicatif :

```css
.intro__logo {
  position: absolute;
  inset: 0;
  -webkit-mask: url('/assets/logo-anthracite.png') center / contain no-repeat;
  mask: url('/assets/logo-anthracite.png') center / contain no-repeat;
}

.intro__logo--base {
  background: #fff;
}

.intro__logo--pigment {
  background:
    linear-gradient(
      105deg,
      transparent 28%,
      rgba(26, 86, 240, 0.16) 39%,
      #1A56F0 49%,
      rgba(26, 86, 240, 0.22) 58%,
      transparent 70%
    );
  background-size: 240% 100%;
}

.intro__logo--grain {
  background: url('/assets/noise-kliv.webp') repeat;
  background-size: 64px 64px;
  opacity: 0.18;
}
```

Ce dégradé ne crée pas une nouvelle palette : il utilise uniquement le KLIV Blue et de la transparence. Il sert de lumière dans la matière, pas de fond décoratif.

Prévoir les préfixes `-webkit-mask` pour Safari.

### Animation des panneaux

Pour la sortie plein écran, préférer deux panneaux animés en `transform` :

```css
.intro__panel--top {
  inset: 0 0 50% 0;
  transform-origin: bottom;
}

.intro__panel--bottom {
  inset: 50% 0 0 0;
  transform-origin: top;
}

.intro.is-opening .intro__panel--top {
  transform: translateY(-101%);
}

.intro.is-opening .intro__panel--bottom {
  transform: translateY(101%);
}
```

Cette solution est plus stable qu’un `clip-path` animé sur un calque plein écran. Réserver le `clip-path: circle()` au petit wrapper du logo.

### Gestion « première visite de session »

Utiliser `sessionStorage`, avec une clé versionnée :

```js
const INTRO_KEY = 'kliv:intro:seen:v1'
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let shouldPlay = false

try {
  shouldPlay = sessionStorage.getItem(INTRO_KEY) !== '1'

  // Marquer la session dès la décision de jouer.
  // Un refresh pendant l’intro ne doit pas la relancer.
  if (shouldPlay) sessionStorage.setItem(INTRO_KEY, '1')
} catch {
  // Si le stockage est indisponible, privilégier l’accès immédiat
  // pour éviter une intro répétée à chaque page.
  shouldPlay = false
}

if (reduceMotion) {
  // Variante courte décrite plus bas.
}
```

Principes UX :

- jouer uniquement sur la home ;
- jouer à la première arrivée de la session, quelle que soit la source ;
- ne pas rejouer sur un refresh ;
- ne pas rejouer après une navigation vers une page service puis retour à la home ;
- une nouvelle session peut rejouer l’intro ;
- versionner la clé seulement si l’animation change réellement ;
- ne pas utiliser `localStorage`, qui supprimerait l’intro pour une durée indéfinie.

### Déclenchement et fin

- Ne pas attendre `window.load`.
- L’intro est une animation de marque, pas une représentation exacte du chargement réseau.
- Lancer dès que le DOM minimal et le masque du logo sont disponibles.
- Précharger l’asset du logo.
- Ajouter un **kill switch à 2 000 ms** : quelles que soient les erreurs d’asset ou d’événement, l’overlay doit être retiré et le scroll restauré.
- Écouter `animationend` ou `transitionend`, mais toujours conserver ce timeout de sécurité.
- Sur `pageshow` avec `event.persisted === true`, retirer immédiatement toute classe d’intro résiduelle afin de respecter le back-forward cache.

### Éviter le flash du hero avant l’overlay

La décision de montrer l’intro doit être prise avant le premier paint, via un petit script de boot placé tôt dans le document. Il peut poser un attribut du type :

```html
<html data-intro="pending">
```

Le CSS critique minimal de l’overlay doit être disponible immédiatement. Éviter de créer l’overlay seulement après l’exécution tardive de `main.js`, sinon le visiteur peut voir le hero pendant une fraction de seconde avant l’intro.

### Synchronisation avec `reveal.js`

Point de vigilance spécifique au code actuel :

`src/js/reveal.js` observe immédiatement tous les éléments `.animate-reveal`. Comme le hero est déjà dans le viewport, ses éléments peuvent devenir `.is-visible` pendant que l’intro les cache. Le visiteur découvrirait alors un hero déjà entièrement affiché, ce qui casserait la transition prévue.

Le développeur doit retenir l’une de ces deux approches :

1. **Approche recommandée : événement de passage de relais**

   - l’intro émet `kliv:intro-complete` ;
   - l’observation des éléments du hero commence seulement à cet événement ;
   - les autres sections peuvent continuer à utiliser l’Intersection Observer normalement.

2. **Approche minimale : classe de verrou**

   - `html.is-intro-active` force les `.hero .animate-reveal` à leur état initial ;
   - au début de l’ouverture des panneaux, la classe est retirée et les `.is-visible` sont appliquées avec le stagger existant.

Exemple indicatif :

```js
window.dispatchEvent(new CustomEvent('kliv:intro-complete'))
```

Puis, côté reveal :

```js
const startHeroReveal = () => {
  document.querySelectorAll('.hero .animate-reveal')
    .forEach((element) => observer.observe(element))
}

if (document.documentElement.classList.contains('is-intro-active')) {
  window.addEventListener('kliv:intro-complete', startHeroReveal, { once: true })
} else {
  startHeroReveal()
}
```

Ce snippet exprime le principe ; il faudra éviter de ré-observer deux fois les mêmes éléments dans l’intégration finale.

### Performances

Animer principalement :

- `transform` ;
- `opacity` ;
- `background-position` sur la petite surface du logo ;
- un `clip-path` uniquement sur le wrapper du logo.

À éviter :

- `filter: blur()` sur l’overlay plein écran ;
- un canvas plein écran ;
- une turbulence SVG recalculée à chaque frame ;
- WebGL ;
- une vidéo ;
- des centaines de particules DOM ;
- l’animation de grandes ombres ;
- les lectures/écritures de layout répétées.

Utiliser `will-change` uniquement pendant l’intro, puis retirer le composant du DOM ou sa classe de promotion après la fin.

Budget conseillé :

- logo + texture : idéalement moins de `15 Ko` ;
- aucun appel réseau externe pour l’intro ;
- zéro dépendance JavaScript supplémentaire ;
- test sur iPhone Safari et Android milieu de gamme avec throttling CPU ×4.

### Viewport mobile

- utiliser `position: fixed; inset: 0`;
- prévoir `min-height: 100vh` puis `min-height: 100dvh` ;
- ne pas baser le centrage sur une hauteur JS calculée en continu ;
- vérifier le changement de hauteur lié aux barres de navigateur mobile ;
- conserver le logo dans une zone sûre, sans interaction avec les encoches.

---

## 7. Variante `prefers-reduced-motion`

La variante réduite doit préserver la présence de marque sans reproduire la chorégraphie.

### Comportement recommandé

Durée totale : **300 à 400 ms maximum**.

1. L’overlay anthracite est visible immédiatement.
2. Le logo blanc est affiché au centre, parfaitement statique, sans grain animé.
3. Après `180–220 ms`, l’overlay et le logo passent en fondu simple vers le hero sur `120–160 ms`.
4. Aucun déplacement, aucune ouverture en panneaux, aucun clip-path animé, aucun blur.
5. Le hero est affiché directement ou avec un simple fondu très court ; aucun stagger spatial.

Exemple de garde CSS :

```css
@media (prefers-reduced-motion: reduce) {
  .intro__logo--pigment,
  .intro__logo--grain,
  .intro__axis {
    display: none;
  }

  .intro,
  .intro__panel,
  .intro__mark {
    animation: none !important;
    transform: none;
  }
}
```

Attention : le reset actuel force déjà les durées d’animation et de transition à `0.01ms` sous `prefers-reduced-motion`. Le contrôleur JavaScript ne doit donc pas attendre un `transitionend` qui pourrait être manqué. Il doit détecter cette préférence explicitement et suivre le chemin court ci-dessus, avec son propre retrait garanti.

---

## 8. États de secours

### JavaScript désactivé

Le site doit rester accessible immédiatement. Ne jamais livrer un overlay visible par défaut qui dépend de JavaScript pour disparaître.

Approche possible :

- classe `js` posée très tôt sur `<html>` ;
- overlay actif uniquement sous `.js[data-intro="play"]`.

### Logo non décodé ou asset manquant

- ne pas prolonger la durée ;
- laisser le fond anthracite puis ouvrir directement les panneaux ;
- le kill switch retire l’overlay avant `2 000 ms`.

### Onglet restauré par le navigateur

- sur `pageshow`, si la page provient du bfcache, forcer l’état final ;
- ne pas rejouer l’intro ;
- rétablir immédiatement le scroll.

### Erreur inattendue

La stratégie doit toujours être **fail open** : mieux vaut afficher le hero sans intro que bloquer l’accès au site.

---

## 9. Critères de contrôle qualité

### Direction artistique

- [ ] Le logo reste reconnaissable pendant l’effet de matière.

- [ ] La texture est visible dans le signe, jamais sur tout le viewport.

- [ ] Seules les couleurs KLIV officielles sont utilisées.

- [ ] Le bleu agit comme signature, pas comme remplissage généralisé.

- [ ] Aucun compteur, texte « chargement », particule ou halo décoratif.

- [ ] La séquence paraît calme et précise, pas futuriste ou ludique.

### Timing et UX

- [ ] Durée nominale proche de `1 820 ms`.

- [ ] Retrait forcé avant `2 000 ms`.

- [ ] Une seule lecture par session.

- [ ] Aucun replay sur refresh, navigation interne ou retour arrière.

- [ ] Aucun flash du hero avant l’overlay.

- [ ] Le hero ne termine pas son reveal derrière l’overlay.

- [ ] Le scroll est toujours restauré.

### Accessibilité

- [ ] Overlay `aria-hidden="true"`.

- [ ] Aucun focus capturé.

- [ ] Variante réduite statique et inférieure à `400 ms`.

- [ ] Site utilisable avec JavaScript désactivé.

### Performance

- [ ] Aucun WebGL, vidéo ou canvas plein écran.

- [ ] Aucun filtre lourd sur le viewport.

- [ ] Animation fluide sous throttling CPU ×4.

- [ ] Tests Safari iOS, Chrome Android, Safari macOS, Chrome et Firefox.

- [ ] Aucun décalage de layout au retrait de l’overlay.

---

## 10. Décision recommandée

Valider un prototype de la piste **« Le pigment devient signe »** en CSS/JS vanilla, avec :

- fond anthracite ;
- symbole seul ;
- base blanche ;
- passage unique d’un pigment KLIV Blue micro-grainé ;
- stabilisation nette ;
- ligne bleue centrale ;
- ouverture en deux panneaux ;
- hero synchronisé ;
- durée de `1 820 ms` ;
- lecture unique via `sessionStorage`.

Le point à juger pendant le prototype ne sera pas le concept général, déjà cohérent avec la marque, mais le **dosage du grain**. Il doit être assez perceptible pour donner une vraie matière, tout en restant assez discret pour que le signe conserve son statut et sa netteté.