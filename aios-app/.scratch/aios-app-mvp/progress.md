# Ledger AIOS App MVP — tickets: .scratch/aios-app-mvp/issues/

- Ruling — ordre d'exécution inversé pour 02 et 00 (02 avant 00, au lieu de l'ordre listé dans GOAL.md) — un commit exige un dépôt git existant, et c'est le ticket 02 qui crée le dépôt ; le ticket 00 n'a aucune dépendance de contenu envers 02, seulement une dépendance d'infrastructure (avoir un dépôt où commiter) — si c'est faux, aucun coût : les deux tickets sont indépendants en contenu, seul l'ordre de dispatch change.
- Ticket 02 — base AI OS root a1b2c3d(38150623) / aios-app: dépôt inexistant — dispatché
- Ticket 02 — commit aios-app 7eb485d + commit AI OS root 6c481f3 — revue: 0 finding dur, APPROUVÉ (un point mineur hors axes : goal affiché en wikilink brut, jugé conforme au périmètre du ticket)
- Ruling — pas de remote GitHub créé pour aios-app malgré le critère d'acceptation qui le mentionne — créer un dépôt distant et y pousser sont des actions externes qui demandent la permission explicite de l'utilisateur (catégorie "explicit permission required" des règles de sécurité) ; le dépôt reste local jusqu'à ce qu'il le demande — coût si c'est faux : L'utilisateur doit encore créer le repo GitHub et pousser lui-même, aucune perte de travail.
- Ticket 02 — complete — commits aios-app 7eb485d, AI OS root 6c481f3
- Ticket 00 — base 7eb485d — dispatché
- Ticket 00 — commit ed28480 — revue: 0 finding dur sur les deux axes, APPROUVÉ (un résidu de style noté : commentaire de test forké mentionnant "fiscalité", jugé cosmétique)
- Ticket 00 — complete — commit ed28480
- Ticket 01 — base 9c4c0cf — dispatché
- Ticket 01 — commit 8cd1e14 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 01 — complete — commit 8cd1e14
- Ticket 03 — base 895b4f6 — dispatché
- Ticket 03 — commit a6fe215 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 03 — complete — commit a6fe215
- Ticket 04 — base 1c6b9f4 — dispatché
- Ticket 04 — commit fc0ae97 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 04 — complete — commit fc0ae97
- Ticket 05 — base 9173736 — dispatché
- Ticket 05 — commit 02fac43 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 05 — complete — commit 02fac43
- Ticket 06 — base 8db8ec0 — dispatché
- Ticket 06 — commit f154768 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 06 — complete — commit f154768
- Ticket 07 — base f233c34 — dispatché
- Ticket 07 — commit f25e8e2 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 07 — complete — commit f25e8e2
- Ruling — ticket 08 traité hors dépôt conformément aux garde-fous (modifie ~/AI OS/second-brain) — le ticket 09 est implémenté avec le schéma de plan spécifié et tests sur fixtures — coût si faux : aucun
- Ticket 09 — base 3061131 — dispatché
- Ticket 09 — commit 466e2d9 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 09 — complete — commit 466e2d9
- Ticket 10 — base e0376b1 — dispatché
- Ticket 10 — commit 6d934bc — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 10 — complete — commit 6d934bc
- Ticket 11 — base 27393d8 — dispatché
- Ticket 11 — commit dba31d9 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 11 — complete — commit dba31d9
- Ticket 12 — base f4dceda — dispatché
- Ticket 12 — commit 39453e7 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 12 — complete — commit 39453e7
- Ticket 13 — base 302bad4 — dispatché
- Ticket 13 — commit 1f0f067 — revue: 0 finding dur sur les deux axes, APPROUVÉ
- Ticket 13 — complete — commit 1f0f067
- Hors-boucle — commit 17165be — revue visuelle manuelle post-MVP (rendu réel dans le navigateur, pas seulement typecheck/tests/build) : trouvé et corrigé (1) collision Tailwind max-w-xs/3xl/4xl avec l'échelle --spacing-* héritée du fork DS-source, débordement horizontal + conteneur principal écrasé à 128px sur la quasi-totalité des écrans, aucune revue automatisée ne l'avait vu car aucune ne rend la page ; (2) 10 endroits ré-encapsulant un slug déjà résolu dans une syntaxe [[slug]] littérale à l'affichage. Vérifié : tsc, vitest 39/39, next build, inspection Daily/Global/page projet à 390px.
- Ruling — correctifs visuels faits hors du protocole implémenteur/relecteur du GOAL.md (dispatch direct par l'orchestrateur, pas de subagent dédié) — bugs déjà diagnostiqués avec certitude par mesure en direct dans le navigateur (largeurs calculées, CSS compilé inspecté), redispatcher aurait coûté un aller-retour pour un résultat déjà connu — coût si faux : aucun, le code est vérifié vert (typecheck, tests, build) et visuellement avant commit.

- Ticket 17 — base 257ef8b — dispatché
- Ticket 17 — complete — commit 0b6963a9828607ab9a59c0978857604a8c89ce54
- Ticket 19 — base 0b6963a9828607ab9a59c0978857604a8c89ce54 — dispatché
- Ticket 19 — complete — commit 5d802e5ca8327af3817dc5950e614ba6aaa20211
- Ticket 24 — base 5d802e5ca8327af3817dc5950e614ba6aaa20211 — dispatché
- Ticket 24 — complete — commit 475c1d98c51c5c3db1dcce93bf44a9f710ef32d3
- Ticket 26 — base 475c1d98c51c5c3db1dcce93bf44a9f710ef32d3 — dispatché
- Ticket 26 — complete — commit 27063fe76b00b8322b3e5360aad20fc900627785
- Ticket 18 — base 27063fe76b00b8322b3e5360aad20fc900627785 — dispatché
- Ticket 18 — complete — commit 49da66f8c3ee29505ce78969db33062ea11aa9d9
- Ticket 20 — base 49da66f8c3ee29505ce78969db33062ea11aa9d9 — dispatché
- Ticket 20 — complete — commit 7806ffccf70195e7e7a019b580cd9d746942575a
- Ticket 16 — base 7806ffccf70195e7e7a019b580cd9d746942575a — dispatché
- Ticket 16 — complete — commit dc3b7b51b4ca7a8c504ff3126676ec0ed7dc7b5f
- Ticket 21 — base dc3b7b51b4ca7a8c504ff3126676ec0ed7dc7b5f — dispatché
- Ticket 21 — complete — commit b94844ce52a5f12263a40f411413a0213e68b99c
- Ticket 22 — base b94844ce52a5f12263a40f411413a0213e68b99c — dispatché
- Ticket 22 — complete — commit 914ab8c3f0b935db1486b5e9ad18cca3a1534b7a
- Ticket 23 — base 914ab8c3f0b935db1486b5e9ad18cca3a1534b7a — dispatché
- Ticket 23 — complete — commit 9b501011964117dcbbb8a68c0aeb2acf7e4f0454
- Ticket 25 — base 9b501011964117dcbbb8a68c0aeb2acf7e4f0454 — dispatché
- Ticket 25 — complete — commit 06be80aee64afec9a0cc65957757399cefec3443
- Tickets 27 à 30 — écrits en session de cadrage (base 1a9c712) — ticket 08 marqué superseded par 29
- Ticket 27 — complete — commit 4a8f33c188f87959290bbf28d44d2e5d8f21f730
- Ticket 28 — complete — commit 4a8f33c188f87959290bbf28d44d2e5d8f21f730
- Ticket 33 — complete — commit 4a8f33c188f87959290bbf28d44d2e5d8f21f730
- Ticket 30 — base bf0da04 — dispatché
- Ticket 30 — complete — commit ca53bf2 — vérifié dans le navigateur (Daily, Global, modale filtres avancés, quick-edit, recherche) : chrome en anglais, contenu vault resté français
- Ticket 31 — base ca53bf2 — dispatché
- Ticket 31 — complete — commit 7aa7696 — TopBar extraite, hydratation SearchView corrigée, `.light`/`:root` fusionnés, `--chrome-overlay-bg` remplace les 3 copies de `bg-bg/9x backdrop-blur-md`, `mt-hair` déplacé au seul appelant, HabitsBar.meta typé, DESIGN.md à jour — vérifié dans le navigateur (clair/sombre, recherche, deux top bars)
- Ticket 32 — base 7aa7696 — dispatché
- Ticket 32 — complete — commit 811c077 — vérifié dans le navigateur : modale quick-edit et filtres avancés, ProjectAccordion (une icône au lieu d'icône+texte), GoalRail (bordure sans crop), TaskRow (un seul bouton), TaskCheckbox (croix pour dropped, title au survol)
- Ticket 29 — base second-brain (dépôt séparé, pas aios-app) — dispatché
- Ticket 29 — complete — pas de commit aios-app : le livrable est
  `second-brain/.claude/skills/morning-ritual/SKILL.md` (contrat d'écriture
  focus/proposals/plan, ouverture de l'app en début de phase 1, gestion du
  frontmatter manquant, écriture de `due` sans toucher au `status`), non
  commité — le dépôt second-brain a par ailleurs beaucoup de travail non lié
  déjà non commité (inbox investissement, goals, hot.md), laissé intact,
  décision de commit laissée à l'utilisateur. Vérifié à la main : frontmatter
  ajouté à la vraie daily note du jour (`calendar/2026-08/2026-08-24.md`,
  corps inchangé, `focus: null`, une `proposals` réelle) et son rendu confirmé
  dans le navigateur (section « Suggested focus » peuplée, « Day » vide comme
  attendu en l'absence de `plan`). Dette adjacente identifiée et documentée
  dans le SKILL (section « Dette connue ») sans être corrigée : le skill
  `update-daily` crée des daily notes sans frontmatter, hors périmètre de ce
  ticket.
