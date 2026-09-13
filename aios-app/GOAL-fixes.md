# GOAL — Corriger les bugs trouvés en revue manuelle (tickets 16-26)

Autorités : `docs/spec-mvp.md` (quoi/pourquoi de l'app), `.scratch/aios-app-mvp/issues/16-*.md` à `26-*.md` (le découpage à traiter), `DESIGN.md` (comment visuel). En cas de contradiction : la spec tranche, le ticket argumente, ton jugement règle le reste.

Ces tickets viennent d'une revue manuelle en navigateur (pas d'une nouvelle feature) : chaque bug a été constaté en direct, pas seulement lu dans le code. Vérifie donc toi aussi en navigateur avant de considérer un ticket fini, pas seulement au typecheck/build.

Travaille sur la branche `feature/mvp-tickets`, déjà créée à partir de `main` : vérifie que tu y es avant le premier commit, n'en crée pas d'autre. Ne touche pas aux tickets `00`-`15`, déjà `complete` dans le ledger.

## Destination

Chaque ticket `ready-for-agent` de `.scratch/aios-app-mvp/issues/16-*.md` à `26-*.md` porte une ligne `complete` dans `.scratch/aios-app-mvp/progress.md`, nommant son commit, une fois ses cases cochées. Fini = ledger à jour, pas "le code semble marcher".

## Boucle

Pour chaque ticket, dans l'ordre ci-dessous :

1. Note le SHA courant (`git rev-parse HEAD`) dans le ledger avant de commencer.
2. Lis le fichier de ticket en entier, plus `docs/spec-mvp.md` et `DESIGN.md` si le ticket touche à l'UI.
3. Implémente uniquement ce que ce ticket demande — ne corrige pas d'autres bugs au passage, même si tu les remarques (note-les dans le ledger sous `Vu en passant — <quoi>` sans les corriger).
4. Ajoute ou adapte les tests là où la passerelle vault (`lib/vault/`) est concernée — c'est le seul seam testé de ce projet, voir `docs/spec-mvp.md` section Testing Decisions.
5. Fais tourner `npm run typecheck` et `npm test` (39 tests existants avant ce lot, ne doivent jamais régresser) — les deux doivent passer.
6. Si le ticket touche un composant visible (UI, pas seulement `lib/vault/`), lance l'app (`npm run dev`) et vérifie dans un vrai navigateur que le comportement décrit par les critères d'acceptation est bien observable — pas juste que ça compile.
7. Un commit conventional (`fix:` dans la plupart des cas ici) par ticket, message décrivant le comportement corrigé.
8. Relis ton propre diff contre les critères d'acceptation du ticket, coche les cases dans le fichier de ticket.
9. Écris la ligne `complete` + SHA dans le ledger.

Frontière vide (tous les tickets 16-26 à `complete`) : relis l'ensemble du diff de la branche pour ce lot une dernière fois, puis rends la main.

## Rulings, pas d'arrêts

Décide les ambiguïtés, journalise chaque décision dans le ledger comme `Ruling — <quoi> — <pourquoi> — <coût si faux>`, continue. Seuls 4 cas t'arrêtent : opération destructive, action sensible sécurité (secrets, tokens), effet de bord hors du repo (push, merge partagé, publish), ticket cassé au point que tout chemin est une devinette.

Le ticket 20 (cohérence filtres Contenus) contient une décision produit non tranchée par l'utilisateur ("filtrer réellement, ou juste arrêter d'afficher les pills comme actives") : pars sur la seconde option (moins de scope, ticket 20 le note déjà comme défaut), journalise ce choix comme Ruling.

Le ticket 21 (liens de recherche goals/notes/sources) laisse un choix ouvert pour notes/sources ("page dédiée si elle existe, sinon atterrissage cohérent") : vérifie d'abord si `/contents/[slug]`-like routes existent pour ces types avant de décider, journalise le choix.

## Garde-fous

- Vault (`~/AI OS/second-brain`) en lecture seule stricte, même pendant les tests : fixtures jetables uniquement, jamais d'écriture sur le vrai vault.
- Le ticket 25 touche à l'unique surface d'écriture de l'app (édition rapide de tâche) : teste bien le chemin d'écriture sur des fixtures, jamais sur le vault réel.
- Jamais de commit sur une branche partagée sans demander. Pas de push, pas de force-push, pas de `git reset --hard`.
- Aucun secret dans un fichier commité.
- Un commit par ticket — ne regroupe pas plusieurs tickets dans un seul commit, même s'ils semblent liés.

## Ordre et risque de conflit

Ordre libre en soi (aucun ticket n'est `Blocked by` un autre), mais **21 et 22 touchent tous les deux `lib/vault/search.ts`** (fonctions différentes, `getAppUrl` vs `inferTypeFromPath`/`normalizeEntityType`) : traite-les l'un après l'autre, pas en parallèle si tu dispatches plusieurs agents, pour éviter un conflit de merge inutile.

Suggestion d'ordre, du plus isolé au plus transverse : `17 → 19 → 24 → 26 → 18 → 20 → 16 → 23 → 22 → 21 → 25`.

## Hors périmètre

N'implémente rien qui ne soit pas listé dans un des 11 tickets 16-26. Pas de refonte, pas de nettoyage adjacent, pas de nouvelle feature. Détail du périmètre produit global : `docs/spec-mvp.md`, section "Out of Scope".
