# AIOS App — Design System

**v1.1.0**. La **structure** (échelles d'espacement, rayons, typographie,
motion, composants) a été forkée le 2026-08-15 d'un design system antérieur,
appelé **DS-source** dans tout ce fichier, lui-même porté d'un portfolio
personnel. La **palette de couleurs** ne vient plus de DS-source depuis la
v1.1.0 : voir « Palette » ci-dessous.

**Ce fork est historique, pas vivant.** Il n'y a pas de package partagé, pas de
dépendance, pas de chemin qui pointe vers le projet d'origine : `aios-app/` a
copié ce dont il avait besoin puis a divergé. Les mentions de DS-source
ci-dessous expliquent *d'où vient* une décision, elles n'obligent à rien. La
source de vérité opérationnelle des tokens CSS est `app/globals.css` ; ce
fichier en est le reflet déclaratif.

> Voice héritée de DS-source : quiet, technical, editorial. Structure par
> bordures plutôt que par ombre (deux exceptions : le matériau `.glass` du
> chrome flottant et les frames mockup). Une seule couleur de marque, rare.

## Palette : les couleurs de Claude, valeurs officielles

L'app vit dans le panneau droit de Claude Code. Elle en reprend donc la
palette **exacte**, pour que les deux surfaces se lisent comme un seul
environnement plutôt que comme deux produits côte à côte.

**Provenance.** Les valeurs sont extraites du bundle de l'application Claude
de bureau, `/Applications/Claude.app/Contents/Resources/app.asar`, blocs CSS
`:root` (clair) et `.darkTheme` (sombre). Ce ne sont ni des couleurs
échantillonnées sur des captures d'écran, ni une reconstitution à l'œil, ni
le `DESIGN.md` non officiel qui circule en ligne (celui-ci ne publie aucune
valeur et ne couvre que le clair). Chaque ligne de `globals.css` porte en
commentaire le nom du token d'origine, pour pouvoir re-vérifier à la source.

**Les trois niveaux de surface**, et la règle qui les gouverne :

| Rôle | Token AIOS | Clair | Sombre |
|---|---|---|---|
| Page | `bg` | `#faf9f5` (bg-100) | `#1f1e1d` (bg-200) |
| Carte | `surface` | `#ffffff` (bg-000) | `#262624` (bg-100) |
| Rail, survol, creux | `surface-2` | `#f0eee6` (bg-300) | `#30302e` (bg-000) |

`surface-2` s'éloigne de la page **dans le sens du contraste** : plus foncé en
clair, plus clair en sombre. C'est ce qui fait qu'un rail de segmented control
se lit pareil dans les deux thèmes.

**Texte.** L'échelle officielle n'a que trois paliers réels (`text-000`/`100`,
`text-200`/`300` et `text-400`/`500` sont égaux deux à deux) : `#141413` /
`#3d3d3a` / `#73726c` en clair, `#faf9f5` / `#c2c0b6` / `#9c9a92` en sombre.

**Bordures : une encre, pas une teinte.** Claude ne fige pas une couleur de
bordure, il pose une encre à **15 %** d'opacité (`hsl(var(--border-300) / .15)`),
ce qui la fait fonctionner sur n'importe quelle surface. La méthode est reprise
telle quelle via `--border-ink` ; `border-strong` double simplement l'opacité.

**Deux écarts assumés, et rien d'autre :**

1. **`warning` n'existe pas** dans la palette Claude. C'est la seule couleur
   inventée ici (`#b45309` / `#e8a33d`), calée sur la famille chaude.
2. **`fg-on-fill` en sombre.** Claude pose `oncolor-100` (blanc) sur le
   terracotta dans les deux thèmes. Sur `#d97757`, du blanc tombe à 2,9:1,
   illisible pour le compteur d'inbox ; l'encre y donne 7,2:1. En clair le
   fond de marque est plus sombre (`#c6613f`) et le blanc officiel est
   conservé.

## Thème : sombre par défaut, bascule persistée

Le sombre reste le défaut (contexte d'usage : le panneau droit de Claude
Code). Depuis la v1.1.0 le choix est **persistable** : `ThemeToggle` écrit
`aios-theme` dans `localStorage`, et un script inline dans le `<head>` de
`app/layout.tsx` repose la classe sur `<html>` **avant la première peinture**
— sinon la page s'affiche une frame dans le thème par défaut puis saute. La
classe n'est donc plus écrite en dur dans le JSX.

La classe `.light` sert toujours à forcer l'overlay clair sur un sous-arbre
même sous `html.dark` — c'est ce que fait la bascule de `/design-system`.

