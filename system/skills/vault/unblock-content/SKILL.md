---
name: unblock-content
description: Diagnostic en quatre questions quand un contenu coince — situer le blocage sur l'échelle packaging/outline/storyboard/script/montage et en sortir avec une action concrète. Use when the user is stuck on a video or post ("je suis bloquée", "je sais pas quoi en faire", "ça coince sur cette vidéo", "j'arrive pas à monter ça", "j'ai les rushes mais je sais pas par où commencer").
---

# Unblock Content

Transformer « je suis bloquée, je sais pas pourquoi » en une action précise.

Le principe qui gouverne tout : **le bug est presque toujours au-dessus de la douleur**. Une
galère au montage est un problème d'outline ; une galère au script est un problème de
packaging. Le réflexe naturel est d'attaquer là où ça fait mal, et c'est exactement le geste
qui prolonge le blocage.

## Résolution du vault

Le vault est `$VAULT_PATH` si la variable est définie, sinon `~/AI OS/second-brain`. Tous les
chemins ci-dessous sont relatifs à cette racine. Ne jamais coder un autre chemin en dur.

## Avant de commencer

Identifier le fichier concerné dans `content/production/` et le lire : le `stage`, et surtout
quelles sections du corps sont réellement remplies. Une section vide est un candidat sérieux au
niveau du bug. Aucun fichier identifiable → mener quand même le diagnostic, et proposer
d'écrire le résultat ensuite.

## Les quatre questions, dans l'ordre

### 1. Le ressenti

Bloquée, ou pas motivée ? Ce sont deux choses différentes et le piège classique est de les
confondre : la démotivation est rarement la vraie cause, et « je m'y remets demain » est la
réponse qui empêche le diagnostic.

Critère de fin : elle nomme laquelle des deux.

### 2. L'horizontal — où est-on sur le continuum ?

```
0% ────────────────────────────────────────────── 100%
contenu brut                              cinéma scripté
(rushes sans plan)                    (tout planifié avant)
```

Elle donne un pourcentage. Il décide la méthode :

- **Proche de 0 → bottom-up.** Regarder tous les rushes en x3, annoter les moments forts et
  émotionnels, laisser une histoire émerger des images.
- **Proche de 100 → top-down.** Le plan existe, le montage n'est que de l'exécution. Si ça
  galère quand même, ce n'est pas un problème de montage : passer à la question 3.

### 3. Le vertical — à quel niveau vit le doute ?

Parcourir l'échelle **en partant du haut**. Le premier niveau qui reçoit un « non » est le bug.

| Niveau | Validé si |
|---|---|
| **Packaging** | concept clair, intention définie, niche ou grand public tranché, marque alignée, 5C validés |
| **Outline** | structure textuelle posée, sections définies, ordre logique |
| **Storyboard** | visuels pensés scène par scène, expérience spectateur claire |
| **Script** | texte exact écrit, si le contenu est scripté à 75% ou plus |
| **Montage** | assemblage final |

Croiser avec le fichier : une section `## Packaging` vide et un `stage: editing` disent où
chercher avant même de poser la question.

Critère de fin : un niveau nommé, et un seul.

### 4. La prochaine action

Une tâche, formulée comme « clarifier [le niveau identifié] ». « Je monte la vidéo » n'est pas
une action tant qu'un niveau au-dessus est en doute : c'est le niveau identifié qui se traite,
puis on redescend.

## Clôture

1. Écrire le diagnostic sous `## Journal` du fichier : date, niveau identifié, action décidée.
2. Si l'action mérite de survivre à la session, proposer une tâche via `create-task`, rattachée
   au contenu.
3. Si le diagnostic révèle que le packaging n'a jamais été fait, proposer
   `validate-content-idea` plutôt que de bricoler le niveau manquant ici.

## Hard Rules

- Les quatre questions dans l'ordre, une à la fois.
- Le diagnostic s'écrit dans le fichier avant de proposer quoi que ce soit.
- Ne jamais supprimer de fichier sans confirmation explicite.
