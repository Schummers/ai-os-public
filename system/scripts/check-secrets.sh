#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

patterns='(sk-(proj-)?[A-Za-z0-9]{32,}|gh[pousr]_[A-Za-z0-9_]{20,}|sbp_[A-Za-z0-9]{20,}|secret_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|postgres(ql)?://[^[:space:]]+:[^[:space:]@]+@)'

echo "Scanning tracked/source files for high-confidence secret values..."
hit_file="$(mktemp)"
trap 'rm -f "$hit_file" /tmp/ai-os-secret-scan-hit' EXIT

if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  files_cmd=(git -C "$ROOT" ls-files)
else
  files_cmd=(find "$ROOT" -type f -not -path "*/.git/*" -not -path "*/system/env/local/*")
fi

while IFS= read -r file; do
  if [[ "$file" == /* ]]; then
    abs="$file"
  else
    abs="$ROOT/$file"
  fi
  case "$abs" in
    */system/env/.env.example|*/system/env/secrets.registry.md|*/system/scripts/check-secrets.sh) continue ;;
    */node_modules/*|*/.git/*|*/system/env/local/*) continue ;;
  esac
  # Symlinks point at files scanned under their real path; directories are not scannable.
  if [[ -L "$abs" || -d "$abs" ]]; then
    continue
  fi
  if LC_ALL=C grep -IEn "$patterns" "$abs" | grep -Ev 'secret_x+|secret_\[PLACEHOLDER\]' >/tmp/ai-os-secret-scan-hit 2>/dev/null; then
    echo "Suspicious secret-like value in $abs"
    cat /tmp/ai-os-secret-scan-hit
    printf '1\n' > "$hit_file"
  fi
done < <("${files_cmd[@]}")

if [[ -s "$hit_file" ]]; then
  echo "Secret scan found suspicious values. Review before committing."
  exit 1
fi

echo "No high-confidence secret values found in tracked/source files."
