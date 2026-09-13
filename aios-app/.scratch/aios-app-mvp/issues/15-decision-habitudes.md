# 15 — DÉCISION : les habitudes

**What to build:** Rien tant que le modèle de données n'existe pas. La barre d'habitudes est dessinée et présente en bas de la vue Daily, mais elle n'est pas fonctionnelle. Cocher une case est trivial ; afficher un streak et un taux de complétion exige un historique daté, écrit chaque jour, et il n'existe rien de tel dans le vault. Deux bases Notion ont été fournies comme source à importer.

**Blocked by:** None — mais une session de décision doit avoir lieu avant tout code.

**Status:** needs-info

- [ ] Les deux bases Notion fournies sont inspectées, et leur contenu converti en Markdown dans le vault
- [ ] Décision prise sur le stockage de l'état quotidien : une clé de frontmatter dans la daily note, un fichier par habitude, ou un fichier de données à part
- [ ] Décision prise sur qui crée la daily note du jour quand elle n'existe pas encore : l'application ou le rituel du matin
- [ ] Règle de calcul du streak et du taux de complétion arrêtée, y compris le traitement des jours manquants
- [ ] Schéma canonique écrit dans le vault, au même endroit que les autres
- [ ] Ticket d'application créé ensuite, pour rendre la barre fonctionnelle
