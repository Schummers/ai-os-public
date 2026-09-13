# 32 — Retours visuels : modales, accordéon, rails, affordances

**What to build:** Les retours de l'utilisateur sur l'interface, non traités,
formulés lors des sessions des 2026-08-23 et 24. Chaque point demande un
arbitrage visuel : **vérifier dans le navigateur, ne pas se fier au build**.

**Blocked by:** 31 (base propre, `TopBar` extraite).

**Status:** ready-for-agent

Par ordre de gêne décroissante :

- [ ] `TaskQuickEditModal` — UI et espacements à refaire. Verbatim : « pas
      folle ».
- [ ] Modale « Filtres avancés » — ne respecte pas le design system
      (espacements).
- [ ] `ProjectAccordion` — trop de boutons d'action (chevron + « Page »), on
      se perd. À simplifier.
- [ ] Rail des goals — l'état actif est « croppé en haut » au clic. Un
      palliatif est posé (`py-2xs` sur le scroller) mais n'a **jamais été
      vérifié visuellement**, et le `ring-1` reste suspect.
- [ ] Les deux boutons d'action d'une row de tâche (`TaskRow`) — agrandis à
      28px, à re-juger. L'utilisateur évoquait un seul bouton par ligne.
- [ ] États de la case à cocher pas auto-explicites : il a fini par déduire
      que le tiret vaut `doing` et le barré `done`/`dropped`.
- [ ] Le bouton « Effacer » de `GlobalFilterBar` est du texte nu au milieu
      d'une rangée de pills.

## Règle de couleur à respecter

Les couleurs sémantiques (vert/orange/rouge) sont réservées aux **alertes**
(priorité, retard, blocage). L'accent est réservé à l'**interaction**. Ne pas
teindre un fond de row pour marquer un état : une row cliquable avec un fond
coloré se lit comme un survol figé.
