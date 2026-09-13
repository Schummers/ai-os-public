# Ce qui reste — plan de reprise

Mis à jour le 2026-08-24. Base git : `811c077`, sur `main` (la branche
`feature/daily-v2-et-design-system` a été fusionnée entre-temps).
`typecheck`, `test` (54/54), `build` verts, zéro erreur console.

## A. Terminé

Tickets 27, 28, 33 (session précédente), puis 30, 31, 32, 29 (cette session).
Tous les tickets du GOAL.md sont traités.

## B. Session « traduction » — ticket 30 — TERMINÉ (commit ca53bf2)

## C. Session « rituel du matin » — ticket 29 — TERMINÉ

Livrable dans `second-brain` (dépôt séparé), pas de commit aios-app :
`.claude/skills/morning-ritual/SKILL.md` écrit maintenant le contrat
`focus`/`proposals`/`plan`, ouvre l'app en tout début de phase 1
(`mcp__Claude_Browser__preview_start` ajouté à `allowed-tools` — c'est la
seule extension faite, jamais `send`/`delete`/`settings`/`gws *`), et gère le
cas d'une daily note sans frontmatter. Vérifié à la main sur la vraie daily
note du jour (`calendar/2026-08/2026-08-24.md`) — corps inchangé, rendu
confirmé dans l'app (section « Suggested focus » peuplée). **Non commité
dans second-brain** : ce dépôt a par ailleurs beaucoup de travail non lié
déjà en attente (inbox investissement, goals, hot.md), laissé intact —
décision de commit à l'utilisateur.

Dette adjacente identifiée (pas corrigée, hors périmètre) : le skill
`update-daily` crée des daily notes sans passer par
`_agent/templates/daily.md`, donc sans frontmatter. Le pas 0 de la Phase 1 du
rituel absorbe le cas quand il tourne après lui, mais le producteur
lui-même reste à corriger dans une session dédiée à `update-daily`.

## D. Session « retours visuels » — ticket 32 — TERMINÉ (commit 811c077)

Tous les points traités et vérifiés visuellement. Ceux qui demandaient un
arbitrage (pas de simple mécanique) — à confirmer par l'utilisateur à l'usage,
revenir dessus s'il n'est pas d'accord :

- `ProjectAccordion` : le lien texte « ↗ Page » est devenu une icône seule
  (`ExternalLink`) à côté du chevron.
- `TaskRow` (Daily) : l'icône crayon décorative (pas cliquable, mais lue
  comme un second bouton) est retirée. Un seul bouton par row (ouvrir la
  page tâche).
- `TaskCheckbox` : `dropped` a sa propre icône (croix) au lieu de partager
  la coche de `done`. `title` natif au survol pour les quatre statuts.
- Rail des goals : `ring-1` retiré (bordure colorée seule porte l'état
  actif) — supprime le risque de rognage, pas de palliatif à vérifier.

## E. Session « dette de code » — ticket 31 — TERMINÉ (commit 7aa7696)

- **`.glass`** : L'utilisateur penche pour le supprimer. Encore utilisé dans 12
  fichiers au 2026-08-24. Pas traité dans ce ticket — pas un nettoyage, un
  chantier. Recommandation inchangée : garder jusqu'à ce qu'il ait critiqué
  les vues de détail.

## Ordre recommandé

Plus rien de planifié dans `.scratch/aios-app-mvp/issues/`. Prochain sujet
probable, non ticketé : corriger `update-daily` (dette adjacente ci-dessus),
ou la question `.glass` une fois les vues de détail critiquées.

## Mise en garde héritée

Le sous-agent Spec d'une revue précédente a cité `docs/spec-mvp.md` disant
« port fixe ». Cette citation **n'existe pas**, vérifiée par grep. Ne pas la
reprendre.
