# AI OS, glossaire

Le vocabulaire de travail du système. Des termes, pas de l'implémentation.
Le manuel (`AGENTS.md`) dit comment on s'en sert.

## Espaces

**Domaine** :
Un espace de travail personnel ou produit, un dossier à la racine de l'AI OS,
avec son repo git local sans remote et son `CLAUDE.md`. Invisible au repo
système.
_Éviter_ : projet, workspace, dossier perso

**Vault** :
Le second brain, `second-brain/`. Connaissance durable, registre unique des
tâches et projets, calendrier, inbox.
_Éviter_ : notes, brain, Obsidian

**Zone de transit** :
`second-brain/inbox/`, l'unique endroit où un fichier attend qu'on décide de
sa destination. On en sort un fichier en le déplaçant, jamais en le copiant.
L'alias du Bureau et `~/Downloads` alimentent cette zone, ils n'en sont pas
une seconde.
_Éviter_ : à trier, inbox 2, dossier temporaire

**Archive** :
Le sous-dossier `archive/` d'un dossier de travail, pour ce qui n'est plus
actif sans être un livrable ni une source du vault. Locale au domaine, jamais
globale.
_Éviter_ : old, legacy, backup

**Livrable** :
Un travail fini, déplacé dans `deliverables/<domaine>/` au format dans
lequel il a été remis. Rien n'y arrive avant d'être terminé.
_Éviter_ : export, output

## Sauvegarde

**Plan** :
La décision, par dossier, de ce qui le sauvegarde : GitHub pour le code et le
texte dont les diffs comptent, Drive pour le lourd et le personnel, Keychain
pour les secrets. Jamais décidé pour tout l'AI OS à la fois.

**Mirroring** :
La synchronisation Google Drive « Ordinateurs » d'un sous-dossier de domaine,
le disque étant la source et le cloud la copie. Ne s'applique jamais à un
dossier qui contient un `.git`.
_Éviter_ : sync, backup Drive, streaming

**Drive legacy** :
L'ancien `Mon Drive` d'avant l'AI OS, streamé et non trié. Il se vide domaine
par domaine et disparaît quand tout a été migré ; il n'est pas une archive.
_Éviter_ : ancien Drive, cloud, `_legacy/`

## Tri

**Passe de tri** :
Une session qui vide une source (Downloads, Drive legacy, un dossier hérité)
vers l'AI OS, une table à la fois.

**Table de tri** :
La liste fichier → destination → action (déplacer, convertir, archiver,
supprimer) qu'un agent propose et que le propriétaire valide en une fois avant
tout mouvement. Une suppression y porte toujours sa raison.

**Bibliothèque** :
Les livres lisibles par un humain (`compound-learning/livres/`), epub et
PDF entiers. Distincte du **corpus**, qui est la version éclatée et
agent-first du même livre dans un wiki (`product-wiki`, `immo-wiki`).
_Éviter_ : raw, sources
