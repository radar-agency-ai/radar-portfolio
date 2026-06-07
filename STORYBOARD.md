# STORYBOARD — Motion Intro · Radar Studio
> Design System + 8 Scènes · ~20 secondes · 16/9 · 1920×1080

---

## DESIGN SYSTEM

### Palette

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0b0b0b` | Fond loader, curtain, contact, texte principal |
| `--ink-2` | `#2b2b2b` | Texte secondaire, ombres |
| `--paper` | `#ffffff` | Fond pages blanches |
| `--paper-2` | `#f6f5f2` | Fond chaud (cartes, sections) |
| `--wash` | `#efeee9` | Fond project cards |
| `--muted` | `#7c7c78` | Labels, meta, eyebrows |
| `--faint` | `#b6b5b0` | Séparateurs décoratifs, marquee dash |
| `--line` | `#e7e5e0` | Lignes grille, bordures fines |
| `--line-2` | `#d8d6d0` | Bordures buttons, chips |

> **Palette essentielle de la motion : 3 états**
> `#0b0b0b` ↔ `#ffffff` ↔ `#efeee9` — le noir, le blanc, le beige chaud.

---

### Typographie

| Rôle | Font | Style | Usage |
|---|---|---|---|
| **Display / H-XL** | Newsreader | weight 280–320, italic optionnel, tracking −.02em | Titres hero, savoir-faire |
| **H-LG / H-MD** | Newsreader | weight 340–360, tracking −.01em | Sections, noms projets |
| **Eyebrow / Label** | JetBrains Mono | 10–11px, UPPERCASE, ls .16–.22em | Nav, numéros, meta |
| **Lede** | Newsreader | weight 360, 20–27px | Corps accroche |

---

### Composants

| Composant | Description |
|---|---|
| **Loader** | Fond `--ink`, lettres RADAR en Newsreader 108px, barre fine `scaleX` |
| **Nav bar** | `mix-blend-mode: difference` sur fond sombre → blanc automatique |
| **Eyebrow** | Mono + `--line-2` rule gauche + numéro d'index |
| **Curtain** | Voile `--ink`, `scaleY(0→1)` origin:bottom puis `scaleY(1→0)` origin:top |
| **Project card** | Fond `--wash`, hover veil + info serif |
| **Chip / Pill** | Mono 10px, border `--line-2`, actif → `--ink` fond + `--paper` texte |
| **Display heading** | Newsreader light/thin, clamp 48→150px |
| **Contact block** | Fond `--ink` plein, texte `--paper`, grande typo 96px |

---

### Tokens d'animation

| Token | Valeur | Usage |
|---|---|---|
| `--t-fast` | `.34s cubic-bezier(.22,.61,.36,1)` | Hover, chips, CTA |
| `--t-med` | `.62s cubic-bezier(.22,.61,.36,1)` | Reveals, cartes |
| `--t-slow` | `1.05s cubic-bezier(.22,.61,.36,1)` | Lignes, titres lourds |
| `--wipe` | `cubic-bezier(.76,0,.24,1)` | Loader, curtain — courbe "claquée" |

---

## STORYBOARD

### SCÈNE 1 — SILENCE NOIR
**⏱ 0:00 → 0:00.8 · 800ms**

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│            fond #0b0b0b              │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

- **Fond :** `--ink` #0b0b0b plein écran
- **Animation :** rien. Silence intentionnel
- **But :** créer une tension avant l'apparition du logo

---

