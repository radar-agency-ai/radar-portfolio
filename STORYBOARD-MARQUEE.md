# STORYBOARD — Marquee Motion · Radar Studio
> 8 blocs séquentiels · Remotion · 30 fps · 1920×1080

---

## PARAMÈTRES GLOBAUX

```
FPS           : 30
Durée / bloc  : 150 frames (5s)
Durée totale  : 1 200 frames (40s)
Canvas        : 1920 × 1080
Background    : #0b0b0b (--ink)
```

### Design system Remotion

```ts
const COLORS = {
  ink:    '#0b0b0b',
  paper:  '#ffffff',
  wash:   '#efeee9',
  muted:  '#7c7c78',
  faint:  '#b6b5b0',
  line:   '#e7e5e0',
}

const FONTS = {
  serif: 'Newsreader',
  mono:  'JetBrains Mono',
}

// Easings (reproduire --wipe du site)
const WIPE   = Easing.bezier(0.76, 0, 0.24, 1)
const SMOOTH = Easing.bezier(0.22, 0.61, 0.36, 1)
```

### Structure Remotion

```tsx
<Composition id="MarqueeMotion" durationInFrames={1200} fps={30} width={1920} height={1080}>
  <Sequence from={0}   durationInFrames={150}><Block01 /></Sequence>
  <Sequence from={150} durationInFrames={150}><Block02 /></Sequence>
  <Sequence from={300} durationInFrames={150}><Block03 /></Sequence>
  <Sequence from={450} durationInFrames={150}><Block04 /></Sequence>
  <Sequence from={600} durationInFrames={150}><Block05 /></Sequence>
  <Sequence from={750} durationInFrames={150}><Block06 /></Sequence>
  <Sequence from={900} durationInFrames={150}><Block07 /></Sequence>
  <Sequence from={1050} durationInFrames={150}><Block08 /></Sequence>
</Composition>
```

### Composant partagé — `BlockShell`

Chaque bloc partage la même enveloppe :

```
┌─────────────────────────────────────────────────────────────┐
│  [NNN]  LABEL MONO                          Paris · FR  →   │  ← eyebrow, fade in f0–f15
│                                                             │
│                                                             │
│               ZONE D'ANIMATION CENTRALE                     │
│                                                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │  ← rule, scaleX f0→f20
└─────────────────────────────────────────────────────────────┘
```

```tsx
// Animations partagées
const eyebrowOpacity = interpolate(f, [0, 15], [0, 1])
const ruleScale      = interpolate(f, [0, 20], [0, 1], { easing: WIPE })
```

---

## BLOC 01 — Direction artistique
**Frames 0 → 150**

```
┌─────────────────────────────────────────────────────────────┐
│  [01]  DIRECTION ARTISTIQUE                                  │
│                                                             │
│   │ │ │ │ │ │ │ │ │ │ │ │   ← 12 colonnes                  │
│                                                             │
│         Direction                                           │
│         artistique.                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Une grille de 12 colonnes se construit, puis le titre se verrouille en place — le geste fondateur du DA.

**Éléments :**
- 12 lignes verticales fines (`rgba(255,255,255,.15)`), hauteur 480px
- "Direction" — Newsreader 140px weight 300, `--paper`
- "artistique." — Newsreader 140px weight 300, italic, `--paper`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 0 → 30 | Colonnes x12 | `scaleY` stagger +2f | 0 → 1, origin:top | WIPE |
| 25 → 75 | "Direction" | `translateY` | -80px → 0 | spring mass:1 |
| 25 → 75 | "Direction" | `opacity` | 0 → 1 | SMOOTH |
| 50 → 100 | "artistique." | `translateY` | 80px → 0 | spring mass:1 |
| 50 → 100 | "artistique." | `opacity` | 0 → 1 | SMOOTH |
| 110 → 150 | Colonnes | `opacity` | 0.15 → 0 | ease |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease (sortie) |

```tsx
// Colonnes — stagger
{Array.from({ length: 12 }).map((_, i) => {
  const start = i * 2
  const scaleY = interpolate(f, [start, start + 30], [0, 1], { easing: WIPE, extrapolateRight: 'clamp' })
  return <div style={{ scaleY, transformOrigin: 'top' }} />
})}

// Titre
const y1 = spring({ frame: f - 25, fps, config: { mass: 1, damping: 18 } })
const titleY = interpolate(y1, [0, 1], [-80, 0])
```

---

## BLOC 02 — Design system
**Frames 150 → 300**

```
┌─────────────────────────────────────────────────────────────┐
│  [02]  DESIGN SYSTEM                                         │
│                                                             │
│    ●  ●  ●  ●   ← swatches couleurs                        │
│                                                             │
│    ┌──────────────┐                                         │
│    │  COMPOSANT   │  ← pill qui s'assemble                  │
│    └──────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Les tokens de couleur apparaissent un par un, puis un composant (pill bouton) s'assemble à partir d'eux — du token au composant.

