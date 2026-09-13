---
name: validate-content-idea
description: Session de challenge qui fait passer une idée de contenu du backlog à la production — cadrage, trois angles, 5C, hook, outline. Use when the user wants to work an idea into something shootable ("on bosse cette idée", "je passe ça en production", "aide-moi à cadrer ce reel", "challenge cette idée"), or when they are about to film something that has never been packaged.
---

# Validate Content Idea

Faire passer un contenu de `content/idea/` à `content/production/`. C'est la seule porte entre
les deux : entrer en production **est** la validation, il n'existe pas d'état « approuvé ».

Le rôle ici est celui d'un **interviewer**, pas d'un rédacteur. La matière qui fait un bon
contenu vient de sa vie — un détail vu sur place, une contradiction vécue — et aucun modèle ne
peut la fournir. Chaque tour est une question qui va la chercher.

## Résolution du vault

Le vault est `$VAULT_PATH` si la variable est définie, sinon `~/AI OS/second-brain`. Tous les
chemins ci-dessous sont relatifs à cette racine. Ne jamais coder un autre chemin en dur.

## Avant de commencer

1. Lire `_agent/templates/content.md` — schéma canonique, source unique de vérité.
2. Lire le fichier de contenu visé dans `content/idea/`. Absent ou ambigu → demander lequel,
   en proposant les candidats du dossier.
3. Lire, si elles existent, la note de positionnement (marque, piliers) et la note du Content
   Framework dans `knowledge/notes/`. Elles portent son vocabulaire et ses piliers réels ;
   les critères ci-dessous ne sont que le repli quand elles manquent.

## Écriture incrémentale

**Chaque phase s'écrit dans le fichier dès qu'elle est finie**, pas à la fin de la session.
Une session de six phases sera interrompue, et une session interrompue qui ne laisse aucune
trace est un skill qu'on n'ouvre plus. Le fichier reste dans `content/idea/` pendant toute la
session : le déplacement est la seule action finale.

## Les six phases

### 1. Cadrage → section `## Packaging`

- **Intention** : `growth` (viralité, nouveaux abonnés), `nurture` (autorité, fidéliser la
  niche), `convert` (pousser à l'achat ou à l'action). Le même sujet tourné donne un traitement
  totalement différent selon l'intention, donc cette réponse précède tout le reste.
- **Audience** : niche ou grand public.
- **Piliers** : lesquels ce contenu coche, parmi ceux de sa note de positionnement. En dessous
  de deux piliers, demander ce que ce contenu fait dans son feed.

Écrire `intention:` dans le frontmatter et les trois réponses sous `## Packaging`.

### 2. Idéation → section `## Packaging`

Un même sujet donne plusieurs vidéos très différentes. **Elle en formule trois**, distinctes
par le traitement et pas seulement par le titre.

Le travail ici est de questionner jusqu'à ce que les trois existent : « qu'est-ce qui t'a
surprise sur place ? », « et si tu le montrais du point de vue de la vendeuse ? », « qu'est-ce
que tu as failli ne pas filmer ? ». Ses angles sortent de son vécu.

Critère de fin : trois angles écrits dans le fichier, chacun en une ou deux phrases, chacun
menant à un tournage différent.

Si elle bloque sec et demande explicitement des propositions, en donner — et le noter dans le
fichier, parce qu'un angle emprunté se repère plus tard à ses performances.

### 3. Sélection → section `## Packaging`

Un angle retenu, et **pourquoi les deux autres sont écartés**, écrit.

Les angles écartés qui tiennent debout seuls deviennent de nouveaux fichiers dans
`content/idea/` (via le même schéma). La session alimente le backlog au lieu de le vider.

### 4. Les 5C → section `## Packaging`

Sur l'angle retenu, une par une, **chacune répondue par une phrase et non par un oui** :

- **Clarté** — le message tient-il en une phrase ?
- **Cohérence** — aligné avec la marque et les piliers cochés en phase 1 ?
- **Créativité** — l'angle est-il frais par rapport à ce qui se fait déjà sur ce sujet ?
- **Contribution** — qu'est-ce que le spectateur apprend ou ressent ?
- **CTA** — qu'est-ce qu'il fait à la fin ?

Un C qui reçoit une réponse creuse est un C non validé : relancer dessus.

### 5. Hook → section `## Hook`

Pour `content_type: reel` — la métrique qui gouverne tout est le taux de rétention à 3
secondes. Quatre critères, tenus **simultanément dans les deux premières secondes** :

1. **Fonctionne en muet** — texte lisible dès la première frame, ou rupture visuelle (zoom,
   before/after, plan inattendu).
2. **Crée une tension** — curiosity gap, affirmation tranchée, ou contradiction.
3. **Spécifique** — « le truc que je fais à 21h47 » bat « 5 astuces pour mieux dormir ». La
   spécificité est le signal d'authenticité.
4. **Promet un pay-off que le contenu tient** — un hook qui ment fait scroller et se paie sur
   la portée suivante.

Pour `content_type: post | carousel` — le slide 1 doit donner envie de swiper, et le dernier
porter le CTA. Mêmes exigences de spécificité et de tension, sans la contrainte des 2 secondes.

Produire **deux variantes** à A/B tester : une **problème** (situation problématique en
ouverture, bascule en 3 secondes) et une **solution** (résultat d'abord, retour en arrière sur
le process). Les deux s'écrivent dans le fichier.

### 6. Outline → section `## Outline`

Structure textuelle : les sections, leur ordre, les points clés à couvrir, le timing estimé.
C'est ce sur quoi elle écrira son script seule, donc il doit tenir debout sans la conversation.

## Clôture

1. Basculer `stage: scripting` dans le frontmatter.
2. Déplacer le fichier de `content/idea/` vers `content/production/` (`git mv` ou `mv` — les
   wikilinks se résolvent par nom de fichier, rien ne casse).
3. Ajouter une ligne datée sous `## Journal`.
4. Créer les fichiers d'idées issus des angles écartés en phase 3.
5. Montrer le diff, le nouveau chemin, et les idées nées de la session.

## Hard Rules

- Une phase écrite avant de passer à la suivante.
- Le déplacement vers `content/production/` n'a lieu qu'après les six phases.
- Wikilinks Obsidian (`[[nom]]`) pour tout lien interne.
- Aucun champ de frontmatter hors schéma canonique.
- Ne jamais supprimer de fichier sans confirmation explicite.
