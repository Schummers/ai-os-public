# 00 — Fork du design system DS-source vers AIOS App

**What to build:** AIOS App dispose de son propre design system, forké de celui de DS-source (v1.4.0, lui-même porté du portfolio v1.0.0), avec le dark comme canvas par défaut. À la fin de ce ticket, une page de démonstration affiche les composants repris avec les bons tokens, et plus aucune couleur ni taille n'est écrite en dur ailleurs que dans le fichier de tokens.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] `DESIGN.md` existe dans le projet, en v1.0.0, avec la ligne de filiation explicite (DS-source v1.4.0 → portfolio v1.0.0) en tête
- [x] Les tokens CSS sont repris tels quels : surfaces, bordures, texte, brand, sémantiques, échelle d'espacement sur grille 4px, rayons
- [x] Le dark est le canvas par défaut, le light existe en overlay, comme chez DS-source
- [x] La typographie Space Grotesk (display) et Manrope (corps) est chargée en local, sans requête réseau à l'exécution
- [x] La règle « ne jamais inliner de hex ni de px hors du fichier de tokens » est reprise et respectée dans tout le code du ticket
- [x] Les composants présentationnels utiles sont forkés avec leurs tests quand ils en ont : contrôle segmenté, pilule de filtre, bouton de filtre, rangée de filtres actifs, pilule de recherche, rangée de liste, rangée de groupe, section groupée, en-tête de section, mini statut, carte, bascule à puce, en-tête de détail, menu contextuel
- [x] Les composants couplés au domaine DS-source (compteur d'écritures, carte de justificatif, et tout autre du même type) sont explicitement écartés, et la liste des écartés est notée dans `DESIGN.md`
- [x] Une page de démonstration rend chaque composant forké dans ses états principaux, en dark et en light
- [x] Les quatre composants à créer pour AIOS App (vue journée, rail de cartes goal, accordéon projet vers tâches, barre d'habitudes) sont listés dans `DESIGN.md` comme extensions à venir, non implémentées ici
