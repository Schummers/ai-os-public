---
name: create-task
description: Créer des tâches structurées dans le second brain, rattachées à un projet existant ou nouveau, avec quiz du découpage avant écriture. Use when the user asks to create a task or tickets in their vault/brain ("crée une tâche", "ajoute ça à mes tâches", "transforme ça en tickets"), or when work discussed in session deserves durable tasks.
---

# Create Task

Créer une ou plusieurs tâches dans le vault, conformes aux schémas canoniques, rattachées au bon projet et au bon goal, avec les dépendances explicites.

## Résolution du vault

Le vault est `$VAULT_PATH` si la variable est définie, sinon `~/AI OS/second-brain`. Tous les chemins ci-dessous sont relatifs à cette racine. Ne jamais coder un autre chemin en dur.

## Workflow

1. Lire `AGENTS.md` du vault et `_agent/hot.md`.
2. Lire les schémas canoniques : `_agent/templates/task.md` et `_agent/templates/project.md`. Ils sont la source unique de vérité pour le frontmatter et les règles — ne pas reproduire le schéma de mémoire.
3. **Rattachement.** `project:` et `content:` sont **optionnels**. Une tâche peut n'être rattachée qu'à un goal, ou à rien. Ne jamais créer un projet dans le seul but de donner un parent à une tâche : un projet a une fin et un résultat, un tiroir n'en a pas. Quand une tâche n'a pas de projet naturel, omettre le champ et poser seulement `goal:`. La question ne se pose que si l'information manque :
   - L'argument nomme un projet existant → l'utiliser sans demander.
   - L'argument dit de créer un nouveau projet → le créer sans demander (mais demander son `goal` et son `status` s'ils ne sont pas déductibles).
   - Sinon → demander : rattacher à un projet existant (proposer les candidats plausibles de `projects/on/` et `projects/ongoing/`), créer un nouveau projet, ou **n'en mettre aucun** et rattacher au goal seul. Cette troisième option est légitime, la proposer explicitement.
4. **Valider les wikilinks avant d'écrire.** Vérifier sur le disque que le goal (`knowledge/goals/`) et le projet référencés existent. Goal inexistant → s'arrêter et demander ; ne jamais créer un goal en silence.
5. **Quiz du découpage avant toute écriture.** Présenter les tâches proposées en liste numérotée — pour chacune : titre, `blocked_by`, ce qu'elle livre une fois finie. Chaque tâche doit être une tranche complète et vérifiable seule, dimensionnée pour une session fraîche (tracer bullet). Demander : granularité correcte ? dépendances correctes ? fusionner ou scinder ? Itérer jusqu'à l'accord explicite de l'utilisateur.
6. **Écrire**, dans l'ordre :
   - Les tâches dans `projects/tasks/<slug-kebab-case>.md`, conformes au template.
   - Le nouveau projet dans `projects/<status>/<slug>.md` le cas échéant.
   - La section `## Tâches liées` du projet parent (wikilinks vers chaque tâche créée).
   - `index.md` si un projet a été créé.
   - `_agent/hot.md` si le contexte durable change.
7. **Terminer** en montrant les fichiers créés et la **frontière** : les tâches à `blocked_by: []`, démarrables immédiatement.

## Hard Rules

- Ne jamais supprimer de fichier sans confirmation explicite.
- Wikilinks Obsidian (`[[nom]]`) pour tout lien interne.
- Aucun champ de frontmatter hors schéma canonique.
- Pas d'écriture avant l'accord du quiz (étape 5).
