#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dry-run}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SYSTEM="$ROOT/system"
CLAUDE_HOME="$HOME/.claude"

if [[ "$MODE" != "dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: $0 [dry-run|--apply]"
  exit 2
fi

plan_link_from() {
  local name="$1"
  local src="$2"
  local dst="$CLAUDE_HOME/$name"

  if [[ ! -d "$src" ]]; then
    echo "SKIP $name: source folder missing: $src"
    return
  fi

  echo "LINK $dst -> $src"

  if [[ "$MODE" == "--apply" ]]; then
    mkdir -p "$CLAUDE_HOME"
    if [[ -e "$dst" && ! -L "$dst" ]]; then
      mv "$dst" "$dst.pre-ai-os-system-$(date +%Y%m%d-%H%M%S)"
    fi
    ln -sfn "$src" "$dst"
  fi
}

plan_link() {
  plan_link_from "$1" "$SYSTEM/$1"
}

plan_file() {
  local src="$1"
  local dst="$2"

  if [[ ! -f "$src" ]]; then
    echo "SKIP $(basename "$dst"): source file missing: $src"
    return
  fi

  echo "LINK $dst -> $src"

  if [[ "$MODE" == "--apply" ]]; then
    mkdir -p "$(dirname "$dst")"
    if [[ -e "$dst" && ! -L "$dst" ]]; then
      mv "$dst" "$dst.pre-ai-os-system-$(date +%Y%m%d-%H%M%S)"
    fi
    ln -sfn "$src" "$dst"
  fi
}

plan_link_from skills "$SYSTEM/skills/_active"
plan_link agents
plan_link commands

plan_file "$SYSTEM/preferences/user.md" "$CLAUDE_HOME/CLAUDE.md"

echo "Mode: $MODE"
echo "Claude settings remain local at $CLAUDE_HOME/settings.json."
