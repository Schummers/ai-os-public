---
name: create-note
description: Create or update a durable personal knowledge note in knowledge/notes.
---

# Create Note

## Vault Resolution

The vault is `$VAULT_PATH` if set, otherwise `~/AI OS/second-brain`. All paths below are relative to that root.

## Purpose

Create a durable note from user-authored thinking, decisions, concepts, or frameworks.

## Workflow

1. Read the vault's `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Create the note in `knowledge/notes/` using a clear lowercase slug.
4. Follow the canonical schema in `_agent/templates/note.md` (single source of truth for frontmatter and rules).
5. Write in concise Markdown with wikilinks to related notes, goals, projects, sources, or MOCs.
6. If the note synthesizes external material, link the source in `knowledge/sources/`.
7. Update relevant MOCs in `knowledge/mocs/` when obvious.
8. Update `_agent/hot.md` when the note changes durable context.
9. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not silently overwrite an existing note with a different meaning.
