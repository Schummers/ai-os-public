---
name: generate-moc
description: Generate or refresh a map of content in knowledge/mocs from related notes, sources, goals, and projects.
---

# Generate MOC

## Purpose

Create or refresh a Map of Content that helps humans and agents navigate a topic.

## Workflow

1. Read `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Identify the topic and search the vault for related notes, sources, goals, projects, tasks, and calendar entries.
4. Create or update `knowledge/mocs/<topic>.md`.
5. Use this structure:
   - `# <Topic>`
   - `## Core Notes`
   - `## Sources`
   - `## Projects And Tasks`
   - `## Open Questions`
   - `## Maintenance Notes`
6. Prefer links plus short annotations over long copied summaries.
7. Update backlinks in obvious high-value notes only when useful.
8. Update `_agent/hot.md` when the MOC changes durable context.
9. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- MOCs are automatic and may be edited directly, but do not rewrite source notes just to fit a MOC.
