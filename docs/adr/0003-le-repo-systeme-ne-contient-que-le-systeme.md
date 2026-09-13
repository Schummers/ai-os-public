# Le repo système ne contient que le système, et son .gitignore est une liste blanche

Décision du 2026-08-27, prise après qu'un fork de ce repo ait
rapporté ce qu'il recevait vraiment en le synchronisant.

## Ce qui a déclenché

`ai-os` mélangeait trois choses dont les audiences n'ont rien à voir : le système
(destiné à être partagé), le pilotage des domaines personnels, et l'identité de
son propriétaire. La séparation était assurée par le `.gitignore` racine : une
centaine de lignes qui ignoraient le contenu des domaines puis ré-incluaient les
Markdown de pilotage par des jokers, dans un ordre où la dernière règle qui
matche gagne.

Ce mécanisme a laissé passer du contenu personnel **deux fois** :

- `agency/cv/letters/deriv.mjs`, une lettre de motivation entière, prête à être
  commitée. Rattrapée le 2026-08-26, avec un commentaire explicite ajouté dans le
  `.gitignore` pour que ça ne se reproduise pas.
- une lettre de motivation archivée sous `agency/cv/archive/`, **la même chose un dossier
  plus loin**, ré-incluse par `!/agency/cv/**/*.html`. Pas rattrapée : commitée,
  poussée, avec la lettre complète et un numéro de portable. Vue le 2026-08-27,
  par le fork, pas par nous.

Le commentaire ajouté la veille disait mot pour mot de ne pas laisser partir une
lettre de motivation. Il n'a servi à rien, parce qu'il décrivait une intention
alors que le fichier appliquait un motif. **Un `.gitignore` par exceptions est
une liste d'autorisations avec des trous, et on ne voit pas les trous** : rien
n'échoue, rien n'avertit, le fichier est simplement là.

## Décision

**Le `.gitignore` racine devient une liste blanche.** `/*` ignore tout, puis on
ré-inclut nommément les dix entrées du système. Un dossier inconnu est privé par
défaut. Ajouter quelque chose au repo partagé redevient un acte délibéré, au lieu
d'être le comportement par défaut auquel on échappe si on y pense.

**Chaque domaine a un repo git local, sans remote.** Distinction qu'on avait
d'abord ratée en discutant : `git init` est local, `git remote add` est ce qui
touche GitHub. Le refus de « polluer GitHub » ne s'appliquait donc jamais au
`git init`.

Un repo local ne sauvegarde rien, il est sur le même disque. Ce qu'il apporte :
l'historique daté du pilotage, `git checkout --` pour annuler un agent, et un
groupe de sessions distinct dans la sidebar de Claude Code, qui groupe par racine
git et pas par répertoire courant. La sauvegarde est un sujet séparé, traité par
le mirroring Drive.

Les sous-dossiers qui sont de vrais codebases gardent leur propre repo **avec**
remote : `agency/portfolio/`, `cycling/<un-jeu>/`, `product-wiki/`.

## Alternatives écartées

**Mieux écrire les exceptions.** C'est ce qu'on a fait le 26/08, et le trou
suivant était déjà ouvert au moment où on l'écrivait. Le problème n'est pas la
qualité des règles, c'est leur sens : par défaut ouvert.

**Un repo privé GitHub par domaine.** Écarté : quatre remotes à maintenir pour
douze ADR que leur auteur reconnaît ne pas tenir à jour. C'est le `remote` qui
coûte, pas le `init` — d'où la solution retenue, locale.

**Aucun repo du tout, Drive seul.** Appliqué pendant quelques heures le
2026-08-27, puis annulé. Deux raisons. La sidebar de Claude Code groupait toutes
les sessions `agency/` sous `AI-OS`, ce qui était l'irritant quotidien qui a
relancé la discussion. Et surtout, en vérifiant la config Drive on a découvert
que **le mirroring n'était activé sur aucun dossier** (`root_config` et
`mirror_item` vides), ni Time Machine configuré : le « plan Drive » était une
intention écrite, pas un mécanisme actif. Retirer les repos avait donc laissé les
quatre domaines sans aucune sauvegarde. Rétabli depuis le tag
`pre-split-2026-08-27`.

