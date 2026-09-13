# AI OS Operating Manual

This workspace is an AI Operating System — global system layer, a second brain, and domain workspaces. New to this repo? Start with `SETUP.md`.

## Structure

- `system/`: canonical tool-agnostic source for global skills, agents, commands, MCP inventory, CLI inventory, env templates, and projection scripts.
- `second-brain/`: durable knowledge, calendar, projects, inbox, and agent-maintained memory. A **nested repo** with its own remote (GitHub plan), gitignored here — clone it into place per `SETUP.md`. Scaffold for a fresh vault: `templates/second-brain/`.
- **Domain folders** (`admin/`, `agency/`, `cycling/`, `immobilier/`, `product-wiki/`): personal or product workspaces, one per area of the owner's life or work. **Invisible to this repo** — the root `.gitignore` is a whitelist, so nothing under a domain can enter it, ever. Each has a **local git repo with no remote** (history and session grouping, not backup); its backup is Drive mirroring. Some of its subfolders are full repos with their own remotes when they hold real source. See "Creating a new domain" below.
- `aios-app/`: local Next.js app that reads the vault and renders it as a dashboard in Claude Code's right panel. **Not a domain** — a system surface onto the vault, like the `vault-session` skills, which is why it lives in this repo rather than in a nested one. See `aios-app/CLAUDE.md`.
- `deliverables/`: cross-domain registry of finished work only — one subfolder per domain, each holding final PDFs, PPTs, exports, videos. Not a domain folder itself: no working files, nothing arrives here until done. A file is **moved** here from its domain work folder, never copied — see `docs/adr/0001-registre-unique-taches-et-deliverables.md`.
- `connections.md`: high-level map of systems this AI OS can reach.

## Backup Plans

**This repo contains the system only.** `system/`, `templates/`, `aios-app/`, `docs/` and the root Markdown — nothing personal, nothing domain-specific. It is meant to be handed to other people. The `.gitignore` is a **whitelist**: everything is ignored unless a line names it, so a new folder is private by default and no one has to remember to exclude it. Adding something to this repo is a deliberate act. See `docs/adr/0003`.

Three plans, decided at the folder level, never for the whole of `AI OS/` at once:

- **GitHub plan**: code and text where diffs matter *and* that must survive this disk. `system/`, the second brain, and any folder that is itself a codebase (own repo, own remote — `agency/portfolio/`, `cycling/<un-jeu>/`, `product-wiki/`).
- **Drive plan**: heavy binaries and personal documents where the diff is irrelevant and only the backup counts. Lives physically under `AI OS/<domain>/`, synced to Google Drive via "sync this folder" (local is the source, Drive is the backup, not the reverse).
- **Secrets**: neither plan. Keychain only, referenced by path in a domain's `CLAUDE.md`, never written to a file.

**A domain combines the first two, and that is not a contradiction.** It carries a *local* git repo with no remote — history on its pilot Markdown, `git checkout --` to undo an agent, and its own workspace group in the Claude Code sidebar (which groups by git root, not by cwd) — while its heavy content is backed up by Drive. A local repo is not a backup: it sits on the same disk as the files it tracks.

The real constraint is narrower than "never both": **never mirror the folder that holds the `.git`.** A `.git` directory synced by Drive corrupts itself, so mirror the heavy subfolders (`agency/cv/`, `agency/pipeline/`) and leave the domain root alone. Decided 2026-08-27, `docs/adr/0003`; the earlier rule was "one folder, one plan".

**Check that a plan is actually running, never assume it.** Verified 2026-08-27: no folder was mirrored and no Time Machine destination existed, so the Drive plan had been a written intention since July 2026 and nothing outside a GitHub remote was backed up at all.

```bash
cp ~/Library/Application\ Support/Google/DriveFS/*/mirror_sqlite.db /tmp/m.db
sqlite3 /tmp/m.db "select count(*) from mirror_item;"   # 0 = nothing is mirrored
tmutil destinationinfo
```

## Creating a New Domain

1. Create `AI OS/<domain>/`, `git init` inside it, and **add no remote**. **Nothing to add to the root `.gitignore`** — it is a whitelist, so the new folder is already invisible to this repo, along with everything you will ever put in it. The domain is private by default and no one has to remember anything.

   A local repo is not a backup: it sits on the same disk as the files it tracks. What it buys is history on the pilot Markdown, `git checkout --` to undo an agent, and a separate workspace group in the Claude Code sidebar (which groups by git root, not by cwd). **Backup is a separate decision** — put the domain on Drive mirroring, step 2.
