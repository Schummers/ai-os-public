---
name: produce-document
description: Router et mode d'emploi pour produire un livrable formaté depuis l'AI OS : deck de slides avec Slidev, PDF composé avec Typst, conversion vers docx, pptx ou pdf avec Pandoc. Use when the user asks to create a presentation, deck, slides, a written report, a formatted PDF, a Word document, or to convert a document from one format to another ("fais-moi un deck", "génère un rapport", "sors ça en PDF", "convertis en Word", "une présentation sur X").
---

# Produce Document

Trois outils installés, trois métiers distincts. Le piège est de prendre le mauvais : Pandoc ne compose pas, Typst ne convertit pas, Slidev ne fait pas de rapport. Ce skill route puis donne la recette exacte.

## 1. Router

| Le livrable est | Outil | Sortie |
|---|---|---|
| Un deck récurrent, sous charte, que je referai souvent | **Slidev** | HTML, PDF, PPTX |
| Un deck ponctuel qui doit être beau et unique | **frontend-slides** (plugin) | 1 fichier HTML, PDF |
| Un PDF composé, maîtrisé typographiquement (rapport, one-pager, CV, facture) | **Typst** | PDF |
| Une conversion d'un format vers un autre, ou un `.docx` éditable par un tiers | **Pandoc** | 60+ formats |
| Un `.docx` ou `.pptx` riche avec un template existant à respecter | skill `docx` / `pptx` d'Anthropic | docx, pptx |

Règles de tranchage quand plusieurs conviennent :

- **Quelqu'un doit éditer après moi** (client, recruteur, collaborateur) : Pandoc vers `.docx`, jamais Typst.
- **Je livre un PDF fini et je veux qu'il soit beau** : Typst, jamais Pandoc.
- **J'ai déjà du Markdown et je veux juste un PDF correct sans effort** : Pandoc avec le moteur Typst (voir §4). C'est le chemin court.
- **Contenu séquentiel et parlé** : Slidev ou frontend-slides. Un rapport découpé en slides reste un rapport raté.
- **Slidev ou frontend-slides** : Slidev quand le deck doit ressembler aux précédents et se re-générer (source Markdown versionnée, thème partagé, mode présentateur). frontend-slides quand le deck est un one-shot dont l'impact visuel prime (pitch, case study portfolio) et qu'on ne le rouvrira pas. Les deux sont installés, ce n'est pas une hésitation à trancher une fois pour toutes.

Le fichier fini part dans `deliverables/<domaine>/`, il est **déplacé**, jamais copié (voir `CLAUDE.md` racine). Les sources (`slides.md`, `.typ`) restent dans le dossier de travail du domaine.

## 2. Slidev, les decks

CLI global installé (`slidev`), **mais un deck a besoin de son propre `npm install`** : le thème et le moteur d'export se résolvent depuis le dossier du deck, pas globalement. Un `slidev` global lancé sur un `slides.md` nu échoue avec `theme "@slidev/theme-default" was not found`.

Scaffold depuis le template maison :

```bash
cp -R ~/AI\ OS/templates/slidev-deck <dossier-de-travail>/<nom-du-deck>
cd <dossier-de-travail>/<nom-du-deck> && npm install
```

Puis écrire le contenu dans `slides.md` et lancer :

```bash
npm run dev          # serveur local + hot reload, touche P pour le mode presentateur
npm run export:pdf   # -> deck.pdf
npm run export:pptx  # -> deck.pptx
```

L'export passe par Chromium (`playwright-chromium`, déjà dans le template). Au tout premier export sur la machine : `npx playwright install chromium`.

Syntaxe utile dans `slides.md` :

- `---` seul sur une ligne sépare deux slides.
- Un bloc frontmatter juste après un `---` configure **la slide suivante** (`layout: two-cols`, `layout: center`, `class:`, `transition:`).
- `::right::` sépare les colonnes dans `layout: two-cols`.
- Un commentaire HTML `<!-- ... -->` en fin de slide devient les **notes du présentateur**.
- Le markdown standard marche partout, y compris tableaux et blocs de code (coloration syntaxique native).

**Forces** : une charte = un thème, tous les decks suivent. Mode présentateur, notes, timer. Le markdown se versionne et se diffe. Export PPTX natif, donc le deck reste réutilisable par quelqu'un qui n'a que PowerPoint.

**Faiblesses** : Node et un `node_modules/` par deck (à gitignorer, le template le fait). Le PPTX exporté contient des **images de slides**, pas des formes éditables : personne ne pourra retoucher le texte dans PowerPoint. Les decks Slidev se ressemblent tant qu'on reste sur les thèmes du catalogue.

