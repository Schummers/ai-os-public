# Migrer le Drive vers l'AI OS domaine par domaine, le cloud reste le filet jusqu'à la fin

Décision du 2026-09-13, prise en session de grill sur « tout mettre dans l'AI OS ».
État vérifié ce jour : 11 Go libres sur 228, zéro dossier mirroré par Google
Drive, aucune destination Time Machine, ~2 300 fichiers encore dans l'ancien
`Mon Drive` (streamé, rien en local), 12 Go dans `~/Documents` hors AI OS.

## Décision

**L'ancien `Mon Drive` se vide domaine par domaine, jamais d'un coup.** Chaque
fichier est déplacé (`mv`, jamais copié) directement à sa place dans le domaine
concerné, en Markdown s'il est agent-first, en `docx`/`xlsx`/`pptx` s'il est
destiné à un humain.

**La suppression du cloud est découplée de la migration** (corrigé le 2026-09-13,
voir « Amendement » plus bas). La version initiale de cet ADR faisait supprimer
chaque dossier cloud en fin de sa propre passe. Ce n'est plus le cas : une passe
de tri déplace et ne supprime rien. Le Drive legacy se supprime **en une seule
fois, à la fin**, dans cet ordre strict :

1. tout est migré sur disque, plus rien à rapatrier ;
2. les sauvegardes tournent — GitHub pour le code et le texte, mirroring Drive
   pour le reste (tâche vault `activer-le-mirroring-drive-sur-les-domaines`) ;
3. dernière vérification que rien n'a été perdu ;
4. **alors** le Drive legacy est supprimé.

**Le cloud est le filet de sécurité pendant la migration, pas Time Machine.**
Tout ce qui compte est déjà dans Drive ; tant qu'on supprime le cloud en
dernier, la migration ne peut rien perdre. Le disque externe reste disponible
pour une sauvegarde Time Machine plus tard, mais elle n'est pas un prérequis.

**La passe stockage précède la migration.** À 11 Go libres, rapatrier 2 Go de
cloud peut bloquer la machine. Les caches, stores de paquets, `node_modules` de
repos inactifs et données d'apps désinstallées se suppriment d'abord, sur liste
validée avec raison, sans archive : tout se re-télécharge.

## Alternatives écartées

- **Time Machine une fois avant la passe de suppression.** Recommandé en
  session, refusé : le cloud couvre déjà les documents, et ce qu'on supprime
  sans archive est régénérable par construction. Le coût d'une erreur est
  un `pnpm install`, pas une perte.
- **Geler l'ancien Drive en `_legacy/` et piocher à la demande.** Deux sources
  de vérité pour toujours ; c'est exactement le doublon qu'on veut éliminer.
- **Tout rapatrier d'un coup puis trier.** 2 300 fichiers à trier en une
  session, jamais terminée.
- **Downloads → `A trier` → AI OS.** Le saut intermédiaire n'apporte rien
  une fois que chaque fichier a une destination ; `A trier` est dissous.

## Conséquences

- Un projet dont des worktrees sont encore ouverts reste en `~/Documents`,
  seule exception au « tout dans l'AI OS » ; il migrera en domaine quand ses
  sessions seront closes.
- Le mirroring Drive se branche **après** le vidage d'un domaine cloud et
  **avant** la suppression du Drive legacy, uniquement sur des sous-dossiers
  sans `.git` (règle de `0003`). C'est le point d'ordre qui compte : supprimer
  le cloud avant que le mirroring tourne laisserait les domaines sur disque sans
  aucune sauvegarde.
- L'ancien `Mon Drive/03_Gestion Locative`, partagé avec la famille, est
  remplacé par le dossier mirroré, à repartager une fois vérifié.

## Amendement du 2026-09-13 : la suppression ne fait plus partie d'une passe de tri

Constaté en exécutant la deuxième passe (`05_Perso` et `06_Santé`). La règle
d'origine demandait de supprimer le dossier cloud à la fin de sa passe. Deux
raisons de ne plus le faire.

**Le filet doit rester tendu jusqu'au bout, pas jusqu'à la fin de chaque passe.**
Une passe qui supprime son dossier cloud retire le filet de ce contenu avant que
la sauvegarde d'arrivée existe : le mirroring Drive des domaines est la dernière
tâche du projet, pas la première. Entre les deux, le disque est la seule copie.

**Plusieurs passes tournent en parallèle.** Le projet lance ses tâches de tri en
sessions simultanées ; le 2026-09-13, cinq incidents de recouvrement ont été
consignés dans la même journée, dont une suppression croisée d'un dossier que
deux sessions traitaient. Déplacer en parallèle est sans danger, supprimer en
parallèle ne l'est pas.

**Ce que ça change concrètement.** Une passe de tri produit toujours sa table de
suppression, validée en séance, avec la raison de chaque ligne — mais elle
l'écrit dans sa tâche au lieu de l'exécuter. Ce qui ne mérite pas l'AI OS n'est
pas rapatrié : il reste simplement dans le cloud, marqué. La passe finale
exécute la somme de ces tables.

Corollaire pour les agents : **aucune suppression de fichier pendant la
migration**, et une session ne commite que ses propres chemins (jamais
`git add -A`, qui ramasse le travail des sessions voisines — arrivé le
2026-09-13).
