---
name: weekly-review
description: Create a manual weekly review from calendar notes, projects, inbox themes, and hot cache context.
---

# Weekly Review

## Purpose

Create a weekly review in `calendar/` when the user asks for it. This is manual in V1, not an automatic scheduled job.

## Workflow

1. Read `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. Determine the week from the user's request or current date.
4. Read the daily notes for that week, active projects, recent inbox themes, and relevant goals.
5. **Project triage** (recovered from the previous assistant's weekly review):
   - For each project in `projects/on/` and `projects/ongoing/`: still active? Propose moving completed ones to `archive/`, stalled ones to `sleeping/` or `simmering/`.
   - Check `projects/simmering/`: anything ready to activate?
   - Load check: if on + ongoing > 5, flag it and ask which project to demote (healthy threshold is 4-5).
   - Propose the moves; never move files without explicit agreement.
6. **Content triage** (skip entirely when `content/` is empty):
   - `content/production/*.md`: anything frozen at the same `stage` for more than a week, or past its `publish_date`.
   - `content/idea/*.md`: ideas untouched for 15 days or more — propose `content/archive/`, or working one through `validate-content-idea`.
   - `content/published/*.md`: anything that actually went out and deserves a line in the review.
   - Propose the moves; never move files without explicit agreement.
7. Create `calendar/YYYY-MM/week-XX-review.md` or update an existing weekly review for that week.
8. Use sections:
   - `## Summary`
   - `## Decisions`
   - `## Progress`
   - `## Blockers`
   - `## Next Week`
   - `## Links`
9. Update `_agent/hot.md` with durable decisions and next active threads.
10. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not invent a weekly narrative when source notes are thin; state gaps clearly.
