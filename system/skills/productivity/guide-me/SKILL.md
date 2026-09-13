---
name: guide-me
description: Routeur de skills — analyse la demande ou la session en cours et propose les skills (globaux, vault, plugins) réellement pertinents, avec pour chacun le pourquoi et le comment. Use when the user asks which skill to use, how to approach a task with the available tooling, what the system can do here ("quel skill", "comment je fais ça", "guide-moi", "qu'est-ce que je peux utiliser", "je sais pas par où commencer"), or when they seem unaware that an existing skill covers what they are doing manually.
---

# Guide Me

L'AI OS porte plus de skills qu'on n'en retient. Ce skill est le point d'entrée : il regarde ce qui se passe, inventorie ce qui est réellement disponible ici, et recommande — en expliquant **pourquoi** chaque skill sert et **comment** l'appliquer.

Lecture seule. Il conseille, il n'exécute pas.

## 1. Comprendre le besoin réel

Repartir de ce qui est devant toi, dans cet ordre :

- La demande explicite si elle existe (l'argument passé au skill).
- Sinon, la session en cours : sur quoi l'utilisateur travaille, ce qu'il vient de faire à la main, ce sur quoi il bute ou tourne en rond.
- Le dossier courant : un repo de code, un domaine Drive, le vault, la couche `system/` — les skills disponibles et pertinents en dépendent.

Nommer le besoin en une phrase avant de recommander quoi que ce soit. Un routeur qui recommande sans avoir compris produit une liste, pas un conseil.

## 2. Inventorier ce qui est disponible ICI

Ne jamais réciter une liste de mémoire : elle périme. Découvrir l'état réel :

- **Globaux** (chargés partout) : `ls ~/AI OS/system/skills/_active/`
- **Vault** (chargés seulement sous `second-brain/`) : `ls "$VAULT_PATH"/.claude/skills/` (défaut `~/AI OS/second-brain`)
- **Projet** : `.claude/skills/` du dossier courant, s'il existe
- **Plugins** (mattpocock, anthropic, etc.) : ceux listés comme disponibles dans la session en cours

Lire le `SKILL.md` — au moins le frontmatter — de chaque candidat sérieux avant de le recommander. Décrire un skill sans l'avoir ouvert, c'est inventer.

**Piège de portée** : si le besoin appelle un skill du vault (`create-goal`, `morning-ritual`, `challenge-me`, `process-inbox`, `weekly-review`, `lint-vault`, `generate-moc`, `update-daily`) alors que la session n'est pas ouverte sous `second-brain/`, le dire explicitement : il faut ouvrir une session dans le vault. Ne pas recommander un skill qui ne chargera pas.

## 3. S'appuyer sur les règles de frontière déjà écrites

Elles ont leur source unique, ne pas les redéfinir ici :

- `~/AI OS/system/skills/README.md` — les deux régimes (plugins vs skills possédés) et la règle de découpage global / vault.
- `~/AI OS/AGENTS.md` — quel grill selon le contexte (`grill-with-docs` pour le code et `system/`, `grill-me` ailleurs), et la checklist de création d'un domaine.

Les lire quand la recommandation touche une de ces frontières.

## 4. Recommander : le pourquoi et le comment

Pour chaque skill retenu (trois maximum, classés par pertinence) :

- **Quoi** — le nom et sa commande d'invocation.
- **Pourquoi ici** — le problème précis qu'il résout *dans cette situation*, pas sa description générique. Si tu ne peux pas relier le skill à quelque chose de concret dans la session, c'est qu'il n'est pas pertinent.
- **Comment** — la première action réelle : quels arguments passer, ce qu'il va demander, ce qu'il produira à la fin.

Signaler aussi, quand c'est utile :

- **Ce qui se confond** — le skill voisin qu'on prendrait à tort, et la frontière (par exemple : `capture` jette une pensée brute dans l'inbox, `create-task` structure un travail déjà identifié).
- **Ce qui est déjà fait à la main** — si l'utilisateur est en train de faire manuellement ce qu'un skill couvre, le dire franchement.

## 5. Proposer une séquence quand les skills s'enchaînent

Beaucoup de travaux réels passent par plusieurs skills. Quand c'est le cas, donner l'ordre plutôt que des options isolées. Par exemple : stress-tester une décision, puis en tirer des tâches, puis redescendre le résultat dans le vault en fin de session. La séquence est souvent le vrai conseil.

## Hard Rules

- Lecture seule : ne rien créer, modifier ni exécuter. Ce skill oriente, l'utilisateur décide.
- Ne jamais recommander un skill sans avoir lu son `SKILL.md`, ni un skill absent de l'inventaire réel.
- **« Aucun skill ne s'applique » est une réponse valide** — et parfois la bonne. Un routeur qui recommande toujours quelque chose ne route rien.
- Trois recommandations maximum. Au-delà, c'est une liste, pas un guidage.
