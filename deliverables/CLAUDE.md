# Deliverables

Registre unique des livrables finis, tous domaines confondus. Pas un dossier de travail : un fichier n'y arrive qu'une fois terminé.

**Plan de sauvegarde** : le contenu est gitignoré, seul ce `CLAUDE.md` est versionné. Sync Drive à brancher (locale = source, Drive = backup, comme `admin/`) — c'est ce dossier qui fournira les liens de partage. Pas de `git init` dedans.

## Sous-dossiers

**Un par domaine**, créé en même temps que le domaine, portant exactement son nom. Rien d'autre à la racine : pas de classement par date, par client, par type de fichier ni par goal. Le domaine est la seule clé, parce que c'est la seule qui ne change jamais — un livrable appartient au domaine qui l'a produit, quel que soit le goal qu'il servait ce trimestre-là.

Chaque sous-dossier peut porter son propre `CLAUDE.md` disant ce qui compte comme fini *dans ce domaine* (un visuel exporté n'est pas un rush, un rapport remis n'est pas un brouillon).

**Ni ces sous-dossiers ni leur `CLAUDE.md` n'entrent dans git.** Seul ce fichier-ci est versionné. La raison est la même que pour les domaines eux-mêmes : leur nom seul dit ce sur quoi le propriétaire travaille, et ce repo est destiné à être lu par des tiers. La liste blanche du `.gitignore` racine s'arrête donc à `!/deliverables/CLAUDE.md`.

> Corrigé le 2026-09-13. La règle précédente réincluait tous les `CLAUDE.md` du dossier (`!/deliverables/**/CLAUDE.md`), et un casier de domaine s'est retrouvé publié dans le snapshot public. Un joker par extension n'est pas un mécanisme de sécurité, même restreint à un nom de fichier réservé.

## Règles

- Un livrable fini (PDF, PPT, export, vidéo montée) est **déplacé** ici depuis le dossier de travail où il a été produit, jamais copié : après coup, il n'existe qu'à un seul endroit.
- Le dossier de travail d'origine garde brouillons et versions intermédiaires, pas le fichier final.
- La tâche ou note correspondante dans `second-brain/` pointe vers le chemin ici une fois le fichier déplacé (via `/update-brain`).
- Le partage se fait par lien Drive depuis ce dossier, pas en re-copiant le fichier ailleurs.
- En cas de doute sur ce qui compte comme « fini », demander plutôt que de deviner.

## Hors scope (décisions différées)

- Versioning d'un livrable remplacé par une nouvelle version : non conçu, à traiter si le besoin se confirme.
