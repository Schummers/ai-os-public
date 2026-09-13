---
name: update-daily
description: Append a human/product session recap, decision, or pivot to today's daily note in calendar.
---

# Update Daily

## Purpose

Keep `calendar/` as the human/product timeline for session recaps, decisions, pivots, and cross-project updates.

## Workflow

1. Read `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Determine today's date with `date +%Y-%m-%d`.
4. Ensure `calendar/YYYY-MM/` exists.
5. Create or append to `calendar/YYYY-MM/YYYY-MM-DD.md`.
6. Use sections:
   - `## Session Recap`
   - `## Decisions`
   - `## Follow-Ups`
   - `## Links`
7. Keep technical logs out of daily notes; put those in `_agent/logs/`.
8. Update `_agent/hot.md` when the recap changes durable context.
9. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Calendar is human/product context, not an agent execution log dump.
