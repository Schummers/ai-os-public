# 20 — Cohérence des filtres priorité/échéance sur l'onglet Contenus

**What to build:** Sur l'onglet Contenus de la vue Global, seul le filtre Goal s'applique réellement — les pills "High pri" et "Aujourd'hui" restent affichées comme actives si elles l'étaient sur l'onglet Projets, alors qu'elles n'ont aucun effet sur la liste de contenus affichée. L'utilisateur ne doit jamais voir un filtre se afficher actif sans qu'il filtre quoi que ce soit.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Sur l'onglet Contenus, les pills de filtres qui n'ont pas de sens pour ce type de donnée (priorité, échéance, autonomie tâche) ne s'affichent plus comme actives
- [x] Basculer de Projets (avec High pri actif) vers Contenus ne laisse pas croire que la liste de contenus est filtrée par priorité
- [x] Revenir sur l'onglet Projets restaure l'état actif du filtre tel qu'il était (pas de perte d'état)
- [x] `npm run typecheck` et `npm test` passent

