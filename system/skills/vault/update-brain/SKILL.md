---
name: update-brain
description: Redescendre le travail de la session courante dans le second brain — statuts des tâches, projets et goals, journaux, daily, hot.md — avec propositions de notes, jamais de création automatique. Use when the user wants to sync the session into their vault/brain ("update le brain", "mets à jour mon second brain", "enregistre cette session"), or at the natural end of a work session that touched vault tasks, projects, or goals.
---

# Update Brain

Synchroniser le vault avec ce qui s'est réellement passé dans la session courante. Checklist déterministe : chaque étape se termine quand son critère est rempli, aucune n'est optionnelle.

## Résolution du vault

Le vault est `$VAULT_PATH` si la variable est définie, sinon `~/AI OS/second-brain`. Tous les chemins ci-dessous sont relatifs à cette racine.

## Checklist

1. **Recenser.** Relire la conversation courante et lister les tâches et projets du vault touchés par le travail effectué (exécutés, avancés, contredits, rendus obsolètes). Critère : liste explicite affichée. Si rien ne se rattache au vault, le dire et demander ce qu'il faut enregistrer.
2. **Tâches touchées.** Pour chacune :
   - Comparer le résultat réel aux `## Critères de succès` : cocher ce qui est vérifié, commenter les écarts. Ne jamais cocher un critère non vérifié.
   - Mettre à jour `status` (todo | doing | done | dropped).
   - Ajouter une ligne datée au `## Journal`.
   Critère : chaque tâche de la liste de l'étape 1 traitée.
3. **Projets touchés.** Mettre à jour `last_activated`, le `## Journal`, et `status` si l'état a changé. Si toutes les tâches d'un projet sont done, proposer le déplacement vers le dossier statut suivant — ne jamais déplacer sans accord. Critère : chaque projet de la liste traité.
4. **Goals touchés.** Pour chaque goal (`knowledge/goals/`) que la session a fait avancer, reculer ou contredit : mettre à jour `health` et `last_reviewed`, actualiser les KPIs de la table Tracking si des valeurs observables ont changé, et ajouter une entrée datée au `## Review Log` (observation, health, décision). Ne JAMAIS changer `status` ni `priority` d'un goal sans accord explicite. Critère : chaque goal de la liste traité.
5. **Daily.** Suivre le skill du vault `update-daily` pour le recap de session dans `calendar/` (réutiliser, ne pas réimplémenter).
6. **hot.md.** Mettre à jour `_agent/hot.md`, puis appliquer le budget : s'il dépasse ~60 lignes, déclasser le contenu périmé vers les notes ou les journaux de projets concernés. Critère : hot.md à jour ET sous le budget.
7. **Proposer le savoir durable.** Si la session a produit des décisions, frameworks ou matériel externe qui méritent de durer : proposer `create-note` ou `create-source` avec un titre suggéré pour chacun, et attendre le oui. Jamais de création automatique.
8. **Terminer** en listant les fichiers modifiés avec les diffs importants.

## Hard Rules

- Ne jamais supprimer ni déplacer de fichier sans confirmation explicite.
- Wikilinks Obsidian pour tout lien interne.
- Rapporter fidèlement : un écart entre le fait et le demandé se signale, il ne se maquille pas.
