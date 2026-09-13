# Tooling Inventory

This file records global CLIs used by AI OS. It is documentation plus install intent, not proof of current machine state.

| CLI | Purpose | Install Source | Auth Location | Risk | Preferred For |
|---|---|---|---|---|---|
| `git` | version control | Homebrew / Xcode tools | n/a | medium | all repos |
| `gh` | GitHub operations | Homebrew | `gh auth` / Keychain | medium | GitHub reads/writes |
| `rg` | fast search | Homebrew | n/a | low | repository search |
| `jq` | JSON inspection | Homebrew | n/a | low | config inspection |
| `supabase` | Supabase operations | Homebrew tap | Supabase CLI auth | high | project DB workflows |
| `vercel` | Vercel operations | npm global | Vercel CLI auth | medium | deploy/project inspection |
| `claude` | Claude Code | npm global | local Claude auth | medium | Claude Code runtime |
| `gws` | Google Workspace (Gmail, Drive, Calendar, Sheets, Docs) | Homebrew `googleworkspace-cli` | OAuth, Keychain | high | all Google Workspace reads; sends require confirmation |
| `gcloud` | Google Cloud SDK | Homebrew cask `gcloud-cli` | own OAuth | low | only a dependency: `gws auth setup` needs it to create the GCP project and OAuth client |
| `obsidian` | Obsidian vault operations | bundled with Obsidian.app, enabled in Obsidian settings | n/a (local app) | low | second-brain vault operations |
| `goplaces` | Google Places API (New) — search/nearby/details/reviews — and Routes API for `directions` | Homebrew cask `openclaw/tap/goplaces` | API key in Keychain (`GOOGLE_PLACES_API_KEY`) | medium | place search, ratings, reviews (capped at 5 reviews/place by the API itself), travel time between two points |
| `gs` (Ghostscript) | PDF/PostScript processing — recompressing scanned PDFs before emailing them | Homebrew | n/a | low | shrinking oversized scanned PDFs (e.g. attachment size limits) |
| `slidev` | decks de slides depuis du Markdown (dev, export PDF/PPTX) | npm global `@slidev/cli` | n/a | low | présentations versionnées ; **chaque deck a besoin de son propre `npm install`** |
| `typst` | composition de PDF (rapports, one-pagers, CV) | Homebrew | n/a | low | tout PDF fini dont la typographie compte |
| `pandoc` | conversion universelle de formats (md, docx, pptx, html, pdf) | Homebrew | n/a | low | `.docx` éditable, et md → PDF rapide via `--pdf-engine=typst` |

## Install

Depuis la racine du dossier AI OS :

```bash
brew bundle --file system/cli/Brewfile
```

```bash
xargs -n 1 npm install -g < system/cli/npm-globals.txt
```

`obsidian` is not installable via Homebrew. Enable it from Obsidian: Settings, then install the CLI. It requires Obsidian to be running. The community `notesmd-cli` is a different tool and is not what the vault skills expect.

## Rules

- To shrink an oversized scanned PDF, `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=out.pdf in.pdf`. `/ebook` cuts embedded image resolution to screen-reading quality without touching text or layout — good enough for email attachment limits.

- Documents et decks : le routeur complet est le skill `produce-document` (`system/skills/productivity/produce-document/`). En résumé : Slidev pour les slides, Typst pour un PDF composé, Pandoc pour convertir ou produire un `.docx` éditable. Deux pièges vérifiés le 2026-08-31 : `pandoc … -o x.pdf` échoue seul parce que LaTeX n'est pas installé (et pèse 2 Go), il faut `--pdf-engine=typst` ; et `slidev` lancé globalement sur un `slides.md` isolé échoue avec `theme "@slidev/theme-default" was not found`, le thème et Chromium se résolvent depuis le dossier du deck. Scaffold prêt à l'emploi : `templates/slidev-deck/`. Le plugin `frontend-slides@frontend-slides` complète Slidev sur les decks one-shot : il n'a pas de CLI, il s'invoque comme un skill.

- Prefer `gh` CLI over GitHub MCP for write operations.
- Prefer `supabase` CLI over MCP for guarded operational tasks.
- Prefer `gws` CLI over Gmail/Calendar connectors for reads. Never auto-send: `gws gmail send` and `gws drive permissions update` always require explicit confirmation.
- `gws` authentication is the fragile part of a fresh install (OAuth consent screen, test users, scope explosion). The full walkthrough with its traps lives in `SETUP.md`; re-authenticate with `gws auth login --services gmail,drive,calendar,sheets,docs`, never bare. Its output starts with a `Using keyring backend:` line — strip it (`tail -n +2`) before parsing JSON.
- Do not run production writes without explicit confirmation.
- `goplaces` needs `GOOGLE_PLACES_API_KEY` exported before use — it lives only in Keychain, never in a file: `export GOOGLE_PLACES_API_KEY=$(security find-generic-password -a "$USER" -s "GOOGLE_PLACES_API_KEY" -w)`. Key is restricted to `places.googleapis.com` and `routes.googleapis.com` on your own GCP project (see `system/env/secrets.registry.md`, local); both services are enabled there. The API caps `details --fields reviews` at 5 reviews per place with no pagination/sort — a Google-side limit, not a `goplaces` one. `directions` hits the Routes API, billed separately from Places; `--mode=bicycle` returns nothing in Indonesia, use `--mode=drive` (a scooter is at least as fast). Adding a service to the key is two steps, and a `gcloud services enable` takes a few minutes to propagate before the 403 stops:

```bash
gcloud services enable <service> --project=<ton-projet-gcp>
gcloud services api-keys update <key-resource-name> --api-target=service=places.googleapis.com --api-target=service=<service>
```

`--api-target` replaces the whole list, so every service the key should keep must be passed again.
