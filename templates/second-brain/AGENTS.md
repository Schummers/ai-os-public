# Second Brain Operating Manual

This vault is operated by Claude Code and Codex. The vault is the canonical artifact. Chat is only the interface.

## Les deux rythmes

Tout ce vault sert deux boucles. Les comprendre suffit à savoir où va chaque fichier.

**Le travail — trimestre, semaine, journée.** Un **goal** porte le trimestre et contient sa propre stratégie : le diagnostic, les quelques mouvements majeurs, les métriques. Un **projet** porte la semaine : c'est un livrable fini qui fait avancer un de ces mouvements, jamais un tiroir thématique. Une **tâche** porte la journée : une tranche complète, vérifiable seule. Chaque matin, `morning-ritual` désigne LA tâche qui fait le plus avancer le projet en cours. Chaque fin de semaine, `weekly-review` regarde ce qui a bougé, réactive ou endort des projets, repriorise. Chaque fin de trimestre, la revue de goals rejoue le même geste un cran plus haut. Le rôle de l'agent dans cette boucle est de ramener à la prochaine action concrète, pas de produire du plan.

**Le contenu — capturer, valider, fabriquer.** Cette boucle tourne en parallèle et ne passe pas par les projets : une vidéo n'est pas un projet, c'est une unité de production. On capture les idées sans les filtrer (`create-content-idea`, qui ne pose aucune question, parce qu'une idée qu'on interroge trop meurt avant d'exister). On en travaille une le jour où elle mérite d'exister : `validate-content-idea` fait chercher trois angles différents, en retient un, valide les 5C, écrit le hook et l'outline, et fait passer le fichier en production. Le `stage` avance ensuite jusqu'à la sortie, dans l'ordre qui convient au tournage. Quand ça coince, `unblock-content` situe le niveau du blocage avant de laisser bricoler l'étape d'après.

## Structure

- `knowledge/goals/`: high-level outcomes and domains of action.
- `knowledge/notes/`: durable ideas, claims, frameworks, and decisions.
- `knowledge/sources/`: external material, research, transcripts, documents, and imported references.
- `knowledge/mocs/`: automatically maintained maps of content.
- `calendar/`: human/product timeline, daily notes, weekly reviews, pivots, decisions, and session summaries.
- `projects/`: active and inactive work.
- `projects/tasks/`: atomic tasks, not a project state.
- `content/`: publishable production units (reel, post, carousel), one file each, foldered by `status`: `idea/`, `production/`, `published/`, `archive/`. A sibling of `projects/`, not a kind of project. Schema: `_agent/templates/content.md`.
- `inbox/`: unprocessed captures.
- `attachments/`: files referenced by notes and sources.
- `_agent/`: agent cache, logs, proposals, migration reports, and lint reports.

## Core Rules

- Use Obsidian wikilinks for internal links: `[[note-name]]`.
- Use Markdown links only for external URLs.
- Keep frontmatter flat.
- Do not write technical logs into `calendar/`; use `_agent/logs/`.
- Update `_agent/hot.md` after meaningful vault changes.
- Show the user the diff after modifying existing notes.
- MOCs can be created and updated automatically.
- Open the AIOS app (`aios-app`, dashboard of goals/projects/tasks, dev server config in this vault's own `.claude/launch.json`, port 4610) in the browser panel whenever it gives visual context for the work at hand: reviewing projects/tasks, `morning-ritual`, `weekly-review`, or any status check across active work. Treat this as an implicit, self-triggered step, not something to wait for the user to ask for. The app lives in `aios-app/` at the root of the AI OS folder, next to this vault; run `pnpm install` in it once before the first launch.

## Write Policy

- Creating new notes, sources, MOCs, daily notes, and project/task files is allowed.
- Editing existing notes is allowed, but summarize the diff explicitly.
- Use `_agent/proposals/` when a change is speculative, sensitive, or broad.
- Never delete files unless the user explicitly confirms deletion.

## Operations

- Capture: write raw inputs to `inbox/`.
- Process inbox: classify captures into notes, sources, projects, tasks, or calendar.
- Create note: write the user's own thinking to `knowledge/notes/`.
- Create source: write external material to `knowledge/sources/`.
- Generate MOC: create or refresh a knowledge map in `knowledge/mocs/`.
- Content: capture an idea to `content/idea/`, validate it into `content/production/`, diagnose a block at any stage. Content stages are states, never a mandatory sequence.
- Search brain: read `_agent/hot.md`, `index.md`, then the smallest relevant set of files.
- Lint vault: report dead links, orphan notes, frontmatter gaps, stale index entries, and missing MOCs.
- Weekly review: manually create a weekly review in `calendar/`.
- Update daily: append a human/product session recap to today's daily note.

## Global Skills Operating On This Vault

`capture`, `search-brain`, `create-note`, `create-source`, `create-task`, `update-brain`, `create-content-idea`, `validate-content-idea` and `unblock-content` are global skills (`system/skills/`), invocable from any session, not just under this vault's own folder. They resolve this vault via `$VAULT_PATH` (default `~/AI OS/second-brain`) and follow the canonical schemas in `_agent/templates/`. The skills in `.claude/skills/` here are the vault-session ones: create-goal (GPS coaching), morning-ritual, challenge-me, maintenance (process-inbox, lint-vault, generate-moc, weekly-review, update-daily) and references (obsidian-*, json-canvas, defuddle).