2. Create `AI OS/<domain>/` and give it a `CLAUDE.md`: what each subfolder is, the plan, and agent-first classification rules (where does a newly received document/file go). If the domain has internal work subfolders, each one gets its own `archive/` (created lazily, on first use) for work that is no longer active without being a finished deliverable or a second-brain source — archive locally, where the work happened. A flat domain gets a single `archive/` at its root instead.
3. Write the domain's own `.gitignore` **as a whitelist** (`/**` then named exceptions, like the root one), deciding the plan **per subfolder**. Track the pilot Markdown (`CLAUDE.md`, `CONTEXT.md`, `docs/adr/`) plus whatever is genuinely source; ignore the heavy and personal content, which Drive backs up. A subfolder that is a real codebase gets its own repo and its own remote (`agency/portfolio/`, `cycling/<un-jeu>/`, `product-wiki/`); list it at the **end** of the domain's `.gitignore`, since the last matching rule wins.

   Reserved names only, never `!/**/*.md`: an ordinary Markdown note in a domain may hold a quote or a negotiated price. **A wildcard by extension is not a safety mechanism** — `!/cv/**/*.html` was written to version CV templates and silently committed a complete cover letter, phone number included (2026-08-27, `docs/adr/0003`). If a joker re-includes a whole extension, name the content exceptions right after it, on their own lines.

   **Caution if this domain is Drive-mirrored**: a `.git` directory inside a mirrored folder can corrupt itself. Mirror the heavy subfolders that actually hold the binaries, not the domain root that holds `.git`.
4. A skill that serves only this domain lives **in the domain**, in `<domain>/skills/<name>/`, symlinked into `<domain>/<subfolder>/.claude/skills/`. Such a skill carries the domain's vocabulary, contacts, prices and commercial positioning, so it must not sit in the shared system repo — that is exactly how a prospection playbook, a Calendly link and five named client audits ended up in it until 2026-08-27. `system/skills/` holds only what works for anyone. See `system/skills/README.md` Regime 2.
5. Give the domain its subfolder in `deliverables/` at the same moment. **It stays out of git**, like the domain itself — only `deliverables/CLAUDE.md` at the root is versioned, and it names no domain. A casier's name alone says what its owner works on.
6. See `admin/CLAUDE.md` for a worked example.

## Domain Work Folders ↔ Second Brain Tasks

`second-brain/projects/` is the single registry of tasks and projects, across every domain — a domain folder never keeps its own copy of that list. What a domain holds is the **work folder** produced while executing a task: named after the subject (`audit-acme/`), never after a task ID. The link runs one way, from the task's text to the folder path, not the reverse; keeping folder names aligned with how a task names its subject is what lets `/update-brain` write that link back (soft coupling, known fragility).

A finished deliverable does not stay in the domain either: it is **moved** to `deliverables/<domain>/`, and the vault task or note then points there. `second-brain/attachments/` remains the vault's only binary zone, unrelated to this rule.

## Public Snapshot

Two repos, one source. `Schummers/ai-os` (this one) is private and is the only
place anyone commits. `Schummers/ai-os-public` is a **snapshot**: one commit,
no history, overwritten on every sync. It exists so the portfolio can link to
something readable; it accepts no pull requests. The private history is not
clean (commits before 2026-08-27 carry personal data), which is why it is never
published as-is — see `docs/adr/0003`.

Syncing is **manual and deliberate**, never automatic: a push to the private
`main` publishes nothing. When the public copy should catch up:

```bash
bash system/scripts/sync-public.sh
```

The script refuses to run on an uncommitted tree, aborts if the snapshot
contains `$HOME`, `user.md`, `style.md`, a secret, **or any proper name from
`system/scripts/public-denylist.txt`**, then force-pushes a single commit. The
same pattern serves `product-wiki` (`sync_public.sh` at its root, which also
strips the raw text of the books).

**Write these docs for a stranger, not for their owner.** The deny list exists
because "re-read it as a stranger would" was the rule for months and nobody
ever did: on 2026-09-13 the published snapshot carried 192 occurrences of a
first name and of private project names — product specs written as user stories
("<owner> must see…"), a design system's lineage to a client project, real vault
tasks used as mockup content. None of it was a secret; all of it said what its
owner works on. Name the role, not the person: `l'utilisateur`, `the owner`,
`DS-source`, `<un-projet>`.

