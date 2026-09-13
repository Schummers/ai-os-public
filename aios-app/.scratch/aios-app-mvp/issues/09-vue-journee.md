# 09 — Vue Journée

**What to build:** L'utilisateur voit la forme de sa journée : des blocs proportionnels à leur durée, distinguant ce qui est engagé de ce qui est suggéré, avec les temps libres nommés et chiffrés, chacun proposant une tâche à y mettre.

**Blocked by:** 07 — Vue Daily. 08 — VAULT : `focus` et `plan`.

**Status:** complete

- [x] Blocs proportionnels à la durée, sans grille horaire dessinée
- [x] Quatre types visuellement distincts : réunion réelle, bloc de focus posé, proposition, moment perso
- [x] Les trous entre les blocs sont calculés, nommés et chiffrés en heures et minutes
- [x] Chaque trou porte une proposition de tâche, tirée des tâches du jour non planifiées
- [x] L'heure courante est visible sur la vue
- [x] Les créneaux liés à une tâche mènent à la page de cette tâche
- [x] Sans `plan` dans la daily note, la section affiche un état vide qui invite à lancer le rituel du matin
- [x] Le calcul des trous est testé au niveau de la passerelle vault, y compris les cas de chevauchement et de journée vide
- [x] L'application ne parle jamais à Google Calendar directement

