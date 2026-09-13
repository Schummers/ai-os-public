# Skills

Two regimes coexist here, and the rule is: **ownership decides the mechanism.**

## Regime 1 — Skills you do not own: plugins

Skills written by someone else are consumed as plugins, never copied. The marketplace handles updates, and both runtimes read the same marketplaces.

| Plugin | Marketplace | Scope | Notes |
|---|---|---|---|
| `mattpocock-skills` | `mattpocock` (upstream `mattpocock/skills`) | global | 22 engineering skills. Update: `claude plugin update mattpocock-skills`. Sourced from upstream directly, so there is nothing to reconcile. |
| `context7`, `supabase`, `vercel`, `playwright` | `claude-plugins-official` | global | |
| `posthog`, `linear`, `design`, `frontend-design` | various | **project only** | Enable in the project's `.claude/settings.json`. |
| `taste-skill` | `Leonxlnx/taste-skill` | project only | `npx skills add https://github.com/Leonxlnx/taste-skill`. Installé dans `~/agency/tooling/meta-ads-website` (13 skills sous `.agents/skills` + `.claude/skills`, `skills-lock.json` à la racine), gitignoré : c'est de l'outillage local, pas du contenu du template. |

Never copy a plugin's files into this folder. That would shadow the plugin version and silently freeze it.

## Regime 2 — Skills you own: this folder

Organised by domain. Real directories, versioned in this repo, portable Markdown.

```text
engineering/   qa-review, qa-assert, setup-pre-commit
productivity/  guide-me
vault/         capture, search-brain, create-note, create-source, create-task,
               update-brain, create-content-idea, validate-content-idea,
               unblock-content — operate on the second brain from any session
vault-session/ challenge-me, create-goal, defuddle, generate-moc, json-canvas,
               lint-vault, morning-ritual, obsidian-bases, obsidian-cli,
               obsidian-markdown, process-inbox, update-daily, weekly-review —
               project-only, symlinked into second-brain/.claude/skills/
_active/       symlinks only — the projection surface
```

`_active/` is a **curation layer**: it holds nothing but symlinks pointing into the domain folders. `~/.claude/skills` and `~/.codex/skills` both point at `_active/`, so whatever is symlinked there is global in both runtimes.

Currently global: `guide-me`, `finish-branch`, plus the whole `vault/` domain. The three content skills operate on `content/` — a publishable unit (reel, post, carousel) is a sibling of a project, not a kind of project; `create-content-idea` captures without asking, `validate-content-idea` is the single door from `content/idea/` to `content/production/`, `unblock-content` diagnoses a block at any stage. `guide-me` is the **router**: it reads the current request and folder, discovers the real skill inventory (never a hardcoded list), and recommends at most three skills with the why and the how. It is the entry point when you don't remember what exists — start there rather than guessing.

The split rule for brain skills: **"from anywhere" verbs are global** (capture, search-brain, create-note, create-source, create-task, update-brain, create-content-idea, validate-content-idea, unblock-content — all model-invoked, `query-vault` renamed `search-brain` on 2026-07-24; only `grill-me`, a plugin skill, stays user-invoked), **everything tied to a vault working session stays project-scoped** in `second-brain/.claude/skills/` (create-goal, morning-ritual, challenge-me, process-inbox, lint-vault, generate-moc, weekly-review, update-daily, plus the obsidian/defuddle reference skills). Global vault skills resolve the vault via `$VAULT_PATH` (default `~/AI OS/second-brain`) so a fork works without editing them.