When a name legitimately belongs in a doc, it belongs in a domain folder or in
the vault — both invisible to this repo. Adding a name to the deny list costs
one line; a snapshot is force-pushed and public until someone notices.

## Taking a File Out of the Inbox

`second-brain/inbox/` is a **transit zone, not storage**. A file sits there because its destination has not been decided yet, not because the inbox is where it lives.

This rule is here, in the root manual, rather than in the `process-inbox` skill, because the sessions that get it wrong are the ones that never load that skill: you are working in `agency/portfolio/` or `admin/`, you need an image or a PDF that was dropped in the inbox, and you go fetch it directly.

**When you take a file out of `inbox/` for any purpose, move it. Do not copy it.**

- Use `mv` (or `git mv` inside a repo). After the operation the file exists in exactly one place.
- A copy leaves the original behind with nothing marking it as consumed. The next agent processes it a second time, and the user is the one who discovers the duplicate weeks later.
- **If you genuinely need a copy** (two destinations need it, or the original must stay pending a decision), that is allowed, but **say so explicitly in your reply and say why**. A copy is a deliberate act, never a default.
- **Before putting an inbox file into a repo, check whether that repo has a remote and whether it is public.** Screenshots and documents that pass through the inbox routinely carry personal data. On 2026-09-10 an unblurred dashboard screenshot (nominative emails, a flight, task titles) came within one step of landing in the public portfolio repo.

The same applies to `attachments/`: it is the vault's binary zone, not a parking lot for files belonging to a domain.

## Core Rules

- Treat `system/` as the source. Treat `~/.claude` and `~/.codex` as projections.
- Do not commit real secrets, tokens, cookies, OAuth state, prod database URLs, or personal credentials.
- Prefer CLI for mature operational tools when it is safer and more auditable than MCP.
- Use MCPs for live context and connector access when they reduce friction without increasing risk.
- Keep root files short. Durable knowledge belongs in `second-brain/`.
- Project-specific rules belong in the project folder.

## Parallel Sessions

Several sessions of the same project run at the same time, on purpose — it is
what lets a multi-task project advance in a day. Two rules keep them from
colliding, and they are the whole of it. No branches, no worktrees: the
collisions are on the disk and on Drive, which no git isolation covers.

- **A session commits only its own paths.** Never `git add -A`, never
  `git commit -a`. A broad add sweeps up whatever a neighbouring session is
  writing and commits it under an unrelated message — it happened five times on
  2026-09-13, once to git itself.
- **Moving in parallel is safe, deleting in parallel is not.** During a
  migration, a session moves files and never deletes any; deletions are batched
  into one final pass that runs alone, on a validated table. On 2026-09-13 two
  sessions deleted the same folder without knowing, and only luck (everything
  was on GitHub) made it harmless.

The corollary that makes both work: **one task owns one source folder and one
target folder.** If two tasks need the same folder, they are one task.

## Stress-Testing Decisions (Grill)

**The user picks the skill, per session** — do not infer it from the folder. `grill-with-docs` when the session should leave documentation behind (`CONTEXT.md` glossary + `docs/adr/` for hard-to-reverse, surprising, real-trade-off decisions, confronted against what is actually there); `grill-me` when it should not.

One absolute exception: **inside `second-brain/`, only `grill-me`.** A vault is already made of notes; durable decisions there belong in notes and project journals, not a second glossary.

In a domain folder, `CONTEXT.md` and `docs/adr/` hold **operational** documentation — the domain's working vocabulary and the reasons behind its recurring choices. Theoretical knowledge still belongs in the vault. These files are created lazily (only when a first term or decision needs writing) and stay in git even though the domain's content does not — see "Creating a New Domain", step 3.

## Tool-Agnostic Policy

Global skills should be written in portable Markdown first. Claude-specific and Codex-specific differences should live in projection scripts or tool-specific fragments, not in the canonical skill content unless unavoidable.

## Write Policy

- You may create and update files in `system/`, `second-brain/`, `aios-app/` and the domain folders when asked to implement a change. There is no root `projects/`: the task and project registry is `second-brain/projects/`.
- Show diffs or summarize concrete file changes after editing.
- Ask before destructive deletion, credential changes, production database writes, or force operations.