## Tokens repris

Structure reprise depuis `<projet-source>/app-mvp/app/globals.css`, section
« 1. Variables CSS » — les **valeurs de couleur** venant désormais de Claude
(voir « Palette ») :

- **Surfaces & bordures** : `bg`, `surface`, `surface-2`, `border`,
  `border-strong`, `invert-bg`, `invert-fg`, plus `border-ink` (nouveau).
- **Texte** : `text-primary`, `text-secondary`, `text-tertiary`.
- **Brand** : `brand`, `brand-hover`, `brand-text`, `fg-on-fill`
  (**terracotta Claude**, `#c6613f` en clair et `#d97757` en sombre — couleur
  d'action unique et rare).
- **Sémantiques** : `danger`, `positive` (paire succès/échec, jamais un
  accent), `warning`.
- **Bouton primary** : `btn-primary`, `btn-primary-hover`, `btn-primary-fg`.
- **Disabled** : `disabled-bg`, `disabled-fg`.
- **Espacement**, grille 4px : `none`(0) `2xs`(4) `2xs2`(6) `xs`(8) `xs2`(12)
  `sm`(16) `md`(24) `lg`(32) `lg-plus`(40) `xl`(48) `2xl`(64) `xl2`(72)
  `3xl`(96) `4xl`(128).
- **Rayons** : `none`(0) `sm`(1px) `pill`(3px, legacy) `md`(8px) `lg`(12px)
  `xl`(16px) `2xl`(24px) `full`(9999px, la vocabulaire capsule : pills,
  boutons icône, chrome flottant).
- **Typographie** : Space Grotesk (display) / Manrope (corps), classes
  `.text-hero/.text-h1..h4/.text-body-lg/.text-body/.text-body-sm/.text-label/
  .text-caption/.text-eyebrow`, line-heights en px absolus alignés sur la
  grille 4px.
- **Motion** : `duration-fast`(150ms) `duration-base`(300ms)
  `ease-default`(ease-out), `scale-pressed`(0.98, classe `.press`).

### Tokens de support portés en plus (nécessaires aux composants forkés)

Certains composants forkés (`DetailHeader`, `ContextMenu`, `FilterButton`,
`SegmentedControl` variante glass, `MiniStatus`, `ListRow`) consomment des
tokens que DS-source range dans son thème d'app (`.theme-linear`), pas dans les
tokens de base — parce que DS-source sépare une landing éditoriale d'une app
Linear-copy. AIOS App n'a pas cette séparation (toute l'app EST le tier
« app »), donc ces tokens ont été promus directement dans `:root`/`.dark` au
lieu d'être scopés à une classe de thème absente ici :

- **Glass** (matériau du chrome flottant) : `glass-bg`, `glass-edge`,
  `glass-highlight`, `glass-active`, `glass-shadow`, `glass-blur`,
  `glass-saturate` — classe `.glass`, custom variant `hover-supported:`.
- **Statuts de contenu** : `status-neutral`, `status-progress`,
  `status-done`, `status-blocked`, `avatar`, `avatar-fg` — consommés par
  `MiniStatus` et `ListRow`. Le statut `attention` de DS-source (alerte
  non-danger, spécifique à son workflow Inbox comptable) n'a pas été repris ;
  `MiniStatusKind` perd cette valeur en conséquence.
- **Safe-area & géométrie de `DetailHeader`** : `safe-top`, `safe-bottom`,
  `detail-header-h`, classes `.pt-safe-sm`, `.top-safe-sm`, `.pt-detail-header`,
  `.top-veil`, `.scroll-fade`.
