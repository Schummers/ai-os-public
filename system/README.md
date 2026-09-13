# AI OS System

This folder is the canonical, tool-agnostic source for the global AI operating layer.

## Source Of Truth

- `skills/`: skills you own, organised by domain and projected via `skills/_active`. Third-party skills are consumed as plugins instead. See `skills/README.md`.
- `agents/`: reusable subagent definitions.
- `commands/`: reusable slash-command style workflows.
- `templates/`: reusable Markdown and config templates.
- `mcp/`: human registry and safe config fragments for MCP servers.
- `cli/`: reproducible CLI inventory and install manifests.
- `preferences/`: canonical user preferences (`user.md`) and writing style (`style.md`), projected to `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`.
- `env/`: safe environment templates and secret location registry.
- `scripts/`: projection and audit scripts.

## Projection Rule

Tool-specific folders such as `~/.claude` and `~/.codex` are generated projections. Do not edit them as source when the same artifact exists here.

Only `skills/_active/` is projected to global agent runtimes, and it contains symlinks only. Plugins are declared per scope in `~/.claude/settings.json` and `~/.codex/config.toml`, not projected from here.

## Secret Rule

Never commit real secrets. Local secret files may live in `env/local/`, but that folder is ignored by Git. Prefer Keychain or 1Password references for high-value credentials.