**Éléments :**
- 4 cercles (⌀ 48px) : `#0b0b0b`, `#ffffff`, `#efeee9`, `#7c7c78`
- Pill button : border radius 40px, 320×72px
- Label interne "COMPOSANT" en JetBrains Mono 14px

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 5 → 50 | Cercles x4 | `scale` stagger +10f | 0 → 1 | spring |
| 5 → 50 | Cercles x4 | `opacity` stagger +10f | 0 → 1 | — |
| 55 → 100 | Pill border | `strokeDashoffset` | 1 → 0 (SVG) | WIPE |
| 95 → 130 | Label interne | `opacity` | 0 → 1 | SMOOTH |
| 95 → 130 | Label interne | `letterSpacing` | .4em → .16em | SMOOTH |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
// Pill via SVG stroke-dashoffset
const perimeter = 2 * (320 + 72) // approx
const dash = interpolate(f, [55, 100], [perimeter, 0], { easing: WIPE })

// Cercles stagger
const circles = ['#0b0b0b', '#ffffff', '#efeee9', '#7c7c78']
circles.map((color, i) => {
  const s = spring({ frame: f - (5 + i * 10), fps })
  return <circle r={24} fill={color} style={{ scale: s }} />
})
```

---

## BLOC 03 — Développement React
**Frames 300 → 450**

```
┌─────────────────────────────────────────────────────────────┐
│  [03]  DÉVELOPPEMENT REACT                                   │
│                                                             │
│    <App>                                                    │
│      <Page>                                                 │
│        <Component />          ← brackets qui s'imbriquent   │
│      </Page>                                                │
│    </App>                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** L'arborescence React se construit couche par couche, chaque composant glisse depuis la gauche — la logique d'imbrication visible.

**Éléments :**
- 5 lignes de code, JetBrains Mono 28px, `--paper`
- Indentation : 0 / 32 / 64 / 32 / 0 px
- Couleurs : `<` `>` en `--muted`, noms en `--paper`, `/` en `--faint`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 10 → 40 | `<App>` | `translateX` | -60px → 0 | spring |
| 10 → 40 | `<App>` | `opacity` | 0 → 1 | — |
| 30 → 60 | `<Page>` | `translateX` | -60px → 0 | spring |
| 50 → 80 | `<Component />` | `translateX` | -60px → 0 | spring |
| 65 → 95 | `</Page>` | `translateX` | -60px → 0 | spring |
| 80 → 110 | `</App>` | `translateX` | -60px → 0 | spring |
| 100 → 130 | `<Component />` | `color` | `--paper` → cyan `#a8d5c2` | interpolate |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
const lines = [
  { text: '<App>',           indent: 0,  delay: 10 },
  { text: '  <Page>',        indent: 32, delay: 30 },
  { text: '    <Component />', indent: 64, delay: 50 },
  { text: '  </Page>',       indent: 32, delay: 65 },
  { text: '</App>',          indent: 0,  delay: 80 },
]
```

---

## BLOC 04 — Headless CMS
**Frames 450 → 600**

```
┌─────────────────────────────────────────────────────────────┐
│  [04]  HEADLESS CMS                                          │
│                                                             │
│   [Article]   [Image]   [Data]   ← blocs flottants          │
│       \           |         /                               │
│        ──────── ◎ ────────   ← point de connexion          │
│                 |                                           │
│           ┌──────────┐                                      │
│           │  ░░░░░░  │  ← browser frame (le "head")         │
│           └──────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Le contenu (body) existe indépendamment de la présentation (head). Les blocs flottent puis se connectent à une coquille navigateur.

**Éléments :**
- 3 rectangles contenu : 160×64px, fond `rgba(255,255,255,.08)`, border `--line`
- Labels internes : "ARTICLE", "IMAGE", "DATA" — mono 11px `--muted`
- Lignes SVG de connexion
- Browser frame : 280×180px, coins arrondis, border `--paper`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 5 → 45 | Blocs x3 | `scale` stagger +12f | 0 → 1 | spring |
| 5 → 45 | Blocs x3 | `opacity` stagger +12f | 0 → 1 | — |
| 50 → 100 | Lignes SVG x3 | `strokeDashoffset` | 1 → 0 | WIPE stagger |
| 90 → 130 | Browser frame | `scale` | 0 → 1 | spring mass:0.8 |
| 90 → 130 | Browser frame | `opacity` | 0 → 1 | — |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease |

