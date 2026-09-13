# 22 — Chemins vault et wikilinks alignés avec l'arborescence réelle

**What to build:** Plusieurs endroits de la passerelle vault (résolution de type d'entité pour la recherche, vérification d'existence d'un fichier lié, extraction de slug depuis un wikilink) utilisent des noms de dossiers ou un jeu de caractères qui ne correspondent plus à l'arborescence réelle du vault (`content/idea` au singulier, `knowledge/notes`, `knowledge/sources`) ou excluent les caractères accentués. Résultat : des wikilinks valides sont affichés comme cassés, et des fichiers sont mal classés en recherche.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] La vérification d'existence d'un fichier wikilinké reconnaît les cibles dans `content/idea`, `knowledge/notes` et `knowledge/sources`
- [x] La classification de type d'entité en recherche (goal/note/source/...) correspond à l'arborescence réelle du vault, pas à d'anciens chemins racine
- [x] L'extraction de slug depuis un wikilink accepte les caractères accentués (é, à, ç, …), pas seulement l'ASCII
- [x] Test avec un wikilink réel du vault vers une idée de contenu et vers une source → reconnu comme existant, pas comme lien brisé
- [x] `npm run typecheck` et `npm test` passent

