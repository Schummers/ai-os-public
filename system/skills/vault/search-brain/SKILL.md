---
name: search-brain
description: Search the second brain — hot cache, index, then the smallest relevant set of vault files — and answer with grounded file references. Use when the user asks what their brain/vault/notes know about something, from any project.
---

# Search Brain

## Vault Resolution

The vault is `$VAULT_PATH` if set, otherwise `~/AI OS/second-brain`. All paths below are relative to that root.

## Purpose

Answer questions from the second brain with grounded file references and clear uncertainty.

## Workflow

1. Read the vault's `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Read `index.md`.
4. Search with `rg` before broad file reads.
5. Read the smallest relevant set of files from `knowledge/`, `calendar/`, `projects/`, and `inbox/`.
6. Answer with:
   - confirmed facts from files
   - likely inferences clearly marked as inferences
   - missing or stale areas
   - file references for important claims
7. If the query reveals durable new context, propose an update rather than silently modifying notes.
8. Show changed files only if a write was explicitly requested.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not claim the vault says something unless a file supports it.
