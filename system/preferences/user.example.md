# Préférences utilisateur — <Ton Nom>

> Source canonique : `AI OS/system/preferences/user.md`.
> Projeté vers `~/.claude/CLAUDE.md` et `~/.codex/AGENTS.md`. Ne pas éditer les projections.
> Compléments au CLAUDE.md / AGENTS.md de chaque projet.
>
> **Ceci est un squelette.** Copie-le en `user.md` et remplis-le. `user.md` est **ignoré par git** : il porte ton nom, ton email et tes préférences, et ce repo est fait pour être partagé. Tu ne récupères donc jamais l'identité de quelqu'un d'autre en installant ce système, et ton `user.md` n'entrera jamais en conflit avec le sien.

## Identité utilisateur

- **Nom** :
- **Email** :
- **Localisation** (timezone) :
- **Stack tech principale** :

## Communication

- **Langue par défaut** :
- **Ton** :
- **Format** : préférences de mise en forme (bullets, tableaux, etc.)
- **Emojis** : oui/non, et dans quels cas
- **Concision** : niveau de détail par défaut attendu dans les réponses

## Rédaction de messages externes

- Si tu veux un style spécifique pour les messages destinés à d'autres personnes (mail, DM, LinkedIn), copie `style.example.md` en `style.md` à côté de celui-ci et référence-le ici. Comme `user.md`, il est ignoré par git.

## Conventions de code

- **Commits** : convention à suivre (ex. conventional commits)
- **Branches** : convention de nommage
- **Tests** : approche (TDD, tests après code, etc.)
- **Lint** : règles à respecter

## Comportement agent

- Quand challenger une décision plutôt que l'exécuter directement
- Quelles opérations demandent confirmation avant d'être lancées
- Quelles commandes ou permissions ne jamais auto-approuver
- Préférences CLI vs MCP

## Sécurité

- **Secrets** : jamais en clair dans des fichiers committés
- **Tokens OAuth** : où ils vivent (ex. Keychain)
- **Audit régulier** : commande de vérification que l'environnement ne fuite rien

## Stack mentale projets

- Liste de tes projets actifs, avec un chemin ou une URL et une ligne de contexte chacun

## Goals (contexte permanent)

- Tes objectifs courants, pour que l'agent les garde en tête et te rappelle si tu dérives dessus

## Architecture AI OS

- Source unique : `~/AI OS`, versionnée dans ton propre repo (privé recommandé).
- `~/.claude` et `~/.codex` sont des projections générées par `system/scripts/sync-*.sh`. Ne jamais les éditer comme source.
- Skills tiers : consommés comme plugins. Skills persos : `system/skills/`, projetés par symlink via `_active/`.
