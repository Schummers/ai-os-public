#!/usr/bin/env bash
# Project the vault-session skills into the second brain.
#
# Source of truth: system/skills/vault-session/ (versioned in ai-os, shared with
# anyone who forks it). The vault only ever holds symlinks, so the two copies
# cannot drift apart the way templates/second-brain/.claude/skills/ used to.
#
# Idempotent: run it after a fresh clone, after adding a skill, or any time the
# vault's .claude/skills looks wrong. Never deletes real directories — an
# unexpected real skill folder is moved aside, not removed.
#
# Usage:  bash system/scripts/link-vault-skills.sh
#         VAULT_PATH=/somewhere/else bash system/scripts/link-vault-skills.sh

set -euo pipefail

AIOS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_DIR="$AIOS_ROOT/system/skills/vault-session"
VAULT_PATH="${VAULT_PATH:-$AIOS_ROOT/second-brain}"
DEST_DIR="$VAULT_PATH/.claude/skills"

if [ ! -d "$SRC_DIR" ]; then
  echo "error: no vault-session skills at $SRC_DIR" >&2
  exit 1
fi

if [ ! -d "$VAULT_PATH" ]; then
  echo "error: no vault at $VAULT_PATH" >&2
  echo "       create it first (see SETUP.md), or set VAULT_PATH." >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

# Relative link when the vault sits inside the AI OS folder (the standard
# layout), absolute otherwise. A relative link survives renaming the AI OS
# folder or cloning it to a different home directory.
link_target_for() {
  local name="$1"
  case "$DEST_DIR" in
    "$AIOS_ROOT"/*)
      local rel="${DEST_DIR#"$AIOS_ROOT"/}"
      local up=""
      local IFS=/
      for _ in $rel; do up="../$up"; done
      printf '%ssystem/skills/vault-session/%s' "$up" "$name"
      ;;
    *)
      printf '%s/%s' "$SRC_DIR" "$name"
      ;;
  esac
}

linked=0
skipped=0
moved=0

for src in "$SRC_DIR"/*/; do
  name="$(basename "$src")"
  dest="$DEST_DIR/$name"
  target="$(link_target_for "$name")"

  if [ -L "$dest" ]; then
    if [ "$(readlink "$dest")" = "$target" ]; then
      skipped=$((skipped + 1))
      continue
    fi
    rm "$dest"                       # a symlink only, never real content
  elif [ -e "$dest" ]; then
    backup="$DEST_DIR/.replaced/$name"
    mkdir -p "$(dirname "$backup")"
    mv "$dest" "$backup"
    echo "  moved aside: $name -> .replaced/$name (real folder, not deleted)"
    moved=$((moved + 1))
  fi

  ln -s "$target" "$dest"
  linked=$((linked + 1))
done

echo "vault skills: $linked linked, $skipped already correct, $moved moved aside"
echo "  source: $SRC_DIR"
echo "  vault:  $DEST_DIR"
