# AIOS App

Application Next.js locale qui lit le vault (`second-brain/`) sur disque et le
rend sous forme de tableau de bord, taillée pour tenir dans le panneau droit
de Claude Code. Source de vérité produit : `docs/spec-mvp.md`.

## Plan and repo

GitHub plan, **dans le repo `ai-os` lui-même** — pas un repo imbriqué, pas un
domaine. Seuls `node_modules/`, `.next/` et le `tsbuildinfo` sont gitignorés.

Ce dossier a d'abord été créé comme un domaine avec son propre remote
(`Schummers/aios-app`), et c'était une erreur de classification. Un domaine est
un espace de travail personnel (immobilier, cycling) ; cette app est une
**surface système sur le vault**, au même titre que les skills de
`system/skills/vault-session/`. Deux conséquences concrètes ont tranché
(2026-08-26) :

- Elle partage un contrat avec le skill `morning-ritual` : les clés `focus`,
  `proposals` et `plan` du frontmatter de la daily note. Ce contrat était
  versionné dans deux repos indépendants, sans rien pour les faire s'accorder.
- Un fork de `ai-os` ne pouvait pas récupérer l'app : elle vivait dans un repo
  privé séparé auquel le fork n'a pas accès. Un seul `git pull` doit ramener
  le système, les skills et l'app ensemble.

L'historique du repo autonome est préservé : il a été importé ici via
`git subtree add`. `Schummers/aios-app` ne reçoit plus rien.

## Structure

- `docs/spec-mvp.md` — la spec produit complète (user stories, décisions
  d'implémentation, périmètre d'écriture, tests, hors-périmètre). Autorité
  unique sur le quoi et le pourquoi ; en cas de doute, elle tranche.
- `wireframes/` — `wireframes.html` (7 écrans) et `labo.html` (les forks
  tranchés). Référence visuelle, pas du code exécutable.
- `.scratch/aios-app-mvp/` — le découpage en tickets exécutables
  (`issues/NN-slug.md`) et le ledger d'avancement (`progress.md`). Ce n'est
  pas du scratch jetable : ce sont les tickets du projet, versionnés comme le
  reste.
- `GOAL.md` — brief d'exécution pour l'agent orchestrateur qui dispatche les
  tickets. Pas un goal du second brain.
- `app/`, `lib/`, `package.json`, config Next/TypeScript — l'application
  elle-même, créée au fil des tickets. `lib/vault/` porte la passerelle vault :
  fonctions pures qui lisent le disque et rendent le modèle de domaine, seul
  seam testé (voir `docs/spec-mvp.md`, section Testing Decisions).

## Vault

Le vault (`$VAULT_PATH`, défaut `~/AI OS/second-brain`) est lu là où il est,
jamais dupliqué ni importé. L'app y est en lecture seule, sauf les quatre
champs de tâche listés dans la spec (`status`, `priority`, `due`,
`autonomy`) — aucune écriture n'existe avant le ticket qui l'implémente
explicitement.
