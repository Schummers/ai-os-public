---
name: process-inbox
description: Process second-brain inbox captures into notes, sources, projects, tasks, calendar entries, or proposals.
---

# Process Inbox

## Purpose

Turn inbox captures into durable vault material. The capture is a transport format, not an archive: once its content lives in the vault, the capture goes away.

## Workflow

1. Read `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Select the smallest useful batch from `inbox/`; default to 5-15 files unless the user specifies another scope.
4. Classify each capture as one of:
   - `knowledge/notes/`
   - `knowledge/sources/`
   - `knowledge/goals/`
   - `knowledge/mocs/`
   - `projects/<state>/`
   - `projects/tasks/`
   - `calendar/`
   - `_agent/proposals/`
5. Create or update target files using wikilinks. For notes, sources, projects, and tasks, follow the canonical schemas in `_agent/templates/` (single source of truth for frontmatter and rules).
6. Close each capture with a **status that exists in the schema** — `_agent/templates/task.md` defines exactly four: `todo | doing | done | dropped`. There is no `processed` status; do not invent one. Then apply the rule that matches what actually happened to the content:

   - **Content fully reversed into a vault file** (a note, a source, a task, a project backlog line): **delete the original capture.** The vault file is now the only carrier, and keeping a second copy in `inbox/archive/` or `projects/tasks/archive/` produces a silent duplicate. Name the destination in the target file's own `## Journal`, not in a copy of the capture. This is the normal case and needs no confirmation, because nothing is lost: the content is in the vault and the deletion is in git.
   - **Capture abandoned, with no other trace anywhere**: set `dropped` (or `done` if it turned out to be already done), add a dated `## Journal` line with a one-line reason, and move it to `projects/tasks/archive/`. Archiving is for what leaves no descendant. The journal line is the only record that will exist, which is why it must say *why*, not just *that*.
   - **Anything you are not certain falls in the first case**: archive rather than delete. Uncertainty resolves toward keeping.

   Rule changed 2026-09-10, after a triage of 118 captures. The previous rule was "never delete, always archive", and it mechanically created a duplicate on every successful processing: two research notes sat in `inbox/` for weeks while their full content was already in `knowledge/sources/`. An archive that holds content living elsewhere is not a safety net, it is a second source of truth.

7. Update `_agent/hot.md` when the processing changes durable context.
8. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Deleting a capture whose content is fully reversed into the vault is expected, not destructive, and is the one deletion this skill performs without asking. **Everything else in the vault still requires explicit confirmation before deletion.**
- Use Obsidian wikilinks for internal links.
- If the classification is uncertain or sensitive, write a proposal under `_agent/proposals/`.
