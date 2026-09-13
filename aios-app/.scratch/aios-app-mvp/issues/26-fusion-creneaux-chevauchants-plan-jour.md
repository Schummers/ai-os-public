# 26 — Fusion des créneaux qui se chevauchent dans le plan du jour

**What to build:** Le calcul du temps occupé du plan du jour additionne la durée brute de chaque créneau, sans fusionner les créneaux qui se chevauchent dans les données sources. Deux créneaux qui se recouvrent partiellement font gonfler artificiellement le total "temps occupé" affiché à l'utilisateur, sans qu'aucun chevauchement ne soit signalé.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Le total "temps occupé" du plan du jour fusionne les intervalles qui se chevauchent avant de sommer, au lieu d'additionner des durées brutes qui peuvent se recouvrir
- [x] Un plan sans chevauchement produit exactement le même total qu'aujourd'hui (non régressé)
- [x] Test avec deux créneaux volontairement chevauchants (ex. 09:00-10:00 et 09:30-10:30) → le temps occupé compte 90 minutes, pas 120
- [x] `npm run typecheck` et `npm test` passent

