---
type: goal
name: Nom Lisible Du Goal
status: active
priority: null
created: YYYY-MM-DD
target_date: YYYY-MM-DD
review_cadence: weekly
last_reviewed: null
health: unknown
tags: []
---

# Nom Lisible Du Goal

> Vision en une phrase.

---

## G — GOAL

### Le Quoi (Spécifique & Mesurable)

### Le Pourquoi (Motivation Intrinsèque)

### Anti-Goals (Contraintes & Garde-fous)

---

## P — PLAN

### Diagnostic (Rumelt)

### 3-5 Major Moves

### Test de Réalisme
- En théorie, ce plan mène-t-il au goal ? → __/100
- En pratique, vais-je suivre ce plan ? → __/100
- Si l'un des deux est < 80 → simplifier le plan.

### Crystal Ball (Top 3 Raisons d'Échec + Mitigations)

---

## S — SYSTEM

### Tracking (Métriques & KPIs)
| Métrique | Objectif | Fréquence | Actuel |
|----------|----------|-----------|--------|

### Reminders

### Accountability

---

## Systems & Workflows

## Projets liés

## Tâches liées

## Notes liées

## Sources liées

## Review Log

<!--
SCHEMA CANONIQUE GOAL — source unique de vérité. Les skills pointent ici.
Structure G/P/S issue de la méthode GPS (Ali Abdaal) enrichie Rumelt/Ferriss/EBM/Hormozi.
Voir [[methode-gps-ali-abdaal]], [[ma-vision-goal-setting]].

Champs frontmatter :
- type: toujours `goal`
- name: nom lisible
- status: active | inactive | achieved | archived
- priority: rang numérique, 1 = priorité absolue. UNE SEULE priorité 1 à la fois
  (règle de concentration d'Hormozi). null = non priorisé.
- created / target_date: YYYY-MM-DD. Les goals vivent en cycle trimestriel :
  target_date alignée sur une fin de trimestre par défaut.
- review_cadence: weekly | biweekly | monthly | quarterly
- last_reviewed: date de la dernière review (les skills la comparent à la cadence)
- health: on-track | at-risk | blocked | unknown
- tags: liste plate kebab-case

Règles :
- Fichier dans knowledge/goals/<slug-kebab-case>.md
- Un goal ne se remplit JAMAIS comme un formulaire vide : il se construit en
  coaching conversationnel (skill create-goal)
- Les projets pointent vers le goal via leur champ `goal:`, jamais l'inverse en dur :
  les sections liées se remplissent par wikilinks au fil de l'eau
- Review Log : une entrée datée par review — observation, health, décision
- Changer status ou priority = décision de l'utilisateur, jamais d'un skill seul
- Après création : ajouter le goal à index.md (section Goals) et à _agent/hot.md
-->
