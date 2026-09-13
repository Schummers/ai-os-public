#!/usr/bin/env bash
# Publie un snapshot de ce repo prive vers Schummers/ai-os-public :
# un seul commit, sans historique. Le prive reste la seule source ; le public
# est ecrase a chaque appel. Manuel et volontaire : rien ne le declenche seul.
# Voir docs/adr/0003 et la section "Public snapshot" de AGENTS.md.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PUBLIC_REMOTE="${PUBLIC_REMOTE:-https://github.com/Schummers/ai-os-public.git}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
[[ -z "$(git status --porcelain)" ]] || { echo "arbre non commite, abandon" >&2; exit 1; }
git archive HEAD | tar -x -C "$WORK"

cd "$WORK"
if grep -rlF "$HOME" . --include='*.md' --include='*.py' --include='*.sh' --include='*.json' >/dev/null; then
  echo "chemin absolu personnel dans le snapshot, abandon" >&2; exit 1
fi
git init -q -b main && git add -A
if git ls-files | grep -qE "preferences/(user|style)\.md"; then
  echo "user.md ou style.md dans le snapshot, abandon" >&2; exit 1
fi
bash system/scripts/check-secrets.sh >/dev/null || { echo "check-secrets a echoue, abandon" >&2; exit 1; }
# Noms propres : ni check-secrets ni le garde $HOME ne les voient. Ajoute le
# 2026-09-13, apres avoir trouve 192 occurrences de prenoms et de noms de
# projets dans un snapshot publie depuis des mois.
python3 "$ROOT/system/scripts/check-public-names.py" . || { echo "check-public-names a echoue, abandon" >&2; exit 1; }

# La liste de noms interdits ne se publie pas : elle est l'index exact de ce
# qu'elle protege. Le checker la lit depuis le depot prive ($ROOT), pas depuis
# le snapshot, donc la remplacer ici n'enleve rien a la verification qui vient
# de tourner. Trouve le 2026-09-13, par un controle independant : le checker ne
# se voyait pas lui-meme, il ignore ce fichier par nom.
cat > system/scripts/public-denylist.txt <<'STUB'
# La liste reelle n'est pas publiee : elle nommerait un par un les prenoms et
# les projets qu'elle sert a tenir hors de ce depot. Elle vit dans le depot
# prive, a ce meme chemin, et c'est elle que check-public-names.py lit.
#
# Pour reutiliser ce mecanisme : ecrire ici un nom par ligne, insensible a la
# casse et aux accents, compare sur des mots entiers.
STUB

git add -A
git -c user.name="$(cd "$ROOT" && git config user.name)" \
    -c user.email="$(cd "$ROOT" && git config user.email)" \
    commit -q -m "chore: public snapshot $(date +%F) from $(cd "$ROOT" && git rev-parse --short HEAD)"
git remote add origin "$PUBLIC_REMOTE"
git push --force origin main
echo "publie : $(git rev-parse --short HEAD), $(git ls-files | wc -l | tr -d ' ') fichiers"
