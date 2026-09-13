# GOAL — Construire AIOS App jusqu'au MVP

Autorités : `docs/spec-mvp.md` (quoi/pourquoi), `.scratch/aios-app-mvp/issues/` (découpage), `DESIGN.md` (comment visuel). En cas de contradiction : la spec tranche, le ticket argumente, ton jugement règle le reste.

Tickets 00 et 02 sont déjà `complete` dans le ledger — ne les redispatche pas. Travaille sur la branche `feature/mvp-tickets`, déjà créée à partir de `main` : vérifie que tu y es avant le premier commit, n'en crée pas d'autre.

## Destination

Chaque ticket `ready-for-agent` de `.scratch/aios-app-mvp/issues/` porte une ligne `complete` dans `.scratch/aios-app-mvp/progress.md`, nommant son commit. Fini = ledger à jour, pas "le code semble marcher".

## Boucle

1. Frontière = tickets `ready-for-agent` dont tous les `Blocked by:` sont `complete` dans le ledger.
2. Prends le plus petit numéro. Note le SHA courant dans le ledger.
3. Invoque `/mattpocock-skills:implement` sur ce ticket seul, en lui donnant le chemin du fichier de ticket + `docs/spec-mvp.md` + `DESIGN.md`. TDD au seam de la passerelle vault, typecheck + suite complète, un commit conventional par ticket.
4. Invoque `/mattpocock-skills:code-review` avec le SHA noté comme point fixe et le fichier de ticket comme source de spec.
5. Findings : jusqu'à 3 rondes de correction (relance `/implement` sur les findings, puis re-review). Round 4 non atteint : arrête-toi et rapporte.
6. Coche les critères du ticket, écris la ligne `complete` + SHA dans le ledger.
7. Recommence depuis 1.

Frontière vide : lance une revue large de toute la branche, puis rends la main.

## Rulings, pas d'arrêts

Décide les ambiguïtés, journalise chaque décision dans le ledger comme `Ruling — <quoi> — <pourquoi> — <coût si faux>`, continue. Seuls 4 cas t'arrêtent : opération destructive, action sensible sécurité (secrets, tokens), effet de bord hors du repo (push, merge partagé, publish), ticket cassé au point que tout chemin est une devinette.

## Garde-fous

- Tickets 14 et 15 sont `needs-info` : ne les dispatche jamais, ce sont des décisions de l'utilisateur (schéma KPI goal, schéma habitudes).
- Ticket 08 modifie `~/AI OS/second-brain`, pas ce repo : à traiter à part, jamais depuis ce dépôt.
- Vault (`~/AI OS/second-brain`) en lecture seule stricte, même pendant les tests : fixtures jetables uniquement.
- Jamais de commit sur une branche partagée sans demander. Pas de push, pas de création de repo GitHub distant.
- Aucun secret dans un fichier commité.
- Un commit par ticket.

## Ordre

`01 → 03 → 04 → 05 → 06 → 07 → 09 → 10 → 11 → 12 → 13`, avec `08` en dehors (autre repo, à faire avant `09`).

## Hors périmètre

Pas d'habitudes fonctionnelles, pas de métrique de goal saisie à la main, pas d'appel direct à Google Calendar (lecture de `plan:` uniquement). Détail complet : `docs/spec-mvp.md`, section "Out of Scope".