---

## BLOC 05 — Motion & WebGL
**Frames 600 → 750**

```
┌─────────────────────────────────────────────────────────────┐
│  [05]  MOTION & WEBGL                                        │
│                                                             │
│         ·  ·  · ···  ·  ·  ·   ← points dispersés          │
│                                                             │
│   ╭────────────────────────╮                               │
│   ╰────────────────────────╯   ← onde sinusoïdale           │
│                                                             │
│         ·  ·  · ···  ·  ·  ·   ← points qui se reforment   │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Une onde se trace, se fragmente en particules, puis les particules se reforment — la nature même du motion design.

**Éléments :**
- Chemin SVG sinusoïdal : `stroke: --paper`, strokeWidth 2, no fill
- 16 points ⌀6px, `--paper`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 5 → 70 | Onde SVG | `strokeDashoffset` | 1 → 0 | WIPE |
| 65 → 100 | Onde SVG | `opacity` | 1 → 0 | SMOOTH |
| 65 → 100 | Points x16 | `translateX/Y` | position onde → scatter aléatoire | spring stagger +2f |
| 100 → 140 | Points x16 | `translateX/Y` | scatter → ligne horizontale | spring stagger +2f |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
// Onde SVG
const totalLength = 960 // longueur du path
const dash = interpolate(f, [5, 70], [totalLength, 0], { easing: WIPE })

// Scatter points
const scatter = (i: number) => ({
  x: (Math.sin(i * 2.4) * 200),
  y: (Math.cos(i * 1.7) * 120),
})
const line = (i: number) => ({
  x: (i - 8) * 60,
  y: 0,
})
```

---

## BLOC 06 — SEO / GEO
**Frames 750 → 900**

```
┌─────────────────────────────────────────────────────────────┐
│  [06]  SEO / GEO                                             │
│                                                             │
│   · · · · · · · · ·   ← grille de points (map)             │
│   · · · · · · · · ·                                         │
│   · · · ● · · · · ·   ← pin qui monte                      │
│   · · · · · · · · ·                                         │
│        #1             ← classement                          │
│        Paris · FR                                           │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Un pin se déplace vers le haut d'une grille pendant qu'un compteur de position descend jusqu'à #1 — la progression SEO rendue visible.

**Éléments :**
- Grille de 9×5 points ⌀4px, `rgba(255,255,255,.15)`
- Pin (cercle ⌀14px + anneau) `--paper`
- Compteur "#8 → #1" Newsreader 120px weight 200
- Label "Paris · FR" JetBrains Mono 12px `--muted`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 0 → 20 | Grille dots | `opacity` stagger | 0 → 0.15 | ease |
| 15 → 100 | Pin | `translateY` | 160px → 0 | SMOOTH |
| 15 → 100 | Compteur | `innerText` | "8" → "1" step tous les 12f | — |
| 80 → 110 | Anneau pin | `scale` | 0 → 1 | spring |
| 80 → 110 | Anneau pin | `opacity` | 1 → 0 | — |
| 100 → 130 | "Paris · FR" | `opacity` | 0 → 1 | SMOOTH |
| 100 → 130 | "Paris · FR" | `translateX` | -10px → 0 | SMOOTH |
| 130 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
// Compteur position SEO
const rank = Math.round(interpolate(f, [15, 100], [8, 1], { extrapolateRight: 'clamp' }))

// Pin translateY
const pinY = interpolate(f, [15, 100], [160, 0], { easing: SMOOTH, extrapolateRight: 'clamp' })
```

---

## BLOC 07 — Performance
**Frames 900 → 1050**

```
┌─────────────────────────────────────────────────────────────┐
│  [07]  PERFORMANCE                                           │
│                                                             │
│            100                                              │
│                          ← compteur géant                   │
│   ──────────────────────  ← barre de progression            │
│                                                             │
│   LCP   FID   CLS        ← labels Core Web Vitals           │
│   1.2s  12ms  0.01       ← valeurs qui apparaissent         │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** La barre de chargement du loader Radar se remplit — puis le score 100 s'affiche et les métriques Web Vitals se révèlent une à une.

**Éléments :**
- Barre : identique au `loader__bar` — 600px × 1px, fond `rgba(255,255,255,.15)`, remplissage `--paper`
- Compteur : Newsreader 180px weight 200, `--paper`
- Labels CWV : JetBrains Mono 11px, `--muted` + valeurs `--paper`

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 10 → 20 | Barre container | `opacity` | 0 → 1 | — |
| 20 → 110 | Barre fill | `scaleX` | 0 → 1, origin:left | WIPE |
| 20 → 110 | Compteur | `innerText` | 0 → 100 | SMOOTH |
| 100 → 125 | "LCP 1.2s" | `opacity` + `translateY` | 0→1 / 8px→0 | SMOOTH stagger +10f |
| 110 → 135 | "FID 12ms" | `opacity` + `translateY` | 0→1 / 8px→0 | SMOOTH |
| 120 → 145 | "CLS 0.01" | `opacity` + `translateY` | 0→1 / 8px→0 | SMOOTH |
| 135 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
// Compteur perf (miroir exact du loader__bar du site)
const score = Math.round(interpolate(f, [20, 110], [0, 100], { easing: SMOOTH, extrapolateRight: 'clamp' }))
const barScale = interpolate(f, [20, 110], [0, 1], { easing: WIPE, extrapolateRight: 'clamp' })
```

