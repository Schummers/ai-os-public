# MCP Registry

Human-readable source of truth for MCP usage. Tool-specific config files are projections or safe fragments.

## Global

| Name | Tool Support | Transport | Auth | Risk | Status | Notes |
|---|---|---|---|---|---|---|
| context7 | Claude, Codex | plugin `context7@claude-plugins-official` | plugin auth | low | active | Current library docs. |
| supabase | Claude, Codex | plugin `supabase@claude-plugins-official` | Supabase CLI auth | high | guarded | Plugin carries the skills; `supabase` CLI does the writes. Production writes need explicit confirmation. |
| vercel | Claude, Codex | plugin `vercel@claude-plugins-official` | Vercel CLI auth | medium | active | Same split: plugin for knowledge, `vercel` CLI for operations. |
| playwright | Claude, Codex | plugin `playwright@claude-plugins-official` | n/a | low | active | Required by the `qa-review` runtime pass. |
| notion | Claude, Codex | hosted connector | OAuth | medium | optional | Read-heavy context. Writes for `compta-import` go through the Notion API token, not this connector. No skill hard-depends on it. |
| fireflies | Claude | hosted connector | OAuth | low | optional | Call transcripts and meeting notes. Connect only if the human records meetings. |
| gmail / google-calendar | Claude | hosted connector | OAuth | high | prefer-cli | Prefer `gws` CLI. Sending mail always requires explicit confirmation. |

## Project-scoped only

Enable these in the project's `.claude/settings.json`, never globally.

| Name | Where | Why |
|---|---|---|
| ~~posthog~~ | ~~analytics projects~~ | **Abandonné le 2026-09-02.** ~40 outils chargés pour ce que trois endpoints REST donnent déjà. Remplacé par `system/scripts/phog.sh` (Keychain + HogQL), plus puissant et sans coût de contexte. |
| linear | projects using Linear | Issue tracking is per-project. |
| design (knowledge-work-plugins) | design projects | Bundles 9 MCP servers (asana, atlassian, figma, gmail, google-calendar, intercom, linear, notion, slack); most unauthenticated, noisy at session start. |
| frontend-design | design/web projects | Narrow scope. |
| taste-skill (Leonxlnx) | design projects | Install with `npx skills add https://github.com/Leonxlnx/taste-skill`. Supersedes the old local copies of `design-taste-frontend`, `image-to-code`, `minimalist-ui`, `high-end-visual-design`. |

## Rules

- Prefer CLI for mature operational writes.
- Prefer MCP/connectors for read-heavy context.
- A plugin is a bundle (skills, agents, sometimes an MCP server). It never installs the CLI; the two coexist by design.
- Keep OAuth state and tokens out of this repository.
- Hosted connectors live on the Claude account, not in `system/`. This table documents them, it does not configure them: each human connects their own, and headless/cron runs may not have them.
- Project-specific MCPs belong in that project unless they are genuinely global.
