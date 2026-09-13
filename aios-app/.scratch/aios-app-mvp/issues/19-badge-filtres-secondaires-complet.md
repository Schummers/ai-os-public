# 19 — Badge filtres secondaires reflète tous les filtres actifs

**What to build:** Le bouton "Filtres avancés" affiche un badge numérique quand des filtres secondaires sont actifs. Aujourd'hui ce compteur ne compte que l'autonomie, alors que la modale propose aussi le statut projet (ongoing/simmering/sleeping) et l'échéance (en retard/cette semaine) comme filtres secondaires. L'utilisateur doit toujours savoir d'un coup d'œil si un filtre secondaire, quel qu'il soit, est actif.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Le badge du bouton filtres secondaires compte l'autonomie, le statut projet secondaire (ongoing/simmering/sleeping) et l'échéance secondaire (en retard/cette semaine)
- [x] Il ne compte pas les filtres déjà visibles en barre principale (Actifs on / High pri / Aujourd'hui), pour éviter un double comptage
- [x] Test : activer uniquement "ongoing" en filtre secondaire → le badge affiche 1
- [x] `npm run typecheck` et `npm test` passent