### SCÈNE 2 — LOADER · R·A·D·A·R
**⏱ 0:00.8 → 0:03.0 · 2.2s**

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│          R  A  D  A  R               │
│          ──────────────              │
│   Studio de création web  Paris · FR │
│                                      │
└──────────────────────────────────────┘
```

- **Fond :** `--ink` continu
- **Logo "RADAR" :**
  - Newsreader weight 300, 108px, ls .02em, couleur `--paper`
  - Chaque lettre : `translateY(110% → 0)`, stagger `+60ms`, durée `.8s`, easing `--wipe`
  - Conteneur `overflow:hidden` — les lettres surgissent du bas
- **Barre fine :**
  - `height:1px`, `rgba(255,255,255,.25)`, largeur 240px
  - Remplissage : `scaleX(0→1)`, durée `1.05s`, easing `--wipe`, délai `+400ms`
- **Meta mono :**
  - JetBrains Mono 10.5px, `rgba(255,255,255,.5)`, flex between
  - Gauche : "Studio de création web" · Droite : "Paris · FR"
  - `opacity 0→1` + `translateY(4px→0)`, durée `.5s`, délai `+900ms`

---

### SCÈNE 3 — WIPE REVEAL
**⏱ 0:03.0 → 0:04.4 · 1.4s**

```
┌──────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░  ← noir remonte  │
│  ██████████████████████████████████  │
│  ████████ fond #ffffff apparaît ████  │
│  ██████████████████████████████████  │
└──────────────────────────────────────┘
```

- **Animation :** `clip-path: inset(0 0 0% 0) → inset(0 0 100% 0)`
- Le panneau noir remonte, révélant le fond blanc `--paper`
- Durée `1.15s`, easing `--wipe` (cubic-bezier .76,0,.24,1)
- Courbe volontairement "claquée" : lente au début, violente à la fin

---

### SCÈNE 4 — NAV APPEAR
**⏱ 0:04.0 → 0:05.2 · 1.2s** *(overlap +0.4s avec scène 3)*

```
┌──────────────────────────────────────────────────────┐
│ Radar•   01 INDEX  02 SAVOIR-FAIRE  03 STUDIO  04 CONTACT   [PRENDRE CONTACT] │
│──────────────────────────────────────────────────────│
│                                                      │
│                    fond --paper                      │
└──────────────────────────────────────────────────────┘
```

- **Nav :** `translateY(-100% → 0)`, durée `.9s`, easing `--wipe`, délai `+100ms`
- `mix-blend-mode: difference` — texte blanc sur fond blanc = rendu noir
- **"Radar●" :** Newsreader 21px — le `●` dot : `scale(0→1)`, délai `+100ms`
- **Liens 01–04 :** stagger `+40ms` par lien, JetBrains Mono 11px, UPPERCASE
- **CTA pill :** border `rgba(255,255,255,.5)`, `opacity 0→1`, délai `+200ms`

---

### SCÈNE 5 — HERO GRID + TITRE
**⏱ 0:05.0 → 0:08.5 · 3.5s**

```
┌──────────────────────────────────────┐
│ Radar•  01 INDEX...   [CONTACT]      │
│                                      │
│   ┊ ┊ ┊ ┊ ┊ ┊ ┊ ┊  ← grille légère  │
│                                      │
│   Studio de                          │
│   création                           │
│   web.            [Paris · FR ↘]     │
│                                      │
└──────────────────────────────────────┘
```

- **Grille hero bg :**
  - `linear-gradient` croisé, taille `100px`, `mask-image` radial en haut-droite
  - `opacity: 0 → .7`, durée `1.8s`, ease-out — quasi imperceptible, présence seulement
- **Eyebrow "01 · RADAR" :**
  - JetBrains Mono + rule `--line-2` droite (`scaleX 0→1`)
  - `opacity 0→1` + `translateX(-8px→0)`, `.34s`, délai `+200ms`
- **Titre Display :**
  - Newsreader weight 300, `clamp(48px,9.2vw,150px)`, `--ink`
  - Reveal mot par mot dans `overflow:hidden` : `translateY(.5em→0)` + `opacity 0→1`
  - Stagger `+120ms` par mot, durée `.6s`, easing `--wipe`
  - **"Studio"** → **"de création"** *(italic)* → **"web."**
- **Lede + meta :**
  - Newsreader 22px weight 360, `translateY(26px→0)` + fade, délai `+600ms`
  - À droite : "Paris · FR" mono, `scale(0→1)`

---

### SCÈNE 6 — LIVING GRID
**⏱ 0:08.5 → 0:12.5 · 4s**

```
┌──────────────────────────────────────┐
│ Radar•  02 SAVOIR-FAIRE actif        │
│ SAVOIR-FAIRE ─────────────── PROJETS │
│                                      │
│ ████████████████  ██████████         │
│ ████████████████  ██████████         │
│ ████████████████  ██████████         │
│ ████████                             │
│ ████████  ← hover : info fade in     │
└──────────────────────────────────────┘
```

- **Curtain in/out :**
  - Voile `--ink` : `scaleY(0→1)` origin:bottom, `.52s` easing `--wipe`
  - Puis `scaleY(1→0)` origin:top, `.52s` — révèle la page Savoir-faire
- **Eyebrow "02 Savoir-faire" :**
  - Rule `scaleX(0→1)` depuis gauche, durée `.8s` easing `--t-slow`
- **Cards grille 12 colonnes :**
  - Fond `--wash` #efeee9, placeholders gris gradients
  - Apparition stagger gauche→droite, haut→bas : `opacity 0→1` + `translateY(16px→0)`
  - Délai `index × 80ms`, durée `.62s` easing `--t-med`
  - Spans asymétriques : 4 à 8 colonnes, hauteurs variées
- **Hover simulé sur card 01 (à t+2s) :**
  - Veil `rgba(246,245,242,.82)` fade in
  - Info monte : `opacity 0→1` + `translateY(8px→0)`, `.62s`
  - Texte : "Halle des Forges" Newsreader 30px + tags mono

---

### SCÈNE 7 — SAVOIR-FAIRE · MANIFESTE
**⏱ 0:12.5 → 0:16.5 · 4s**

```
┌──────────────────────────────────────┐
│                                      │
│   Une démo,                          │
│   pas un                             │
│   argumentaire.                      │
│                                      │
│   01  Grille vivante  ────────────── │
│   02  Triple lecture  ────────────── │
│                                      │
└──────────────────────────────────────┘
```

- **Titre central display :**
  - Newsreader weight 300, ~120px, fond `--paper`
  - "Une démo," → regular
  - "pas un" → italic
  - "argumentaire." → italic
  - Reveal ligne par ligne : `overflow:hidden`, `translateY(110%→0)`, stagger `+180ms`, `--wipe`
- **Note fictif (mono) :**
  - "CONTENU FICTIF · CLIENT ILLUSTRATIF «DL-C»" — JetBrains Mono 10px `--muted`
  - `opacity 0→0.5`, délai après le titre
- **Liste capabilities :**
  - Rule gauche `scaleX(0→1)` + numéro + titre H-LG + description, stagger `+120ms`
  - Items : "Grille vivante", "Triple lecture"

---

### SCÈNE 8 — CONTACT + END CARD
**⏱ 0:16.5 → 0:20.0 · 3.5s**

```
┌──────────────────────────────────────┐
│                                      │
│   Un projet de site ?                │
│   On regardera ça ensemble.          │
│                                      │
│   bonjour@radar.studio →             │
│                                      │
│                    [ fade to black ] │
│                                      │
│              R A D A R               │
│              ─────────               │
└──────────────────────────────────────┘
```

- **Curtain → fond contact `--ink` :**
  - Transition curtain identique scène 6
  - Fond `#0b0b0b`, texte `--paper`
