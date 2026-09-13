---
name: capture
description: Capture raw thoughts, links, tasks, or pasted material into the second-brain inbox without processing them deeply.
---

# Capture

## Vault Resolution

The vault is `$VAULT_PATH` if set, otherwise `~/AI OS/second-brain`. All paths below are relative to that root.

## Purpose

Capture raw input into `inbox/` with enough metadata that it can be processed later.

## Workflow

1. Read the vault's `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Create one Markdown file in `inbox/` using a lowercase slug from the capture title.
4. Add flat frontmatter with `type: capture`, `created: YYYY-MM-DD`, and `status: inbox`.
5. Preserve the user's wording. Do not over-interpret the capture.
6. Add an `## Agent Notes` section only when useful for routing.
7. Update `_agent/hot.md` if the capture changes durable context.
8. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not move the capture out of `inbox/` in the same operation unless the user explicitly asks.