## 2 bis. frontend-slides, les decks one-shot

Plugin Claude Code (`frontend-slides@frontend-slides`), pas un CLI. Il ne s'invoque pas en shell : on le déclenche en demandant une présentation, il propose trois aperçus de style, on en choisit un, il écrit **un seul fichier HTML** avec CSS et JS inline. Zéro dépendance, zéro build, ouvrable dans n'importe quel navigateur.

Ce qu'il embarque : 34 templates dans `bold-template-pack/`, des presets de style (couleurs + polices Google, dans `STYLE_PRESETS.md`), des patterns d'animation, un `export-pdf.sh` et un `deploy.sh`.

Deux dépendances optionnelles, à n'installer qu'au moment où le besoin tombe :

- export PDF : Playwright (`npx playwright install chromium`).
- conversion d'un `.pptx` existant vers le web : `pip install python-pptx`.

**Forces** : le meilleur rapport effort/rendu pour un deck unique. Chaque deck est sur-mesure, donc aucun risque de ressembler à un template. Le livrable est un fichier, il se déplace et s'ouvre partout.

**Faiblesses** : le HTML produit est **figé et jetable**. Pas de source Markdown, pas de thème partagé, pas de mode présentateur ni de notes. Refaire un deck de la même famille six mois plus tard veut dire tout redemander. Pour imposer ta charte, il faut lui redonner ton preset à chaque fois.

## 3. Typst, les PDF composés

Un binaire, pas de LaTeX, pas de dépendance. Compile en millisecondes.

```bash
typst compile rapport.typ            # -> rapport.pdf
typst watch rapport.typ              # recompile a chaque sauvegarde
```

Squelette minimal :

```typst
#set page(paper: "a4", margin: 2.5cm, numbering: "1")
#set text(font: "Inter", size: 10pt, lang: "fr")
#set par(justify: true)
#show heading.where(level: 1): set text(size: 18pt, weight: 700)

= Titre du rapport
Corps du texte.

== Une section
#figure(table(columns: 2, [*a*], [*b*], [1], [2]), caption: [Une table])
```

**Forces** : contrôle typographique total (grilles, styles conditionnels via `#show`, variables, boucles, fonctions). Messages d'erreur lisibles, ce qui en fait le seul système de composition qu'un agent peut piloter sans tourner en rond. Reproductible : la même source rend le même PDF.

**Faiblesses** : **PDF uniquement**, pas de `.docx`. C'est un langage à apprendre, donc plus lent qu'un `pandoc` pour un besoin jetable. Les polices doivent être installées sur la machine (`typst fonts` liste ce qui est disponible), sinon Typst tombe sur une police de substitution sans prévenir.

## 4. Pandoc, les conversions

```bash
pandoc rapport.md -o rapport.docx                        # Word editable
pandoc rapport.md -o rapport.pdf --pdf-engine=typst      # PDF sans LaTeX
pandoc contrat.docx -o contrat.md                        # dans l'autre sens
pandoc rapport.md -o rapport.pptx                        # slides basiques
```

`--pdf-engine=typst` est **le réglage par défaut à utiliser ici** : sans lui, Pandoc cherche LaTeX, qui n'est pas installé (et pèse 2 Go). Typst l'est, la commande marche telle quelle. Vérifié le 2026-08-31.

Autres options qui servent :

- `--toc` table des matières, `--number-sections` numérotation.
- `--reference-doc=modele.docx` calque les styles d'un Word existant sur la sortie.
- `-V mainfont="Inter"` avec le moteur Typst pour changer la police.

**Forces** : lit et écrit à peu près tout. Zéro configuration pour un résultat correct. Le seul chemin vers un `.docx` réellement éditable.

**Faiblesses** : il **traduit, il ne compose pas**. Le rendu par défaut est neutre et le rester : styler un PDF Pandoc revient à écrire un template Typst ou LaTeX, autant faire du Typst directement. Les mises en page complexes (colonnes, encarts, grilles) ne survivent à aucune conversion.

## 5. Ce qu'il ne faut pas faire

- Ne pas installer LaTeX pour faire un PDF. `--pdf-engine=typst` couvre le besoin.
- Ne pas lancer `slidev` globalement sur un `slides.md` isolé : passer par le template et `npm install`.
- Ne pas promettre un PPTX éditable depuis Slidev, ce sont des images.
- Ne pas chercher à piloter frontend-slides en ligne de commande, c'est un skill, pas un binaire.
- Ne pas laisser le livrable fini dans le dossier de travail : le déplacer dans `deliverables/<domaine>/`.
- Ne pas committer `node_modules/` ni le PDF généré depuis le dossier d'un deck.