- **Layout** : `container-px` (responsive 24/32/48px), classes
  `.px-container`, `.right-container`, et le correctif `.max-w-sm/md/lg/xl/2xl`
  (collision entre les clés `sm/md/lg/xl/2xl` de l'échelle d'espacement et
  celles de `max-w-*` de Tailwind — même correctif que DS-source, nécessaire dès
  qu'on adopte les mêmes noms de tokens).

### Utilitaires ajoutés en v1.1.0

Quatre classes étaient **utilisées dans le JSX sans avoir jamais été
définies**, donc sans aucun effet — Tailwind ne les génère pas, et une classe
inconnue échoue en silence. Elles sont désormais déclarées dans
`app/globals.css` :

| Classe | Rôle | Symptôme quand elle manquait |
|---|---|---|
| `.-mx-container` | bleed d'un rail défilant hors gouttière | rails décalés de 24px vers la droite, désalignés de leur titre |
| `.scrollbar-none` | rail horizontal sans barre de défilement | barre visible sous les cartes |
| `.pb-safe` | gouttière du home indicator | aucun (nul sur desktop), latent sur mobile |
| `.h-topbar` / `.top-topbar` | hauteur de la barre supérieure, et offset de la barre de filtres qui se colle dessous | la barre de filtres avait un `top-[57px]` figé, qui chevauchait l'en-tête dès que sa hauteur changeait |

Tokens ajoutés au passage, tous pour supprimer des valeurs arbitraires
existantes : `spacing-hair` (2px), `spacing-control-sm` (18px, case à cocher),
`spacing-rail-card` (168px, unifie les deux rails qui posaient 170 et 160),
`radius-xs` (5px) et la classe typographique `.text-micro` (10px), qui comble
le palier sous `caption` que plusieurs vues improvisaient en `text-[9px]`.

Non repris (inutiles sans les composants qui les consomment côté DS-source) :
`scrim`, `capsule-h`, `nav-inset-b`, `nav-h`, `detail-appbar-h`,
`detail-tabs-sticky-top`, `sheet-cap`, `sheet-height-large`, `bottom-veil`,
`pb-nav`/`mb-nav`/`pb-dock`, `attention`, `attention-soft`, `danger-soft`,
`palette-swatch-indigo`, tout le système `.theme-linear` /
`.dark-night` / `.palette-indigo` / `.theme-hero-mono` (thèmes multiples,
sans objet ici), le matériau CV forké (`docs/cv/`), PostHog.

## Typographie chargée en local

Space Grotesk (display) et Manrope (corps) sont chargées via `next/font/google`
dans `app/layout.tsx`, exactement comme DS-source (`app-mvp/app/layout.tsx`) :
les fichiers de police sont téléchargés au build et auto-hébergés par
Next.js, aucune requête réseau externe à l'exécution, aucune balise `<link>`
vers un CDN.

## Règle « pas de hex ni de px inline »

Aucune couleur ni taille n'est écrite en dur hors de `app/globals.css`. Tout
le code de ce ticket (composants, page de démonstration) consomme les
tokens via les classes Tailwind générées par le bridge `@theme inline`
(`bg-surface`, `text-text-secondary`, `gap-sm`, `rounded-full`…) ou, pour les
couleurs pilotées dynamiquement (`MiniStatus`, `StatusCircle`, `Avatar`), via
`var(--status-*)`/`var(--avatar*)` — jamais un hex ou un `px-[…]` arbitraire.
Vérifié par relecture avant commit.

## Composants forkés

Composants présentationnels de `<projet-source>/app-mvp/components/ui/`,
copiés dans `components/ui/`, imports adaptés, comportement et API
inchangés (ports, pas des réécritures) :

| Composant | Notes de port |
|---|---|
| `SegmentedControl` | **réécrit en v1.1.0** : rail plein bordé + curseur opaque (le contrôle segmenté classique des maquettes `wireframes/`). La version DS-source posait une pastille `.glass` sur un rail transparent : sans rail visible, rien ne disait que les deux libellés formaient un même contrôle, et l'onglet inactif se lisait comme du texte mort |
| `FilterPill` | **réécrit en v1.1.0** : les deux états sont des pills visibles (inactif bordé sur `surface`, actif plein + coche). L'inactif n'était que du texte gris, la rangée de filtres se lisait comme une légende |
| `FilterButton` | **réécrit en v1.1.0** : même matériau que `FilterPill`, pour que la rangée se lise comme un seul groupe de contrôles |
| `ActiveFilterRow` | inchangé |
| `SearchPill` | inchangé |
| `ListRow` (+ `StatusCircle`, `Avatar`) | inchangé |
| `GroupRow` | inchangé, test forké (`GroupRow.test.tsx`) |
| `SectionGroupee` | inchangé |
| `SectionHeader` | inchangé |
| `MiniStatus` | `MiniStatusKind` perd la valeur `"attention"` (token non repris, voir plus haut) |
| `Card` | inchangé |
| `ChipToggle` | inchangé |
| `DetailHeader` | inchangé dans son API et son comportement ; dépend en interne de `IconButton` et de la géométrie glass/veil/safe-area (voir « Tokens de support ») |
| `ContextMenu` (+ `MenuRow`) | inchangé |

**Dépendances techniques forkées en plus, non listées dans le ticket mais
requises par les composants ci-dessus** : `Icon` (wrapper Lucide unique du
design system, importé par 10 des 14 composants) et `IconButton`, dont le
matériau a changé en v1.1.0 : plein (`surface` + bordure) au lieu de `.glass`.
Sur le fond chaud et peu contrasté de la palette Claude, le verre ne se
détachait pas et les boutons de la barre supérieure se lisaient comme de
simples icônes posées, sans cible cliquable perceptible — la bordure EST
l'affordance. Sans ces deux composants, `DetailHeader` et la moitié des
composants listés ne compilent pas. `lib/cn.ts` (helper
`clsx` + `tailwind-merge`, avec la même configuration de groupes de classes
que DS-source pour que les classes `.text-*` custom ne rentrent pas en conflit
avec les couleurs de texte) a été forké pour la même raison.

## Composants propres à AIOS App (v1.1.0)

Écrits ici, sans équivalent chez DS-source :

| Composant | Rôle |
|---|---|
| `ThemeToggle` | bascule sombre/clair, persistée dans `localStorage` (`aios-theme`). Ne décide jamais du thème initial : il LIT la classe déjà posée par le script d'amorçage, sinon le rendu serveur et le client divergeraient |
| `TaskCheckbox` | case à cocher de tâche à trois états (`todo` → `doing` → `done`), icônes Lucide. `doing` porte un tiret, la convention « indéterminé » d'une case à cocher, qui se lit sans légende. Remplace des glyphes texte `✓`/`●` dont la taille et le centrage optique étaient faux |
| `SectionLabel` | en-tête de section de la vue Daily. Existe pour tenir le rythme vertical : chaque section répétait sa propre combinaison de `py-xs`/`pb-2xs`/`mt-1`, d'où des écarts différents d'une section à l'autre. L'écart en-tête → contenu est fixé ici une seule fois ; l'écart ENTRE sections est porté par le `space-y-*` du conteneur, jamais par les sections |
| `CountBadge` | pastille de compteur d'un bouton icône. Était dupliquée à l'identique dans les barres supérieures Daily et Global, avec des tailles en dur des deux côtés |

## Composants écartés

Explicitement écartés (couplage au domaine métier de DS-source : comptabilité
comptabilité, biens, justificatifs) :

- **`CompteurEcritures`** — compte des écritures comptables non pointées.
- **`JustificatifCard`** (+ son test) — carte de justificatif fiscal
  (upload, statut OCR, montant).
- **`ParcoursCard`** — carte de progression d'un parcours administratif métier.
- **`DisplayOptionsSheet`** (+ son test) — options d'affichage propres aux
  écrans de biens/comptabilité (tri par rubrique fiscale, etc.).
- **`FieldNote`** (+ son test) — note de champ affichant une divergence
  OCR ↔ écriture, vocabulaire strictement comptable.
- **`StatusBadge`** — mappé sur le vocabulaire de statut métier de DS-source
  (transaction, écriture, document), distinct du `MiniStatus` générique déjà
  forké.

Composants présentationnels génériques qui existent chez DS-source mais
n'étaient pas dans la liste du ticket, donc non forkés pour l'instant
(`Button`, `Tag`, `Input`, `Switch`, `RemovablePill`, `Toast`, `Sheet` +
slots, `BottomNav`, `TopBar`, `Skeleton`, `GroupCard`, `CtaButton`,
`SheetSubHeader`, `Shell`) : à réévaluer au fil des tickets suivants s'ils
deviennent nécessaires, en répétant le même geste de fork.

## Extensions à venir (non implémentées dans ce ticket)

Deux composants sont **neufs**, spécifiques à AIOS App, et n'existent pas
chez DS-source :

1. **Vue journée en blocs proportionnels** — blocs dont la hauteur est
   proportionnelle à la durée du créneau (`plan[]` de la daily note), sans
   grille horaire dessinée, trous nommés et chiffrés avec proposition de
   tâche.
2. **Accordéon projet vers tâches** — dépliage en place d'une carte projet
   vers ses tâches ouvertes (toutes, sans « voir plus »), terminées repliées
   derrière un compteur.

Le rail horizontal de cartes goal (`GoalRail`) et la barre d'habitudes
(`HabitsBar`) sont sortis de cette liste : déjà implémentés (ticket 31).

## Page de démonstration

`app/design-system/page.tsx` rend chaque composant forké dans ses états
principaux (actif/inactif, statuts, hiérarchies de `GroupRow`, menu ouvert…),
avec un bouton en tête de page pour basculer l'aperçu entre dark (défaut) et
light (overlay `.light`).
