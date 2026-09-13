# Le second brain est le registre unique des tâches ; les livrables finis vivent dans deliverables/

Décision du 2026-07-26, portée depuis le domain model d'un autre AI OS du foyer (handoff du même jour) après grill, adaptée à cet AI OS.

Une tâche ou un projet n'existe qu'à un seul endroit : `second-brain/projects/`. Un domaine (`admin/`, futur `freelance/`) ne duplique jamais cette liste. Ce qu'un domaine contient, c'est un **dossier de travail** produit en exécutant une tâche : nommé d'après le sujet (`audit-acme/`), jamais d'après un ID de tâche. Le lien se fait dans un seul sens, du texte de la tâche vers le chemin du dossier, pas l'inverse.

Alternative rejetée : nommer le dossier d'après l'ID de la tâche (`freelance/task-0042/`) — muet sans ouvrir le vault, alors qu'un nom de sujet reste utile seul.

Un livrable terminé n'est ni dupliqué dans le vault, ni laissé dans son dossier de travail : il est **déplacé**, jamais copié, vers `deliverables/<domaine>/` — registre cross-domaine de fichiers finis, hors vault, hors dossier de travail, futur point unique de sync Drive et de partage par lien. Le dossier de travail garde les brouillons. `second-brain/attachments/` reste la seule zone binaire *du vault*, indépendante de cette décision.

Alternative rejetée : ranger les livrables dans le domaine producteur (`freelance/livrables/`, proposé le matin même) — recrée la question dans chaque domaine, multiplie les points de sync, et laisse ouvert « quelle copie est la bonne ».

**Dérogation, 2026-08-13** : le domaine `agency/` ne suit plus la seconde moitié
de cette décision. Un fichier taillé pour une cible (CV adapté, lettre, audit)
reste dans `agency/pipeline/<cible>/` ; seuls les CV de base, réutilisables et
non datés, entrent dans `deliverables/agency/cv-base/`. Motif : dans un domaine
de candidature, « fini » et « réutilisable » ne coïncident pas, et une lettre
séparée de sa research perd son contexte. Voir
`agency/docs/adr/0006-candidatures-chez-la-cible-livrables-reutilisables-seulement.md`.
Cette ADR reste vraie pour les autres domaines.

**Conséquences** :
- La convention ne tient que si le déplacement du fichier et la mise à jour du pointeur (`/update-brain`) sont faits ensemble ; rien ne les lie automatiquement.
- Un dossier de travail devenu inactif sans livrable ni promotion vault va dans l'`archive/` locale de son sous-dossier (voir AGENTS.md, « Creating a New Domain »).
- Non résolu, volontairement : versioning des livrables remplacés ; sort d'un domaine entier qui meurt (l'ancien `_archive/` racine a été retiré sans remplaçant pour ce cas).