**Un seul repo `domains/` pour les quatre.** Un remote au lieu de quatre, mais
impose de déplacer `agency/` en `domains/agency/` : casse les chemins dans les
skills, les buckets de session (voir `0002`), la config de sync Drive et les
habitudes. Le gain ne paie pas la casse.

**Réécrire l'historique d'`ai-os` avec `git filter-repo`** pour effacer le
numéro de portable, les montants du foyer et les mails de prospection. Non fait :
le fork existant (autre membre du foyer) a déjà cet historique, le réécrire casserait ce clone pour
supprimer une donnée que son propriétaire possède déjà. Voir la conséquence ci-dessous.

## Conséquences

**Le partage externe n'est pas encore fait, et il reste une étape.** L'arbre est
propre à partir d'aujourd'hui, l'historique ne l'est pas. Avant de donner accès à
quelqu'un hors du foyer : publier un repo neuf depuis l'arbre courant, sans
historique. Pas de `filter-repo`, pas de clone cassé chez qui que ce soit.

**La sauvegarde des domaines n'existe pas encore.** Vérifié le 2026-08-27 :
aucun mirroring Drive, aucun Time Machine. Les repos locaux ne comblent pas ce
trou, ils sont sur le même disque. Tâche ouverte dans le vault :
`activer-le-mirroring-drive-sur-les-domaines`.

**Un `.git` dans un dossier mirroré par Drive peut se corrompre.** Quand le
mirroring sera activé, viser les sous-dossiers lourds (`cv/`, `prospection/`),
pas la racine du domaine, qui porte le `.git`.

**Un commit qui touche le système et un domaine devient deux commits.** C'était
déjà le cas avec `second-brain/` et `product-wiki/`.

## Amendement du 2026-09-13 : une liste blanche ne protège pas des noms propres

L'ADR d'origine traite des *fichiers* qui ne doivent pas entrer dans le repo, et
la liste blanche fait ce travail. Elle ne dit rien du *contenu* des fichiers qui
y entrent légitimement, et c'est par là que la fuite est passée.

Constaté en auditant le snapshot publié : **192 occurrences** d'un prénom et de
noms de projets privés, dans 60 fichiers versionnés depuis des mois. Rien de
secret au sens de `check-secrets.sh` — pas un token, pas une adresse, pas un
IBAN. Du vocabulaire : des specs produit écrites en user stories nommant leur
propriétaire, la filiation d'un design system vers un projet client, et de
vraies tâches du vault utilisées comme contenu de maquette dans des wireframes
HTML.

**Trois causes, aucune n'est une étourderie.**

1. La règle était « avant de publier, relis comme un inconnu le ferait ». Une
   règle qui repose sur la vigilance humaine à chaque exécution n'est pas une
   règle, c'est un vœu. Personne ne l'a jamais appliquée.
2. Les docs ont été écrites pour leur auteur. Écrire « <prénom> doit voir le
   compteur » est naturel quand on écrit pour soi ; ça devient une fuite au
   moment de la publication, pas au moment de l'écriture.
3. Deux gardes existaient (`$HOME`, `check-secrets.sh`) et couvraient chacun
   une catégorie précise. Leur existence donnait le sentiment que le sujet
   était traité.

**Décision.** `system/scripts/check-public-names.py` lit
`system/scripts/public-denylist.txt` et fait échouer `sync-public.sh` dès qu'un
nom de la liste apparaît, dans un contenu **ou dans un nom de fichier** — un
ticket nommé `00-fork-design-system-<projet>.md` publie le nom dans l'URL du
dépôt. La comparaison est insensible à la casse et aux accents, sur des mots
entiers.

**Exception assumée** : `Schummers` n'est pas dans la liste. C'est le nom de
l'org GitHub qui héberge le dépôt public ; il est public par construction.

**Conséquence sur la manière d'écrire.** Dans ce repo, on nomme le rôle, pas la
personne : `l'utilisateur`, `the owner`, `DS-source`, `<un-projet>`. Un nom
propre qui a une vraie raison d'être écrit appartient à un dossier de domaine ou
au vault, tous deux invisibles ici.

**Ce que ça ne répare pas** : l'historique public. Le dépôt public est un
snapshot sans historique, écrasé à chaque sync, donc la prochaine publication
suffit. L'historique *privé* garde les noms, ce qui est sans conséquence — c'est
déjà le cas depuis l'ADR d'origine pour les commits d'avant le 2026-08-27.
