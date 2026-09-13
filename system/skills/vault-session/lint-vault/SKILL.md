---
name: lint-vault
description: Audit the second brain for broken links, stale runtime references, missing frontmatter, orphan notes, and missing MOCs.
---

# Lint Vault

## Purpose

Produce a practical quality report for the vault without changing user notes by default.

## Workflow

1. Read `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Scan active operating files first: `AGENTS.md`, `.claude/`, `_agent/hot.md`, `index.md`.
4. Scan vault content for:
   - old path terms: `brain/`, `atlas/`, `efforts/`
   - old frontmatter terms in new files: `type: effort`, `effort:` (renamed to `type: project` / `project:` on 2026-07-24; historical calendar/migration files are exempt)
   - old runtime concepts in active instructions
   - wikilinks with no matching note
   - missing frontmatter on durable notes
   - orphan notes with no inbound or outbound links
   - topics with enough material to deserve a MOC
5. Write the report to `_agent/lint-reports/YYYY-MM-DD-<slug>.md`.
6. Update `_agent/hot.md` only if the report changes the current operating context.
7. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not rewrite vault content during lint unless the user explicitly asks for fixes.
