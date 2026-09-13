# La doc se vérifie, elle ne se promet pas

Décision du 2026-08-28, prise en répondant à « qu'est-ce qu'on a appris de tous
ces fixes ». La veille, un audit manuel avait trouvé six affirmations fausses
dans les fichiers que les agents lisent à chaque session.

## Les trois causes, pas les six bugs

**1. Une copie dérive, un pointeur non.** `system/preferences/user.md` annonçait
un goal périmé depuis quinze jours, et il est projeté dans `~/.claude/CLAUDE.md` :
chaque session de chaque projet lisait la mauvaise cible, avec pour consigne de
rappeler son propriétaire à l'ordre s'il s'en écartait. Même mécanisme pour les
chemins de projets (`~/Documents/<un-projet>`, disparu), pour la note
`architecture-ai-os-deux-plans` et pour `hot.md`. Aucun de ces fichiers n'était
la source de la vérité qu'il énonçait.

**2. Une affirmation que personne ne vérifie est un souhait.** Le « plan Drive »
était écrit depuis juillet 2026 et n'avait jamais été branché : zéro dossier
mirroré, zéro destination Time Machine. `batch-grill-me` était cité cinq fois et
n'existait nulle part. `agency/prospection/` avait été fusionné dans `pipeline/`
par un ADR du domaine. Rien ne testait ces phrases.

**3. Un contrôle faux ne protège pas, il endort.** `lint_vault.py` comptait les
wikilinks à l'intérieur des blocs de code : 173 « liens morts » dont le vrai
nombre était 0. Un chiffre qu'on sait faux n'est plus lu, et celui-ci stagnait
depuis juillet. Pire, `audit-system.sh` exigeait `system/templates/` et
`system/agents/`, deux dossiers vides que git ne versionne pas : **il n'avait
jamais pu passer sur un clone neuf**, et personne ne s'en était aperçu parce
qu'il ne tournait que sur la machine où ces dossiers existent.

## Décision

**Ce qui est mécaniquement vérifiable est vérifié par l'audit**, pas par la
vigilance. `system/scripts/check-doc-reality.py`, appelé par `audit-system.sh`,
échoue si un fichier de pilotage cite un chemin, un skill ou un script qui
n'existe pas. Il a trouvé un défaut réel dès sa première exécution : le
`README.md` des skills renvoyait vers un ADR vivant dans un domaine privé, donc
vers un document qu'aucun forkeur ne pourra jamais lire.

**Ce qui ne l'est pas se pointe au lieu de se recopier.** Une cible de goal, une
décision, un inventaire de repos : le fichier de pilotage dit *où* lire, jamais
*quoi*. `user.md` déclare désormais que la source est `knowledge/goals/`.

**Un contrôle doit tourner là où il compte.** L'audit passe maintenant sur un
clone neuf, pas seulement sur la machine d'origine.

## Alternatives écartées

**Un skill « vérifier la doc ».** Un skill sert à une tâche de jugement
répétable. Comparer une liste de chemins au disque n'en demande aucun : c'est un
script, et un script tourne sans qu'on y pense. Un skill aurait ajouté une étape
à ne pas oublier, c'est-à-dire exactement le mode de défaillance qu'on corrige.

**Une revue de documentation périodique.** Même objection : ça dépend de quelqu'un
qui s'en souvient. Les six erreurs de la veille avaient survécu à plusieurs
sessions de travail dans ces mêmes fichiers.

**Un linter de prose plus ambitieux** (détecter une affirmation périmée sur les
faits, pas seulement un chemin cassé). Écarté : indécidable en général, et le
vrai remède est de ne pas recopier le fait.

## Conséquences

**Ajouter un chemin à `PROSE` ou `EXTERNAL` doit rester un acte délibéré.** Ces
listes existent pour les exemples (`<domain>/`, `archive/`) et pour les dépôts
tiers. Les utiliser pour faire taire un vrai chemin cassé transformerait l'outil
en décoration. `EXTERNAL` impose de nommer le dépôt concerné, pour cette raison.

**Le contrôle ne couvre que les chemins, les skills et les scripts.** Il n'aurait
pas attrapé le goal périmé de `user.md` : ça, seul le principe du pointeur le
prévient. L'outil traite la classe 2, pas la classe 1.
