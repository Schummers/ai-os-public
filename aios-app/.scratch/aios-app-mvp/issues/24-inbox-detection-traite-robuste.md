# 24 — Détection robuste des captures inbox déjà traitées

**What to build:** L'inbox détecte si une capture est déjà traitée en cherchant la sous-chaîne littérale `status: processed` dans le fichier brut, avant tout parsing YAML. Si la valeur est quotée (`status: "processed"`), ce qui arrive selon l'outil qui a écrit le fichier, la capture reste comptée comme non-traitée pour toujours et gonfle le badge inbox. L'utilisateur doit avoir un badge fiable.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] La détection "déjà traité" se base sur la valeur parsée du frontmatter (`status === "processed"`), pas sur une recherche de sous-chaîne dans le texte brut
- [x] Une capture avec `status: "processed"` (valeur quotée) est reconnue comme traitée
- [x] Le compteur inbox non-traité (badge sur l'icône Inbox) reflète ce changement
- [x] Test avec fixture `status: "processed"` et `status: 'processed'` (guillemets simples) en plus du cas non quoté existant
- [x] `npm run typecheck` et `npm test` passent

