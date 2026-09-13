# 03 — Vue Global, projets

**What to build:** L'utilisateur ouvre la vue Global et voit tous ses goals en rail horizontal, puis ses projets groupés par statut en cartes denses. Il tape un goal pour filtrer tout ce qui est en dessous, retape pour désélectionner. Il déplie un projet en place et voit toutes ses tâches ouvertes sans changer de page.

**Blocked by:** 01 — Wireframes v2. 02 — Socle.

**Status:** complete

- [x] Rail horizontal de cartes goal, chacune portant sa santé et le volume de travail rattaché (projets actifs, tâches ouvertes), calculés et jamais saisis
- [x] Taper une carte goal filtre les groupes en dessous ; un second tap désélectionne ; un seul goal actif à la fois
- [x] Projets groupés par statut, dans l'ordre `on`, `ongoing`, `simmering`, `sleeping`
- [x] Carte projet dense : goal, priorité, statut, compteurs de tâches par statut, et une information temporelle
- [x] L'information temporelle est la `target_date` dépassée si elle existe, sinon le nombre de jours d'inactivité depuis `last_activated` ; un projet sans `target_date` reste informatif
- [x] Déplier un projet montre **toutes** ses tâches ouvertes, sans bouton « voir plus »
- [x] Les tâches terminées et abandonnées restent repliées derrière un compteur
- [x] Les tâches bloquées apparaissent en fin de liste, atténuées, avec la tâche qui les bloque
- [x] Le rattachement des tâches à un projet se fait par le frontmatter de la tâche, pas par la liste en corps de projet
- [x] Tous les agrégats sont testés au niveau de la passerelle vault

