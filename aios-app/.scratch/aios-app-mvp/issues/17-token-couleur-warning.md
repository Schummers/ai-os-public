# 17 — Token couleur `--warning` manquant dans le design system

**What to build:** Les badges "priorité medium" et les signaux d'inactivité/retard (⚠️) sont censés apparaître en ambre pour se distinguer du "high" (rouge) et du texte neutre. Actuellement ils rendent en blanc/transparent partout dans l'app, car la variable CSS `--warning` n'existe pas alors que `bg-warning`/`text-warning`/`border-warning` sont utilisés dans plusieurs composants.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Une variable de couleur "warning" (ambre) est définie dans le design system, pour le mode light et le mode dark, suivant le même patron que `--danger`/`--positive`
- [x] Elle est exposée côté Tailwind pour que les classes `bg-warning`, `text-warning`, `border-warning` (et leurs variantes d'opacité `/10`, `/20`) produisent effectivement de la couleur
- [x] Vérification visuelle en navigateur (pas seulement au build) : badge priorité "medium", signal d'inactivité/retard, et point d'idée en attente rendent bien en ambre dans Daily et Global, en light et en dark
- [x] `npm run typecheck` et `npm run build` passent

