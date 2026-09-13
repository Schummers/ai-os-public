---
type: content
name: Nom Lisible Du Contenu
content_type: reel
status: idea
stage: null
intention: null
goal: '[[goal-existant]]'
series: null
film_date: null
publish_date: null
content_folder: null
created: YYYY-MM-DD
---

# Nom Lisible Du Contenu

## Packaging

## Hook

## Outline

## Script

## Storyboard

## Préparation

- [ ] Tenue / outfit préparé
- [ ] Makeup / hair plan
- [ ] Props / accessoires rassemblés
- [ ] Script accessible
- [ ] Caméra chargée
- [ ] Micro testé
- [ ] Lumière setup
- [ ] Décor / background préparé
- [ ] B-roll identifié
- [ ] Lieu identifié

## Tâches liées

## Notes liées

## Journal

<!--
SCHEMA CANONIQUE CONTENT — source unique de vérité. Les skills pointent ici.

Un `content` est une unité de production publiable : un reel, un post, un carrousel.
C'est un type de premier niveau, frère de `project`, pas une tâche et pas un projet.
Il a un pipeline de fabrication propre, des dates de tournage et de publication, et
un dossier de rushes.

Champs frontmatter :
- type: toujours `content`
- name: nom lisible, avec majuscules et espaces
- content_type: reel | post | carousel
- status: idea | production | published | archive — DOIT correspondre au dossier
  content/<status>/ où vit le fichier
- stage: packaging | scripting | ready-to-film | filmed | editing | complete | scheduled
  Uniquement quand `status: production`. `null` partout ailleurs.
- intention: growth | nurture | convert
  growth = viralité, nouveaux followers. nurture = autorité, fidéliser la niche.
  convert = pousser à l'achat ou à l'action.
- goal: wikilink vers un goal EXISTANT de knowledge/goals/ (vérifier qu'il existe).
  Laisser vide plutôt que d'inventer un goal : un goal se construit en coaching
  (skill create-goal), jamais comme un formulaire.
- series: texte libre pour regrouper des contenus liés ("One day in Lisbon").
  Ce n'est pas une entité, il n'y a pas de fichier série.
- film_date / publish_date: YYYY-MM-DD, null si non planifié
- content_folder: lien file:// vers le dossier local des rushes et fichiers de travail
- created: YYYY-MM-DD

Règles :
- Fichier dans content/<status>/<slug-kebab-case>.md
- LES STAGES NE SONT PAS UNE SÉQUENCE. On filme parfois avant d'écrire, et on écrit
  parfois à partir des rushes. Une gate valide « ce qui doit exister à ce stade
  existe-t-il », jamais « as-tu fait l'étape d'avant ». Refuser `filmed` parce que
  `packaging` n'est pas fait est un bug, pas une protection.
- Entrer dans production/ EST la validation de l'idée : il n'y a pas de stage
  « approved ». Le premier stage est `packaging`, et c'est le skill
  validate-content-idea qui l'accomplit puis bascule en `scripting`.
- Pas de champ description, pas de booléens qualité, pas de pillars, pas de niche.
  La réflexion vit dans le corps (## Packaging), écrite par validate-content-idea.
  Un champ existe pour être requêté ; personne ne requête « les contenus dont la
  créativité est fausse ».
- Le corps liste les tâches et notes liées en wikilinks ; les tâches vivent dans
  projects/tasks/, jamais ici
- Journal : une ligne datée par événement significatif
- Après création : ajouter le contenu à index.md (section Content) si durable

Skills :
- create-content-idea : capture rapide dans content/idea/, ne pose aucune question
- validate-content-idea : idea/ → production/, remplit Packaging, Hook, Outline
- unblock-content : diagnostic quand ça coince, à n'importe quel stage
-->
