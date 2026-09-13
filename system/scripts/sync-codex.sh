#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dry-run}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SYSTEM="$ROOT/system"
CODEX_HOME="$HOME/.codex"

if [[ "$MODE" != "dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: $0 [dry-run|--apply]"
  exit 2
fi

src="$SYSTEM/skills/_active"
dst="$CODEX_HOME/skills"

if [[ ! -d "$src" ]]; then
  echo "SKIP skills: source folder missing: $src"
  exit 0
fi

echo "LINK $dst -> $src"

if [[ "$MODE" == "--apply" ]]; then
  mkdir -p "$CODEX_HOME"
  if [[ -e "$dst" && ! -L "$dst" ]]; then
    mv "$dst" "$dst.pre-ai-os-system-$(date +%Y%m%d-%H%M%S)"
  fi
  ln -sfn "$src" "$dst"
fi

prefs="$SYSTEM/preferences/user.md"
dstprefs="$CODEX_HOME/AGENTS.md"
if [[ -f "$prefs" ]]; then
  echo "LINK $dstprefs -> $prefs"
  if [[ "$MODE" == "--apply" ]]; then
    if [[ -e "$dstprefs" && ! -L "$dstprefs" ]]; then
      mv "$dstprefs" "$dstprefs.pre-ai-os-system-$(date +%Y%m%d-%H%M%S)"
    fi
    ln -sfn "$prefs" "$dstprefs"
  fi
fi

echo "Mode: $MODE"
echo "Codex config remains local at $CODEX_HOME/config.toml."
