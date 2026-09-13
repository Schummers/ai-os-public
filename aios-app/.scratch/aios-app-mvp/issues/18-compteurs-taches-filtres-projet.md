# 18 — Compteurs de tâches recalculés après filtrage dans l'accordéon projet

**What to build:** Quand un filtre (priorité/échéance/autonomie) est actif dans la vue Global, la liste de tâches affichée en dépliant une carte projet est déjà filtrée, mais le résumé "X doing · Y todo" dans l'en-tête de la carte reste celui du projet non filtré. L'utilisateur doit voir un compteur cohérent avec ce qu'il va effectivement lire en dépliant.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Le compteur "X doing · Y todo" affiché sur une carte projet reflète les tâches qui correspondent aux filtres actifs, pas le total brut du projet
- [x] Sans filtre actif, le compteur reste identique à aujourd'hui (comportement non régressé)
- [x] Le nombre de tâches terminées/abandonnées repliées derrière le compteur ("N tâches terminées") reste cohérent avec ce qui s'affiche en dépliant
- [x] Test couvrant : projet avec tâches de priorités mixtes, filtre "High pri" actif → le compteur de la carte ne montre que les tâches high
- [x] `npm run typecheck` et `npm test` passent

