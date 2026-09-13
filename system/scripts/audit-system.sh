#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SYSTEM="$ROOT/system"

required_paths=(
  "$ROOT/AGENTS.md"
  "$ROOT/connections.md"
  "$SYSTEM/README.md"
  "$SYSTEM/skills"
  "$SYSTEM/skills/_active"
  "$SYSTEM/skills/README.md"
  "$SYSTEM/agents"
  "$SYSTEM/commands"
  "$SYSTEM/templates"
  "$SYSTEM/mcp/registry.md"
  "$SYSTEM/mcp/claude.fragment.json"
  "$SYSTEM/mcp/codex.fragment.toml"
  "$SYSTEM/cli/Brewfile"
  "$SYSTEM/cli/npm-globals.txt"
  "$SYSTEM/cli/tooling.md"
  "$SYSTEM/preferences/user.example.md"
  "$SYSTEM/preferences/style.example.md"
  "$SYSTEM/env/.env.example"
  "$SYSTEM/scripts/sync-claude.sh"
  "$SYSTEM/scripts/sync-codex.sh"
  "$SYSTEM/scripts/check-secrets.sh"
)

for path in "${required_paths[@]}"; do
  if [[ ! -e "$path" ]]; then
    echo "Missing: $path"
    exit 1
  fi
done

if [[ ! -L "$ROOT/CLAUDE.md" ]]; then
  echo "Expected symlink: $ROOT/CLAUDE.md"
  exit 1
fi

# `user.md` et `style.md` sont gitignores depuis le 2026-08-27 (docs/adr/0004) :
# absents d'un clone neuf, et c'est voulu. Les exiger faisait echouer l'audit sur
# tout clone, y compris avant l'etape 4 de SETUP.md qui les cree. Leur absence
# signale un setup inacheve, pas une anomalie du repo.
for f in user style; do
  if [[ ! -e "$SYSTEM/preferences/$f.md" ]]; then
    echo "Note: $SYSTEM/preferences/$f.md absent — SETUP.md etape 4 pas encore faite."
  fi
done

# Meme raison : la carte des secrets est locale par conception (gitignoree,
# elle nomme des items de Keychain). L'exiger faisait echouer l'audit sur tout
# clone. Son absence signale un poste pas encore configure, pas un repo casse.
if [[ ! -e "$SYSTEM/env/secrets.registry.md" ]]; then
  echo "Note: $SYSTEM/env/secrets.registry.md absent — normal sur un poste neuf."
fi

python3 -m json.tool "$SYSTEM/mcp/claude.fragment.json" >/dev/null
bash -n "$SYSTEM/scripts/sync-claude.sh"
bash -n "$SYSTEM/scripts/sync-codex.sh"
bash -n "$SYSTEM/scripts/check-secrets.sh"

"$SYSTEM/scripts/check-secrets.sh"

# La doc doit coller a la realite, et ca se verifie, ca ne se promet pas.
# Le 2026-08-27, un audit manuel a trouve six affirmations fausses dans les
# fichiers que les agents lisent a chaque session : un dossier fusionne
# (`agency/prospection/`), un `projects/` racine inexistant, un skill fantome
# (`batch-grill-me`, cite 5 fois), et trois copies de faits perimees. Toutes
# etaient mecaniquement detectables. Voir docs/adr/0005.
python3 "$SYSTEM/scripts/check-doc-reality.py" "$ROOT"

echo "AI OS system audit passed."
