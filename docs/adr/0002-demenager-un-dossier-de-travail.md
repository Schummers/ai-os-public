# Déménager un dossier de travail, c'est déplacer trois choses, pas une

Décision du 2026-08-13, prise en migrant deux projets de jeu vers le nouveau domaine `cycling/`, après un `mv` précédent qui avait laissé les sessions orphelines.

Un dossier de travail n'est pas seulement son contenu. Trois artefacts vivent ailleurs et sont indexés **par son chemin absolu**. Déplacer le dossier sans eux détruit du contexte silencieusement, sans erreur, sans avertissement.

## Les trois

1. **Le bucket de sessions**, `~/.claude/projects/<chemin-encodé>/`. Encodage : chaque `/`, espace et point du chemin absolu devient `-`. `/Users/x/AI OS/cycling/mon-jeu` → `-Users-x-AI-OS-cycling-mon-jeu`. Ce nom est figé à la création de la première session et n'est **jamais** renommé par Claude Code.
2. **La mémoire projet**, `~/.claude/projects/<chemin-encodé>/memory/`. Elle vit *dans* le bucket, à côté des transcripts. C'est le point non évident : elle voyage donc avec lui, dans le même geste, ou pas du tout. Celle d'un des deux faisait 30 fichiers.
3. **Les configs locales gitignorées** du repo lui-même : `.vercel/project.json`, `.claude/settings.local.json`, `.codex/hooks.json`, `.env.local`. Elles survivent au `mv` (jamais à un re-clone, elles ne sont pas sur le remote), mais elles contiennent des **chemins absolus périmés** : allowlists de permissions, et surtout des hooks qui `cd` vers l'ancien chemin et échouent en silence.

## La procédure

`mv` du dossier, puis `mv` du bucket vers le nouveau nom encodé, puis `sed` des chemins absolus dans les configs locales, puis `git worktree repair` si le repo a des worktrees.

Le `mv` du bucket est **un seul geste pour les sessions et la mémoire**. C'est ce qui tranche le compromis : il n'y a pas de version « rapide, sans les sessions » moins chère que la version complète.

## Ce qu'on ne fait pas

Réécrire le champ `cwd` dans les `.jsonl` du bucket. C'est le seul geste de la procédure qui peut réellement détruire du contexte : plusieurs dizaines de Mo, éventuellement ouverts en écriture par l'app. Le bandeau « le dossier de travail n'existe plus / Choisir un dossier » de l'app desktop fait ce repointage proprement, session par session, à la demande. Renommer le bucket suffit à ce que `claude --resume` retrouve les sessions depuis le nouveau dossier.

Alternative rejetée : ne rien faire et recréer les sessions en copiant-collant le contexte. Coût réel équivalent au `mv` du bucket, et perd la mémoire projet, qu'aucun copier-coller ne reconstitue.

**Conséquences** :
- Rien ne relie automatiquement le `mv` du dossier au `mv` du bucket. C'est une convention tenue à la main, comme le couple « `git init` + ligne dans le `.gitignore` » de `agency/docs/adr/0003`.
- Le `sed` des configs locales n'est vérifiable que par grep du vieux chemin après coup. Le faire. Il faut aussi grepper `~/.codex/config.toml`, dont les entrées `[projects."<chemin absolu>"] trust_level` sont indexées par chemin comme le bucket de sessions.
- Un chemin absolu dans un fichier de config **versionné** est un bug indépendant du déménagement : il casse déjà sur tout clone. Le corriger relativement à la racine du repo (`cd "$(git rev-parse --show-toplevel)/…"`), pas relativement au cwd, que Codex comme Claude Code laissent libre.
- `git worktree prune` **détruit** l'enregistrement d'un worktree dont le chemin enregistré n'existe plus, y compris quand son contenu, lui, a bien suivi le `mv`. Utiliser `git worktree repair` **avant** tout `prune`. Réparer après coup demande de reconstruire à la main `.git/worktrees/<nom>/` (`gitdir`, `HEAD`, `commondir`) puis un `git reset` mixed dans le worktree pour reconstruire son index.
- Non résolu : les chemins absolus périmés dans les docs archivés d'un repo (une centaine de fichiers dans un seul repo). Laissés tels quels, ce sont des traces historiques, pas de la configuration.
