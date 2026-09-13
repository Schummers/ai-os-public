# 07 — Vue Daily, sans la section Journée

**What to build:** L'utilisateur ouvre l'app le matin et voit, dans l'ordre : l'état de ses projets en cours en rail horizontal, le focus du jour, puis ses tâches du jour qu'il peut cocher et repriorisier sur place.

**Blocked by:** 04 — Édition d'une tâche depuis n'importe quelle liste.

**Status:** complete

- [x] Première section : rail horizontal des projets actifs, avec compteurs de tâches et signal de dérive ; un tap ouvre la page du projet
- [x] Deuxième section : focus du jour, lu depuis le champ dédié de la daily note, avec son goal et son projet de rattachement
- [x] Si la daily note n'existe pas ou n'a pas de focus, la section affiche un état vide qui invite à lancer le rituel du matin
- [x] Troisième section : tâches du jour, avec priorité, échéance et autonomie visibles sur chaque ligne
- [x] Les tâches bloquées sont en fin de liste, atténuées, avec la raison du blocage
- [x] L'édition inline des quatre champs fonctionne ici exactement comme en vue Global
- [x] Barre d'habitudes présente en bas, 40px maximum, sans trait de séparation, en coquille visuelle non fonctionnelle (voir ticket 15)
- [x] L'app relit le vault au retour de focus de l'onglet, plus une action de rafraîchissement manuelle

