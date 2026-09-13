---
name: create-content-idea
description: Capture une idée de contenu (reel, post, carrousel) dans le backlog du vault, en un seul coup, sans rien demander. Use when the user throws out a content idea ("idée de reel", "j'ai une idée de vidéo", "note ça pour un post", "faudrait que je filme ça"), or when a publishable idea surfaces mid-conversation and deserves to outlive it.
---

# Create Content Idea

Attraper une idée avant qu'elle s'évapore. Un message entrant, un fichier sortant.

Le geste est **rapide** : chaque question posée est une idée qui meurt avant d'exister. Tous
les champs sont optionnels, y compris le goal. Ce qui manque se remplira plus tard, dans
`validate-content-idea`, quand l'idée aura mérité qu'on s'y attarde.

## Résolution du vault

Le vault est `$VAULT_PATH` si la variable est définie, sinon `~/AI OS/second-brain`. Tous les
chemins ci-dessous sont relatifs à cette racine. Ne jamais coder un autre chemin en dur.

## Workflow

1. Lire `_agent/templates/content.md`. C'est le schéma canonique et la source unique de vérité
   pour le frontmatter — ne pas le reproduire de mémoire.

2. Déduire ce que le message contient, et rien de plus :
   - `name` : reformulation courte et lisible de l'idée.
   - `content_type` : « reel », « vidéo », « je filme » → `reel`. « carrousel », « slides » →
     `carousel`. « post », « photo » → `post`. Rien d'explicite → `reel`.
   - `intention` : `growth` si elle parle de toucher du monde ou de viralité, `nurture` si elle
     parle d'expliquer ou de montrer son savoir-faire, `convert` si elle parle de vendre ou de
     pousser à l'action. Rien d'explicite → `null`.
   - `series` : uniquement si elle nomme une série existante ou un « part 2 ».
   - `goal` : le goal actif de `knowledge/goals/` qui couvre la création de contenu, s'il y en a
     exactement un. Zéro ou plusieurs candidats → laisser vide.
   - Tout le reste → `null`.

   Un message qui contient plusieurs idées donne plusieurs fichiers.

3. Écrire `content/idea/<slug-kebab-case>.md` : frontmatter complet avec `status: idea`,
   `stage: null`, `created` à la date du jour, et le corps du template avec ses sections vides.
   Si le message porte un détail concret (un lieu, une accroche entendue, une image en tête),
   le mettre en une ligne sous `## Packaging` : c'est la matière que `validate-content-idea`
   exploitera, et elle se perd si on ne l'écrit pas maintenant.

4. Répondre par le chemin du ou des fichiers créés, sur une ligne. Terminer le tour.

## Hard Rules

- Aucune question à l'utilisateur : un champ vide est un résultat valide.
- Wikilinks Obsidian (`[[nom]]`) pour tout lien interne.
- Aucun champ de frontmatter hors schéma canonique.
- Un slug déjà pris → suffixer d'un `-2`, jamais écraser un fichier existant.
