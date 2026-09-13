---
type: task
name: Nom Lisible De La Tâche
project: '[[projet-parent]]'
goal: '[[goal-existant]]'
content: null
status: todo
priority: medium
assignee: <utilisateur>
autonomy: assist
blocked_by: []
created: YYYY-MM-DD
---

# Nom Lisible De La Tâche

## Contexte

## Solution proposée

## Critères de succès

- [ ] Critère 1

## Journal

<!--
SCHEMA CANONIQUE TÂCHE — source unique de vérité. Les skills pointent ici.

Champs frontmatter :
- type: toujours `task` (clé `effort:` bannie, remplacée par `project:` depuis 2026-07-24)
- name: nom lisible, avec majuscules et espaces
- project: wikilink vers le projet parent dans projects/<status>/ (vérifier qu'il existe)
- goal: wikilink vers un goal EXISTANT de knowledge/goals/ (normalement le même que celui du projet parent)
- content: wikilink vers un contenu de content/production/ quand la tâche sert une vidéo ou un
  post précis (tourner, monter, écrire la caption). `null` sinon. Une tâche porte `project:` ou
  `content:`, pas les deux : un contenu n'est pas un projet.
- status: todo | doing | done | dropped
- priority: low | medium | high
- assignee: <utilisateur> | <collaborateur>
- autonomy: assist (l'agent peut exécuter avec l'utilisateur) | ask (confirmation explicite requise, ex: destructif)
- blocked_by: liste de wikilinks vers les tâches qui DOIVENT être finies avant celle-ci.
  `[]` = frontière, peut démarrer immédiatement.
  Exemple : blocked_by: ['[[autre-tache]]', '[[encore-une]]']
- created: YYYY-MM-DD

Règles :
- Fichier dans projects/tasks/<slug-kebab-case>.md — les tâches sont atomiques, jamais dans le dossier projet
- Une tâche = une tranche complète et vérifiable seule, dimensionnée pour une session fraîche (tracer bullet)
- Critères de succès = cases à cocher observables, c'est le contrat de done
- Journal : une ligne datée par événement
- Après création : ajouter la tâche dans "## Tâches liées" du projet parent
-->