- **Headline contact :**
  - "Un projet de site ?" Newsreader 60px weight 300 → fade in
  - "On regardera ça ensemble." → idem, délai `+160ms`
- **Email géant :**
  - "bonjour@radar.studio →" Newsreader weight 260, `clamp(34px,6vw,96px)`
  - `translateX(-20px→0)` + `opacity 0→1`, `1.05s` easing `--t-slow`
  - La flèche `→` : `scale(0→1)`, délai `+400ms`
- **Fade to black :**
  - `opacity 1→0` sur tout, durée `1s`, délai `+2s`
- **Logo final :**
  - "RADAR" Newsreader 80px weight 300, `--paper` sur `#0b0b0b`
  - Même animation montée que scène 2, plus lente (`1.1s`)
  - Le `●` dot : `scale(1→1.4→1)`, durée `1.2s`, 1 pulse
  - Ligne fine : `scaleX(0→1)`, `.8s` — freeze 0.5s → fin

---

## TIMING GLOBAL

```
0:00.0 ──── 0:00.8   Silence noir
0:00.8 ──── 0:03.0   Loader RADAR
0:03.0 ──── 0:04.4   Wipe reveal
0:04.0 ──── 0:05.2   Nav appear       (overlap +0.4s)
0:05.0 ──── 0:08.5   Hero grid + titre
0:08.5 ──── 0:12.5   Living grid + hover
0:12.5 ──── 0:16.5   Savoir-faire manifeste
0:16.5 ──── 0:20.0   Contact + end card
─────────────────────
TOTAL                 ~20 secondes
```

---

## NOTES DE RÉALISATION

**Outil recommandé :** After Effects + Motion Bro, ou Rive pour une version web-native.

**Points de vigilance :**

- La courbe `--wipe` (`cubic-bezier(.76,0,.24,1)`) est la signature du site — elle doit être reproduite à l'identique. C'est ce qui rend les transitions "claquées" plutôt que molles.
- Le `mix-blend-mode: difference` de la nav n'est pas reproductible tel quel dans AE — simuler avec deux calques superposés.
- Les titres Newsreader avec italic embedded ont une forte personnalité — bien cibler le `font-style:italic` sur des mots précis, pas tout le titre.
- La grille de fond hero est volontairement très subtile (`opacity .7`, masque radial) — ne pas la surjouer dans la motion.
- **Durée totale cible : 18–22 secondes.** Au-delà, une intro devient contre-productive.
