# L'identité n'est pas versionnée, seulement son squelette

Décision du 2026-08-27, prise en même temps que `0003`, sur signalement du fork.

`system/preferences/user.md` (nom, email, localisation, objectifs) et `style.md`
(168 lignes de vrais messages de prospection, nommant cinq prospects réels et
une connaissance personnelle) étaient versionnés, à côté d'un
`user.example.md` qui, lui, servait de squelette.

Deux problèmes, une cause.

**Pour qui installe le système**, `SETUP.md` étape 4 recopie de toute façon
l'exemple par-dessus. Versionner les vrais fichiers n'apportait donc rien à
personne : ils étaient écrasés à l'installation. Ils ne faisaient que livrer
l'identité et le carnet d'adresses commercial de leur propriétaire à quiconque
recevait le repo. `SETUP.md` l'admettait à demi-mot : « this template should only
be shared with people you would hand those two files to directly ».

**Pour deux personnes qui partagent le repo**, les fichiers existent au même
chemin avec un contenu par nature divergent. Ils conflictent à chaque
synchronisation, indéfiniment. Le fork proposait un `merge=ours` dans
`.git/info/attributes` : ça marche, mais c'est local, non sauvegardé, à refaire à
chaque clone, et ça traite le symptôme.

## Décision

`user.md` et `style.md` sont ignorés par git. Seuls `user.example.md` et
`style.example.md` sont versionnés — ce dernier n'existait pas et a été créé, ce
qui explique que `style.md` n'ait jamais eu de version dépersonnalisée.

## Conséquences

Le conflit structurel disparaît pour tout le monde, sans configuration locale à
maintenir.

**Ces deux fichiers ne sont plus sauvegardés par git.** C'est le vrai coût, et il
est réel : `style.md` représente des mois d'écriture. Ils relèvent maintenant du
plan Drive, comme tout contenu personnel. À vérifier explicitement plutôt qu'à
supposer.

Ils restent dans l'historique d'`ai-os`. Même arbitrage que `0003` : nettoyé au
moment de la publication externe, par un repo neuf.
