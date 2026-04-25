# Guide Claude Design — TechSpace

> **Objectif :** Générer un nouveau thème visuel complet pour TechSpace avec Claude Design, puis l'intégrer dans le code existant en moins de 30 minutes.

---

## 1. Qu'est-ce que Claude Design ?

**Claude Design** est le produit visuel d'Anthropic, lancé le 17 avril 2026. Il génère des prototypes, systèmes UI, slides et maquettes à partir de prompts conversationnels. Il est alimenté par **Claude Opus 4.7**.

| Caractéristique | Détail |
|---|---|
| Disponibilité | Research preview — abonnements **Pro, Max, Team, Enterprise** |
| Accès | [claude.com/design](https://claude.com/design) |
| Entrées acceptées | Prompt texte, fichier DESIGN.md, dépôt Git, fichiers Figma, assets |
| Sorties | PDF, PPTX, HTML, **handoff bundle Claude Code** |
| Moteur | Claude Opus 4.7 |

### Ce qui le distingue d'un outil classique

- Il **lit ton codebase** (ou ton DESIGN.md) pour produire des outputs cohérents avec ce qui existe déjà.
- L'itération est conversationnelle : tu affines par commentaires inline ou via le chat, pas par clics.
- L'export **handoff bundle** est conçu spécifiquement pour être consommé par Claude Code en une seule instruction — boucle design → code fermée.

---

## 2. Le format DESIGN.md

### Pourquoi ce format

DESIGN.md est un fichier Markdown structuré qui combine **tokens YAML** (valeurs exactes pour les agents) et **prose Markdown** (intentions sémantiques pour que l'agent comprenne le pourquoi). Il est lu automatiquement par Claude Design, Claude Code et tout agent IA compatible.

> Le fichier dit à l'agent *quoi* utiliser (les tokens) ET *pourquoi* (le contexte) — ce qui lui permet de prendre des décisions cohérentes sur des cas non couverts.

### Structure des 9 sections standard

```
DESIGN.md
├── 1. identity        — nom, positionnement, ton éditorial
├── 2. colors          — palette complète avec usage sémantique
├── 3. typography      — familles, tailles, poids, interlignage
├── 4. spacing         — unité de base, échelle d'espacement
├── 5. radius          — arrondis par contexte
├── 6. shadows         — élévation et profondeur
├── 7. motion          — durées, courbes d'accélération, animations nommées
├── 8. components      — règles stylistiques par composant
└── 9. do / don't      — interdictions explicites pour garder l'agent sur piste
```

### Règles de rédaction

- **Tokens d'abord** : toujours donner la valeur exacte avant la prose
- **Nommer le contexte** : `primary: #F26826  # CTAs, prix, badges promo` vaut mieux que juste `#F26826`
- **La section do/don't est critique** : elle empêche l'agent de revenir à ses defaults génériques
- **Pas de `any`** : si tu ne sais pas encore, mets une intention plutôt qu'une valeur vide

---

## 3. DESIGN.md TechSpace — État actuel (point de départ)

Copie ce fichier et uploade-le dans Claude Design **avant** de prompter. Il donne à Claude Design le contexte complet de ce qui existe, afin qu'il puisse produire une *alternative* et non une simple reformulation.

```markdown
---
project: TechSpace
version: 1.0
context: Site e-commerce B2C, matériel informatique, marché marocain. Inspiration Newegg.
tone: Marketplace tech, clair, direct, professionnel. Prix en DH.
stack: React 19 + TypeScript + TailwindCSS v4 (tokens via @theme dans theme.css)
---

## Identity

TechSpace est une marketplace de matériel informatique pour le Maroc (PC Gamer,
composants, périphériques, portables, consoles). L'identité actuelle s'inspire de
Newegg : thème clair, orange agressif, bleu foncé institutionnel, jaune pour les
badges promotionnels. L'objectif est de générer une identité *nouvelle et distincte*,
pas une variation de Newegg.

Public cible : gamers et professionnels IT marocains, 18-35 ans, achats en DH.

## Colors (CURRENT — à remplacer entièrement)

```yaml
primary: "#F26826"          # orange Newegg — CTA, prix, accents
primary-hover: "#D9561C"
secondary: "#1B3758"        # bleu foncé — header, footer
accent: "#FBD32C"           # jaune — badges promo, texte sur fond sombre
background: "#FFFFFF"
surface: "#F5F5F5"
border: "#E0E0E0"
text: "#1A1A1A"
text-muted: "#666666"
success: "#16A34A"
danger: "#DC2626"
warning: "#D97706"
```

## Typography (CURRENT)

```yaml
display: "Outfit"    # titres h1–h6, weight 900/700
body: "Inter"        # corps, weight 400/500
```

## Spacing

Unité de base : 4px. Tailwind scale standard (p-1=4px, p-2=8px…).

## Radius

```yaml
sm: "0.25rem"   # 4px
md: "0.375rem"  # 6px — défaut composants
lg: "0.5rem"    # 8px
xl: "0.75rem"   # 12px — modales, drawers
```

## Shadows

Light theme, subtiles. Jamais de glow coloré sur les surfaces.

```yaml
card:     "0 1px 3px rgba(0,0,0,.08)"
elevated: "0 4px 12px rgba(0,0,0,.08)"
focus:    "0 0 0 3px rgba(242,104,38,.2)"
```

## Motion

```yaml
shimmer: "1.8s linear infinite"
logo-pulse: "2.4s ease-in-out infinite"
```

## Components

- **Button** : variantes primary (orange), secondary (bleu), outline, ghost, danger, success
- **Badge** : primary, success, danger, warning, accent, outline
- **ProductCard** : image + titre + prix DH + badge promo + rating + CTA
- **Header** : sticky, 2 niveaux (top bar bleu foncé + main bar blanche), search, icônes panier/favoris
- **Footer** : 4 colonnes + copyright
- **MegaMenu** : hover sur catégorie, grille de sous-catégories

## Do / Don't

### DO
- Afficher les prix en format "X,XXX DH"
- Mobile-first (breakpoints cibles : 375, 768, 1440px)
- Ombres légères sur fond clair, jamais de glow néon sur surfaces
- Radius modestes (max 12px)

### DON'T
- Ne pas utiliser Inter ou Roboto comme police principale (trop générique)
- Ne pas utiliser des dégradés violet/indigo sur fond blanc ou sombre
- Ne pas copier l'identité visuelle Newegg (orange #F26826 + bleu #1B3758) — c'est ce qu'on remplace
- Ne pas créer un dark mode par défaut (le site est clair)
```

---

## 4. Prompts pour générer un nouveau thème complet

### Structure d'un prompt efficace

```
[GOAL]        Ce que tu veux créer
[FEEL]        L'ambiance / les références visuelles
[CONSTRAINTS] Ce qui doit rester intact (fonctionnel, pas visuel)
[AVOID]       Ce que Claude Design ne doit pas faire
[OUTPUT]      Ce que tu veux en sortie
```

### Prompt de départ — Refonte complète TechSpace

Copiez ce prompt tel quel dans Claude Design **après avoir uploadé le DESIGN.md ci-dessus** :

---

```
Je veux une refonte complète de l'identité visuelle de TechSpace.
Le DESIGN.md joint décrit l'état ACTUEL — c'est la référence de ce qu'on abandonne,
pas de ce qu'on conserve.

GOAL
Créer un système de design pour une marketplace tech marocaine moderne et distinctive.
L'interface doit s'imposer comme une marque locale forte, pas un clone occidental.

FEEL
- Inspirations : Apple Store (clarté, espace, confiance) + Noon.com (couleur directe, dynamisme)
  + calligraphie arabe contemporaine (tension entre tradition et technologie)
- Ambiance : premium accessible. Pas luxe glacé, pas discount agressif.
- Émotion cible : "cette boutique est sérieuse et elle me comprend"

CONSTRAINTS — à conserver absolument
- Layout : header sticky 2 niveaux, megamenu au hover, footer 4 colonnes
- Composants : Button, Badge, ProductCard, Modal, Drawer, Toast, Skeleton (même nommage)
- Prix affichés en "X,XXX DH" (dirhams marocains)
- Mobile-first, breakpoints 375 / 768 / 1440px
- Stack React + TailwindCSS v4 (tokens dans @theme)

AVOID
- Ne pas réutiliser orange #F26826, bleu #1B3758, jaune #FBD32C (c'est l'ancienne palette)
- Pas de purple/indigo gradient (cliché AI)
- Pas de glassmorphism (daté)
- Pas de police trop géométrique ou trop playful (Pacifico, Lobster…)
- Pas de dark mode — thème clair uniquement

OUTPUT attendu
1. Nouvelle palette complète (primary, surface, border, text, semantic)
2. Nouvelle paire typographique (display + body) — suggère des alternatives à Inter/Outfit
3. Nouveau radius scale
4. Shadows révisées
5. Un aperçu de la ProductCard avec le nouveau système
6. Le fichier DESIGN.md mis à jour, prêt pour export Claude Code
```

---

### Prompts de raffinement (itérations)

Après la première génération, affine par conversation :

| Si tu veux... | Prompt de raffinement |
|---|---|
| Plus de chaleur | "La palette est trop froide. Réchauffe les neutres — surface vers #FAFAF7, border vers #E8E4DC" |
| Plus de caractère typographique | "Propose une alternative à [police suggérée] — quelque chose avec plus de personnalité, disponible sur Google Fonts" |
| Tester les badges promo | "Montre comment les badges 'Promo', 'Nouveau', 'Rupture' s'intègrent dans ce système" |
| Voir le header | "Génère le header 2 niveaux avec ce nouveau système — top bar, barre principale, icônes" |
| Export pour Claude Code | "Le design me convient. Génère le handoff bundle pour Claude Code." |

---

## 5. Workflow Claude Design → Claude Code → TechSpace

### Étapes complètes

```
1. PRÉPARER
   └── Ouvre claude.com/design
   └── Nouvelle session
   └── Upload ton DESIGN.md TechSpace (section 3 de ce guide)

2. GÉNÉRER
   └── Colle le prompt de refonte (section 4)
   └── Attends la génération (Opus 4.7, ~30s)

3. ITÉRER
   └── Affine via le chat ou les commentaires inline
   └── Cible : 2-4 rounds maximum
   └── Valide : palette, typo, ProductCard, Header aperçu

4. EXPORTER
   └── Clique "Export" → "Claude Code handoff bundle"
   └── Le bundle contient : DESIGN.md mis à jour + tokens CSS + aperçu HTML

5. INTÉGRER (voir section suivante)
```

### Mapper les tokens générés vers theme.css

Le handoff bundle contient un fichier de tokens. Mappe chaque valeur vers la variable correspondante dans `frontend/src/styles/theme.css` :

```css
/* AVANT (ancienne palette) */
@theme {
  --color-primary: #F26826;
  --color-secondary: #1B3758;
  --color-accent: #FBD32C;
  /* ... */
}

/* APRÈS (remplacer par les nouvelles valeurs du bundle) */
@theme {
  --color-primary: [NOUVELLE_VALEUR];        /* primary du nouveau système */
  --color-primary-hover: [NOUVELLE_VALEUR];
  --color-secondary: [NOUVELLE_VALEUR];      /* secondary du nouveau système */
  --color-accent: [NOUVELLE_VALEUR];         /* accent du nouveau système */
  --color-background: [NOUVELLE_VALEUR];
  --color-surface: [NOUVELLE_VALEUR];
  --color-border: [NOUVELLE_VALEUR];
  --color-text: [NOUVELLE_VALEUR];
  --color-text-muted: [NOUVELLE_VALEUR];
  --font-sans: "[NOUVELLE_POLICE_BODY]", system-ui, sans-serif;
  --font-display: "[NOUVELLE_POLICE_DISPLAY]", system-ui, sans-serif;
  /* conserver radius, shadows, animations sauf si le bundle en propose de nouvelles */
}
```

> **Astuce** : Demande à Claude Code directement : "Lis le handoff bundle joint et mets à jour `frontend/src/styles/theme.css` en conservant la structure @theme existante."

### Composants à vérifier après changement de thème

Ces composants ont des couleurs codées en dur à vérifier :

| Composant | Fichier | Points à vérifier |
|---|---|---|
| Header | `components/layout/Header.tsx` | top bar, bg couleur, logo couleur |
| Logo | `components/layout/Logo.tsx` | capsule dégradé, dot animé |
| Button | `components/ui/Button.tsx` | variante primary, hover, focus ring |
| Badge | `components/ui/Badge.tsx` | toutes les variantes de couleur |
| ProductCard | `components/ui/ProductCard.tsx` | badge promo, CTA, prix |
| PriceDisplay | `components/ui/PriceDisplay.tsx` | couleur prix, ancien prix barré |
| Footer | `components/layout/Footer.tsx` | bg, liens, couleur de fond |

---

## 6. Checklist d'intégration

### Avant de commencer

- [ ] Abonnement Claude Pro/Max/Team/Enterprise actif
- [ ] Accès à [claude.com/design](https://claude.com/design)
- [ ] Branche Git dédiée créée (`git checkout -b theme/refonte-[nom]`)
- [ ] DESIGN.md TechSpace copié depuis la section 3

### Après génération et avant intégration

- [ ] La nouvelle palette a un ratio de contraste ≥ 4.5:1 pour le texte (vérifiable sur [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker))
- [ ] La police display est disponible sur Google Fonts (ou incluse dans le bundle)
- [ ] Le `--color-focus` / shadow focus reste visible sur fond clair

### Après mise à jour de theme.css

```bash
cd frontend
npm run build    # vérifie que tout compile sans erreurs
npm run dev      # inspecte visuellement les pages clés
```

Pages à inspecter en priorité :
1. **Accueil** (`/`) — hero, cards, sections alternées
2. **Catalogue** (`/catalogue`) — ProductCards, filtres, pagination
3. **Fiche produit** (`/produit/[id]`) — galerie, prix, CTA, badges
4. **Panier** (`/panier`) — récap commande, bouton validation

### Points de vigilance

| Risque | Comment l'éviter |
|---|---|
| Police non chargée | Ajouter l'import Google Fonts dans `index.html` avant theme.css |
| Contraste insuffisant sur Badge | Tester fond coloré + texte blanc ET texte coloré + fond neutre |
| Logo cassé | Le Logo.tsx utilise des couleurs inline — le mettre à jour manuellement |
| Animations logo incompatibles | Revérifier `--animate-logo-*` si la palette change radicalement |

---

## Références

- [Introducing Claude Design — Anthropic](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [Get started with Claude Design — Help Center](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)
- [Set up your design system — Help Center](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)
- [Claude Design to Claude Code handoff](https://claudefa.st/blog/guide/mechanics/claude-design-handoff)
- [awesome-claude-design — templates DESIGN.md](https://github.com/VoltAgent/awesome-claude-design)
- [getdesign.md — bibliothèque de 400+ DESIGN.md](https://getdesign.md/)
- [Prompting for frontend aesthetics — Claude Cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
