# 02 — Socle : domaine AI OS, repo, app locale, première lecture du vault

**What to build:** L'utilisateur lance une commande et obtient, dans son navigateur et dans le panneau droit de Claude Code, une page qui liste ses projets `on` réels, lus depuis son vault sur disque. C'est la première traversée complète : dossier de domaine, application, passerelle vault, écran. Le seam de test naît ici.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] Le domaine suit les règles de création de l'AI OS : dossier dédié, `CLAUDE.md` décrivant chaque sous-dossier et le plan de sauvegarde, plan GitHub (repo imbriqué avec son propre remote, gitignoré à la racine), sous-dossier créé dans le registre des livrables
- [x] L'application se lance par une commande unique, en local, sur un port fixe
- [x] Le vault est résolu par variable d'environnement, avec le chemin par défaut du vault de l'utilisateur
- [x] La passerelle vault est un module de fonctions prenant un chemin de dossier et rendant le modèle de domaine, sans dépendance à l'interface
- [x] La page liste les projets `on` réels avec leur nom, leur priorité et leur goal
- [x] Les tests tournent contre un dossier de fixtures jetable, jamais contre le vrai vault
- [x] Un test vérifie qu'un projet dont le frontmatter est incomplet ne fait pas planter la lecture des autres
- [x] Aucune écriture n'est possible à ce stade
