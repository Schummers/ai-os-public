# 21 — Liens de résultats de recherche pour goals/notes/sources

**What to build:** Dans la recherche globale, cliquer un résultat de type task/project/content amène sur sa page dédiée. Un résultat de type goal, note ou source amène tous sur `/?goal=<slug>`, une URL qui atterrit sur la Daily View sans jamais appliquer de filtre — le clic ne mène nulle part d'utile. L'utilisateur doit pouvoir cliquer n'importe quel résultat de recherche et arriver sur quelque chose qui correspond à ce résultat.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Cliquer un résultat de recherche de type goal amène sur la vue Global filtrée par ce goal (pas sur Daily)
- [x] Cliquer un résultat de recherche de type note ou source amène sur une destination pertinente pour ce type (page dédiée si elle existe, sinon un point d'atterrissage cohérent — à trancher selon ce qui existe déjà pour ces types dans l'app)
- [x] Aucun résultat de recherche ne pointe plus vers une URL qui ignore silencieusement son propre paramètre
- [x] `npm run typecheck` et `npm test` passent

