# 27 — Le chemin de la daily note suit l'arborescence mensuelle du vault

**What to build:** `lib/vault/daily.ts` et `lib/vault/dayplan.ts` lisent
`calendar/daily/{date}.md`. Le vault écrit `calendar/YYYY-MM/YYYY-MM-DD.md`
(vérifié : `second-brain/calendar/2026-08/`). Conséquence : la section « Focus
du jour » et la section « Journée » ne peuvent **jamais** s'afficher, quel que
soit le contenu du vault.

**Blocked by:** None.

**Status:** ready-for-agent

**Piège** : `daily.test.ts`, `dayplan.test.ts` et `search.test.ts` fabriquent
leurs fixtures dans `calendar/daily/`. Les tests sont donc verts en validant le
mauvais chemin. Corriger le code **et** les fixtures, sinon la suite reste verte
sur un bug. `search.ts` exclut `calendar/` de l'indexation : sa fixture est du
bruit, la déplacer ou la supprimer.

- [ ] Un helper partagé rend le chemin de la daily note d'une date donnée,
      utilisé par `daily.ts` et `dayplan.ts` (aujourd'hui la ligne est
      dupliquée dans les deux fichiers)
- [ ] Le chemin rendu est `calendar/{YYYY-MM}/{YYYY-MM-DD}.md`
- [ ] Les fixtures des trois tests sont déplacées dans l'arborescence mensuelle
- [ ] Un test échoue d'abord sur le vrai chemin (red), puis passe (green)
- [ ] Vérification manuelle sur le vault réel : la section Journée s'affiche
      quand la daily note du jour porte un `plan`
