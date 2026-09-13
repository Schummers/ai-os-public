# 23 — Daily View inclut les tâches dues/en retard hors projets actifs

**What to build:** La Daily View est censée montrer, en plus des tâches des projets actifs ("on"), toute tâche due aujourd'hui, en retard, ou en cours (doing) — même si son projet n'est pas "on" (ongoing/simmering/sleeping). Aujourd'hui seules les tâches des projets actifs remontent : une tâche due aujourd'hui sur un projet "sleeping" n'apparaît jamais dans la Daily View, alors que c'est justement le genre de chose que l'utilisateur ne doit pas rater.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Une tâche due aujourd'hui ou en retard, rattachée à un projet non-"on", apparaît dans "Tâches du jour" de la Daily View
- [x] Une tâche en statut "doing" apparaît dans la Daily View quel que soit le statut de son projet
- [x] Aucune tâche n'apparaît deux fois si elle correspond à la fois à un projet actif et au critère due/doing
- [x] Test couvrant explicitement le cas "tâche due aujourd'hui sur projet sleeping"
- [x] `npm run typecheck` et `npm test` passent