---

## BLOC 08 — Accessibilité
**Frames 1050 → 1200**

```
┌─────────────────────────────────────────────────────────────┐
│  [08]  ACCESSIBILITÉ                                         │
│                                                             │
│     ┌ ─ ─ ─ ─ ─ ─ ─ ┐   ← focus ring (dashed)              │
│     │  PRENDRE       │                                      │
│     │  CONTACT       │   ← le CTA pill du site              │
│     └ ─ ─ ─ ─ ─ ─ ─ ┘                                      │
│                                                             │
│        4.5 : 1   AA ✓    ← ratio contraste + badge          │
└─────────────────────────────────────────────────────────────┘
```

**Concept :** Le bouton CTA du site prend le focus — l'anneau se dessine — puis le ratio de contraste s'affiche et le badge AA apparaît.

**Éléments :**
- Pill button (240×56px) : bord `--paper`, fond transparent
- Label "PRENDRE CONTACT" JetBrains Mono 12px `--paper`
- Focus ring : dashed, border-radius 44px, offset 6px, `rgba(255,255,255,.7)`
- Ratio "4.5 : 1" Newsreader 64px weight 300
- Badge "AA ✓" pill `--paper` fond, `--ink` texte

**Animation :**

| Frames | Élément | Propriété | De → À | Easing |
|---|---|---|---|---|
| 5 → 35 | Pill button | `scale` | 0.85 → 1 | spring |
| 5 → 35 | Pill button | `opacity` | 0 → 1 | — |
| 30 → 75 | Focus ring | `strokeDashoffset` | 1 → 0 (SVG) | WIPE |
| 30 → 75 | Focus ring | `scale` | 1.3 → 1 | spring mass:0.8 |
| 75 → 115 | "4.5 : 1" | `opacity` | 0 → 1 | SMOOTH |
| 75 → 115 | "4.5 : 1" | `translateY` | 14px → 0 | SMOOTH |
| 105 → 135 | Badge "AA ✓" | `scale` | 0 → 1 | spring |
| 105 → 135 | Badge "AA ✓" | `opacity` | 0 → 1 | — |
| 135 → 150 | Tout | `opacity` | 1 → 0 | ease |

```tsx
// Focus ring via SVG
const focusPerimeter = 2 * Math.PI * /* rayon */ 140
const focusDash = interpolate(f, [30, 75], [focusPerimeter, 0], { easing: WIPE })
```

---

## TIMING GLOBAL

```
Frames 0    → 150   [01] Direction artistique
Frames 150  → 300   [02] Design system
Frames 300  → 450   [03] Développement React
Frames 450  → 600   [04] Headless CMS
Frames 600  → 750   [05] Motion & WebGL
Frames 750  → 900   [06] SEO / GEO
Frames 900  → 1050  [07] Performance
Frames 1050 → 1200  [08] Accessibilité
─────────────────────────
TOTAL                1200 frames · 40s @ 30fps
```

---

## NOTES REMOTION

**Transitions entre blocs :**
Chaque bloc se termine avec `opacity 1→0` sur les dernières 20 frames, et commence avec les éléments à `opacity 0` — pas de composant de transition global nécessaire, les `<Sequence>` suffisent.

**Fonts :**
```tsx
// remotion.config.ts
import { enableTailwind } from '@remotion/tailwind'
// Charger via Google Fonts dans le <style> du bundle :
// https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@...&family=JetBrains+Mono:wght@400;500
```

**Réutilisation :**
Créer un hook `useWipe(from, to)` et `useSpringFrom(startFrame)` pour éviter la répétition dans chaque bloc.

```tsx
const useWipe = (from: number, to: number) => {
  const f = useCurrentFrame()
  return interpolate(f, [from, to], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}
```
