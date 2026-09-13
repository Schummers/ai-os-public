# Connections

High-level inventory of systems this AI OS can reach. This file is not the technical config and must not contain secrets.

| System | Domain | Access | Mechanism | Config Source | Auth Location | Last Checked | Notes |
|---|---|---|---|---|---|---|---|
| Filesystem | Knowledge / Projects | read/write | local filesystem | n/a | macOS user permissions | 2026-07-23 | Primary access to `AI OS/`, `second-brain/`, and `projects/`. |
| Claude Code | Agent runtime | read/write | `~/.claude` projection | `system/scripts/sync-claude.sh` | local Claude auth | 2026-07-23 | Skills, agents, commands projected from `system/`. |
| Codex | Agent runtime | read/write | `~/.codex` projection | `system/scripts/sync-codex.sh` | local Codex auth | 2026-07-23 | Skills projected from `system/` where compatible. |
| GitHub | Code | read/write guarded | `gh` CLI / connector | `system/cli/tooling.md` | Keychain / `gh auth` | 2026-07-23 | Prefer `gh` CLI for repo work. |
| Supabase | Databases | read/write guarded | `supabase` CLI / MCP | `system/cli/tooling.md` | local CLI auth / project env | 2026-07-23 | Production writes require explicit confirmation. |
