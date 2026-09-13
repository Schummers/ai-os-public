# 25 — Contrôle de concurrence effectif sur l'édition rapide de tâche

**What to build:** Le serveur sait déjà détecter un conflit d'édition (hash du fichier au moment de l'ouverture vs hash au moment de la sauvegarde) et répondre 409 avec les données fraîches ; la modale d'édition rapide sait déjà afficher cette UI de conflit et proposer de recharger l'état frais. Mais le client n'envoie jamais le hash attendu, donc ce mécanisme ne se déclenche jamais : deux édits concurrents sur la même tâche s'écrasent silencieusement l'un l'autre. Il faut relier les deux bouts.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Le hash du fichier tâche, tel que lu au moment de l'affichage, est transmis au client puis renvoyé lors de la sauvegarde
- [x] Modifier le fichier d'une tâche sur disque entre l'ouverture de la modale d'édition et le clic sur "Enregistrer" déclenche bien l'UI de conflit existante (pas d'écrasement silencieux)
- [x] Le bouton "Recharger avec l'état frais du disque" fonctionne toujours après ce changement
- [x] Test d'intégration ou test API simulant deux écritures concurrentes sur la même tâche
- [x] `npm run typecheck` et `npm test` passent