**Project-scoped is about where a skill activates, not where it lives.** Those 13 skills are sourced here, in `vault-session/`, and projected into the vault as symlinks by `system/scripts/link-vault-skills.sh` — the same pattern as `agency/*`. They used to be real folders in the vault *and* a copy under `templates/second-brain/.claude/skills/`, which is how morning-ritual, create-goal, challenge-me, weekly-review and process-inbox drifted from the copy a fork actually receives (found 2026-08-26: the template's morning-ritual was a month behind, missing the `gws` syntax, the goal sorting and the whole `proposals`/`plan` contract). The template now ships that folder empty and the script does the linking, so a second copy cannot exist. They are written for **any** user, not for the repo owner: no first name in the prose, and the greeting reads the name from `system/preferences/user.md` (untracked — see `docs/adr/0004`). That claim was **false until 2026-08-27**, and it was a fork of this repo that found it: `create-goal` hardcoded five `[[wikilinks]]` to notes that exist only in the owner's vault, `challenge-me` and `morning-ritual` two more, and `process-inbox` listed `knowledge/bien-immobilier/` (owner-only) while omitting `knowledge/mocs/` (canonical). All four now reference the user's own notes as an **optional** enrichment discovered at runtime, never a prerequisite, and never by a presupposed filename. When touching these skills, re-read this paragraph: the claim is only true as long as someone keeps checking it. Their `/` mirrors live in `system/commands/`. `create-goal`, `morning-ritual` and `challenge-me` are ports of the previous assistant's `gps`, `morning-ritual` and `coaching-nudge` skills, stripped of the dead runtime (Telegram, the old CLI, heartbeat).

Everything else is project-only — symlink it from the project's `.claude/skills/` when that repo needs it:

- `qa-review`, `qa-assert`: only useful on a repo with a running app and tickets.
- `setup-pre-commit`: run once per repo, no reason to carry it in every session.
- Skills that serve **one domain** do not live here at all: they live in that
  domain's own repo, next to what they act on (`agency/skills/`,
  `product-wiki/skills/`). Moved out on 2026-08-27. The 2026-08-12 reasoning that
  had put `agency/*` here — "a skill locked in one repo cannot serve the rest of
  the domain" — died the day the domain itself became a repo. Keeping them here
  meant this repo carried a prospection playbook, a Calendly link, an employment
  history and named audits of real prospects. The test is simple: *if I handed
  this folder to a stranger tomorrow, would it bother me?*

**Symlinks into a repo must be gitignored.** A committed symlink is broken for
anyone cloning that repo. `agency/portfolio/.gitignore` carries the rule for
`case-study`; folders on the Drive plan need nothing, the root `.gitignore`
already keeps their content out.

`_active/.system/` is Codex's own managed folder, not AI OS content. It is gitignored.

`compta-import` (finance, single-workspace, high privilege — bank account details, Notion IDs) used to live here and has been moved out of this repo's history entirely (2026-07-25 scrub, see `SETUP.md`). It now lives as a real folder (not a symlink) in `admin/budget/.claude/skills/compta-import/`, on the Drive plan with its data, gitignored at the root like the rest of `admin/`.

## Adding a skill

- Global: write it under its domain folder, then `ln -s ../<domain>/<name> _active/<name>`.
- Project-only: write it under its domain folder, then symlink it from the project's `.claude/skills/`.
- Never write a skill directly into `_active/`.

## What the plugin does not ship

`mattpocock-skills` v1.2.0 declares 22 skills explicitly in `plugin.json`: all of `skills/engineering/` and all of `skills/productivity/`. His `deprecated/`, `in-progress/`, `misc/` and `personal/` buckets ship with the repo but are **not** loaded by the plugin.

Reviewed 2026-07-24: `batch-grill-me` adopted globally (**dead since — replaced by the `grill-me` plugin skill, confirmed 2026-08-27. Do not recreate it: `grill-me` is the grill command everywhere outside code and `system/`, where `grill-with-docs` applies. All references removed from the docs on 2026-08-27, they had been pointing at a skill that existed nowhere**), `setup-pre-commit` adopted project-only. Everything else rejected.

Anything rejected is still public at `github.com/mattpocock/skills` under `skills/{deprecated,in-progress,misc,personal}/`. To bring one back, copy the folder into a domain here, then symlink it.
