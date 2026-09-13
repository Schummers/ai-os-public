# 04 — Édition d'une tâche depuis n'importe quelle liste

**What to build:** L'utilisateur change le statut, la priorité, l'échéance ou l'autonomie d'une tâche directement depuis une liste, par un sélecteur simple, sans ouvrir de page. Le fichier est réécrit sans qu'une seule ligne du corps ne bouge, et une modification concurrente est détectée au lieu d'être écrasée.

**Blocked by:** 03 — Vue Global, projets.

**Status:** complete

- [x] Quatre champs éditables sur la tâche : statut, priorité, échéance, autonomie
- [x] Chaque champ se change par un sélecteur simple, sans geste caché ni appui long obligatoire
- [x] Seul le frontmatter est réécrit ; le corps du fichier reste identique octet pour octet, vérifié par test
- [x] Les clés de frontmatter non touchées gardent leur valeur et leur ordre
- [x] Une valeur hors des énumérations des schémas canoniques est rejetée
- [x] Le fichier est relu juste avant l'écriture ; en cas de divergence avec l'état affiché, l'écriture est refusée et l'utilisateur voit l'état frais
- [x] Tout champ non éditable porte un marqueur visuel explicite de lecture seule
- [x] Aucun autre type d'entité n'est modifiable : ni projet, ni contenu, ni goal, ni daily
- [x] Les cas d'écriture et de conflit sont testés au niveau de la passerelle vault, sur des fixtures

