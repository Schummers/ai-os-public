# Setup

This file is written to be **executed by an agent** (Claude Code or Codex), running inside this repo on a fresh machine. Each step has a verification command — run it, confirm the expected output, then move on. Ask the human before anything in `## Requires confirmation`.

## Before you begin (human, not agent)

This is macOS-only: Homebrew, the Keychain and `security` commands are assumed throughout. Nothing below works on Windows or Linux without rewriting.

What the human needs before an agent can do anything:

| | Cost | Note |
|---|---|---|
| A Mac | — | see above |
| GitHub account | free | private repos included |
| A paid Claude (or Codex) plan | **monthly** | the only recurring cost; Claude Code does not run on the free tier |
| Obsidian | free | personal use, manual download, not in Homebrew |
| Google account | free | for `gws` (Gmail, Drive, Calendar) |
| Notion account | free | optional, can be deferred |

**Getting your own copy of this repo.** It is a *template repository*, so the flow is not a fork:

1. Open `Schummers/ai-os-public` on GitHub.
2. Click **Use this template** → *Create a new repository*, pick your own name, keep it **private** (yours will hold your identity and your domains' pilot files).
3. You now own a fully independent repo: no fork link, no shared history, no pull requests pointing back at the original.
4. `git clone` your new repo, open it with Claude Code or Codex, and tell the agent to execute this file.

Do not fork. A fork keeps an upstream link to someone else's personal system, which is not what you want here — you want your own.

> [!NOTE]
> **Two repos, one source.** The public repo (`Schummers/ai-os-public`) is a
> snapshot of the private working repo, published without history and refreshed
> by overwriting that single commit. Do not open pull requests against it; do not
> expect `git log` to tell a story. The private repo's history is not clean
> (commits before 2026-08-27 carry personal data), which is why it is never
> published as-is. See `docs/adr/0003`.

This repo carries **no personal content**: no identity, no domain folders, no client material. `system/preferences/user.md` and `style.md` are untracked — you get `user.example.md` and `style.example.md` and fill them in yourself at step 4. Two people can therefore share this repo without ever conflicting on those files, and without receiving each other's identity. See `docs/adr/0004`.

## 0. Prerequisites

```bash
brew --version || xcode-select --install   # Homebrew
git --version
gh --version || brew install gh
gh auth status || gh auth login   # interactive: GitHub.com, HTTPS, browser
```

Verify: all three print a version, and `gh auth status` shows a logged-in account.

GitHub is used **through the `gh` CLI only** — this repo deliberately installs no GitHub MCP. The CLI already stores its token in the Keychain, each operation is auditable on its own, and an MCP server would load dozens of tools into every session's context for no gain. Skipping `gh auth login` here does not fail until step 5, where `gh repo create` needs it.

## 1. Claude Code and/or Codex

Install whichever runtime(s) the human wants (Claude Code, Codex, or both — the skills in this repo are written tool-neutral and work with either).

```bash
which claude   # Claude Code
which codex    # Codex, if used
```

## 1b. Install the plugins

This repo ships the skills **it owns**, under `system/skills/`. A large part of the day-to-day tooling is *not* here: it comes from plugin marketplaces, consumed rather than copied so they stay updated at their source. `system/skills/README.md` calls this Regime 1 and lists them; without this step, the setup ends with half the toolkit missing and no error to explain why.

The one that matters most:

```bash
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

It provides `grill-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `code-review`, `domain-modeling`, `tdd` — the thinking and engineering workflows that the rest of this system assumes exist. `AGENTS.md` ("Stress-Testing Decisions") references them by name.

**Everything below is optional and developer-oriented. If the human does not write code, install none of it** — every installed plugin costs context in every session, whether it is used or not. They can be added later in one command the day a need shows up.

From the official marketplace (configured by default):

```bash
claude plugin install skill-creator@claude-plugins-official # writing and evaluating skills
claude plugin install context7@claude-plugins-official      # up-to-date library docs, only useful when coding
```

Stack-specific, only if the human actually works with them: `playwright`, `supabase`, `vercel` (same marketplace).

Verify: `claude plugin marketplace list` shows `mattpocock`, and typing `/grill-me` in a session resolves.

## 2. Install CLIs and MCPs from the existing registries

Do not improvise tool choices — this repo already documents what to install and why:

```bash
cat system/cli/tooling.md    # CLIs: git, gh, rg, jq, gws, obsidian, etc. — install source + auth location per tool
cat system/mcp/registry.md   # MCPs: which are global, which are project-scoped, and why
```

Follow `system/cli/tooling.md`'s own install block:

```bash
brew bundle --file "system/cli/Brewfile"
xargs -n 1 npm install -g < "system/cli/npm-globals.txt"
```

`obsidian` (the app + its CLI) is not Homebrew-installable — install Obsidian.app manually, then enable its CLI from Settings (requires Obsidian running).

`gws` (Google Workspace CLI — Gmail, Drive, Calendar, Sheets, Docs) is by far the most fragile step: it needs a Google Cloud project, an OAuth consent screen and an OAuth client before it can authenticate. Do it with the human present — three of the steps below cannot be scripted.

```bash
gws auth setup   # steps 1-4 automatically; requires the gcloud cask from the Brewfile
```

`gws auth setup` walks 5 steps and stops at step 5, which is manual. Two traps cost real time here, both walked through on 2026-07-25:

**Trap 1 — the client secret is shown exactly once.** At step 5, create the OAuth client in the console (Application type: **Desktop app**). The secret is visible only in the creation dialog: copy it or download the JSON *before* closing it. Reloading the client page later shows `****abcd` forever, and the only recovery is **Add secret** to generate a new one (then delete the unused one — several active secrets is a flagged risk). Write the credentials to the file `gws` expects, without pasting the secret into a shell history:

```bash
mkdir -p ~/.config/gws && printf '{"installed":{"client_id":"<CLIENT_ID>","project_id":"<GCP_PROJECT>","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"%s","redirect_uris":["http://localhost"]}}' "$(pbpaste)" > ~/.config/gws/client_secret.json && chmod 600 ~/.config/gws/client_secret.json
```

**Trap 2 — add yourself as a test user.** The app stays in *Testing* mode, where only declared test users may authenticate. Console → Google Auth Platform → **Audience** → *Test users* → add the human's own address. Skipping this gives a `403 access_denied` that says nothing useful.

Then authenticate. **Never run `gws auth login` bare** — name the scopes explicitly:

```bash
gws auth login --scopes https://www.googleapis.com/auth/gmail.modify,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/gmail.compose,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/documents
```

Two reasons, one practical and one about safety.

Practical: without any scope argument, `gws` derives them from every API enabled on the GCP project (44 by default, including BigQuery, Pub/Sub and Vault) and requests ~87 scopes — an unverified app is rejected with `invalid_scope`.

Safety: the scope list above is deliberately narrower than `--services gmail,drive,calendar,sheets,docs`, which would also grant `gmail.settings.sharing` (**auto-forwarding**, delegation, send-as) and `cloud-platform` (the whole Google Cloud account). Auto-forwarding is the classic exfiltration path — a token that cannot set it up is a token that cannot leak the mailbox, whatever an agent is convinced to do. Note also that permanently deleting mail requires `https://mail.google.com/`, which is absent here on purpose: the worst case is the trash, recoverable for 30 days. Labels work through `gmail.modify` and need no `settings` scope at all.

Adjust the list to the human's actual use — drop `gmail.send` if they would rather write drafts than send, drop `drive` down to `drive.readonly` if nothing should ever delete a file. Removing a scope later means revoking the app at [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and running the command again: an already-granted scope stays granted until then.

Verify with `gws auth status` — `auth_method` must read `oauth2`, not `none`. Then prove it actually works, for example `gws calendar events list --params '{"calendarId":"primary","maxResults":3}'`. Note that `gws` prefixes its output with a `Using keyring backend:` line, so piping to a JSON parser needs `tail -n +2`.

This whole step can be **deferred**: everything else in this repo works without it, only the `morning-ritual` skill degrades (it prints "Gmail: non connecté" and skips those sections).

**MCP priority for this repo**: `gmail`/`google-calendar` if the human wants the `morning-ritual` skill working with live email/calendar. Everything else is **optional and deferrable**: `notion` (read-heavy context for the vault workflow, useful only if the human actually uses Notion) and `fireflies` (call transcripts, useful only if the human records meetings). No skill in this repo hard-depends on either.

Connect these via `claude mcp` / `/mcp` in an interactive session — this cannot be scripted headlessly. Hosted connectors are attached to the **Claude account**, not to this repo: they are not projected from `system/`, they follow the human across CLI, desktop and web, and a headless or cron run may not see them. `system/mcp/registry.md` documents which ones exist and why, it does not configure them.

Verify: `gws --help` prints usage; Obsidian CLI responds (`obsidian --version` or equivalent from its own docs); MCP connections show in `/mcp`.

## 3. Secrets — Keychain only, never a file

This repo never stores secret values, only a **map of where they live**:

```bash
cat system/env/secrets.registry.md   # paths, not values
```

For each secret the human wants configured (Notion API token, etc.), store it in Keychain, never in a file:

```bash
security add-generic-password -a <account> -s <service> -w
```

Then add its path (account/service names only) to `system/env/secrets.registry.md`.

Verify: `env | grep -iE "(token|key|password|secret)"` returns empty.

## 3b. Guardrails — the only barrier an agent cannot talk its way past

Permissions live in `~/.claude/settings.json`, which is **local to each machine** and deliberately not projected from `system/` (it also holds machine-specific settings). So this step does not happen on its own, and skipping it leaves an agent free to send mail or delete Drive files with no confirmation.

This matters more than it looks. A rule written in a `SKILL.md` — "this skill is read-only", "never send" — is an *intention*: it lives in the prompt, and a prompt can be argued with. An `ask` rule is enforced by the harness **before** the agent runs, so it holds no matter what any skill, any injected content, or any convincing instruction says. It is the difference between a sign and a lock.

Merge the recommended rules into the local settings:

```bash
python3 -c "
import json, pathlib
home = pathlib.Path.home() / '.claude' / 'settings.json'
rec = json.load(open('system/claude/permissions.recommended.json'))['permissions']
cur = json.loads(home.read_text()) if home.exists() else {}
perms = cur.setdefault('permissions', {})
for bucket in ('ask', 'deny'):
    existing = perms.setdefault(bucket, [])
    for rule in rec.get(bucket, []):
        if rule not in existing:
            existing.append(rule)
home.parent.mkdir(exist_ok=True)
home.write_text(json.dumps(cur, indent=2, ensure_ascii=False))
print('merged')
"
```

What it protects, and why each one: sending mail and sending drafts (irreversible, and in the human's name), deleting Drive files and calendar events (irreversible), sharing a Drive file (the one action that can expose a private document to the outside), and the destructive git operations that discard work. `rm -rf` is `deny` rather than `ask` — there is no good reason for an agent to reach for it.

Read `system/claude/permissions.recommended.json` before merging and adjust to what the human wants. `ask` means *blocked by default, allowed when you confirm* — it is not a refusal, so err on the side of including a rule: the cost of a wrong `ask` is one keystroke.

Verify: `python3 -c "import json;print(json.load(open('$HOME/.claude/settings.json'))['permissions']['ask'])"` lists the rules.

## 4. Personal preferences

Copy the examples and fill them in with the human's own identity, communication style, and conventions:

```bash
cp system/preferences/user.example.md system/preferences/user.md
cp system/preferences/style.example.md system/preferences/style.md
```

Edit `system/preferences/user.md` together with the human — this is the file that becomes their global instructions. `style.md` is optional and only matters if they want agents to draft outreach in their voice; it is filled with real messages they have sent, which is exactly why both files are gitignored.

Verify: both files exist, neither still contains placeholder text like `<Ton Nom>`, and `git status --porcelain system/preferences/` prints **nothing** (they must stay untracked).

## 5. Initialize the second brain

The vault is a **separate, nested git repo** (not part of this one — see `AGENTS.md`, "Backup Plans"). Two paths:

**A. Fresh vault** (recommended for a new user):

```bash
gh repo create <github-user>/second-brain --private
cp -R templates/second-brain second-brain
cd second-brain && git init && git add -A && git commit -m "chore: initial vault from ai-os template"
git remote add origin https://github.com/<github-user>/second-brain.git
git push -u origin main
cd ..
```

**B. Existing vault**: `git clone <remote-url> second-brain`.

Then, **either way**, project the vault-session skills into it:

```bash
bash system/scripts/link-vault-skills.sh
```

Their source of truth is `system/skills/vault-session/`, in this repo, and the
vault gets symlinks. That is why `templates/second-brain/.claude/skills/` ships
empty: a second copy is exactly what let five of those skills drift apart
before. The script is idempotent, so re-run it after pulling new skills, and it
moves any real folder aside instead of deleting it.

Verify: `ls second-brain` shows `knowledge/`, `calendar/`, `projects/`, `content/`, `inbox/`, `_agent/`, `AGENTS.md`, `index.md`. `ls -l second-brain/.claude/skills` shows 13 symlinks. `git -C second-brain status` is clean.

Then read `second-brain/AGENTS.md`, section **"Les deux rythmes"**. It is the shortest description of how the whole thing runs, and it is worth reading before creating anything.

### The content module

`content/` models publishable production units: a reel, a post, a carousel. It is a sibling of `projects/`, not a kind of project — it has its own fabrication pipeline, filming and publishing dates, and a local rushes folder. It comes with three global skills (`create-content-idea`, `validate-content-idea`, `unblock-content`) and its canonical schema in `_agent/templates/content.md`.

If you do not publish anything, leave the four folders empty and ignore the skills: they never fire on their own, and the rituals skip the section when `content/production/` is empty. Nothing else in the vault depends on it.

## 6. Project domains (optional, as needed)

Not part of initial setup — domains (`admin/`, `agency/`, etc.) are created on demand. See `AGENTS.md`, "Creating a New Domain", when the human wants one.

## 7. Project skills to global, and vice versa

```bash
system/scripts/sync-claude.sh dry-run
system/scripts/sync-codex.sh dry-run
```

Review the planned symlinks, then apply:

```bash
system/scripts/sync-claude.sh --apply
system/scripts/sync-codex.sh --apply
```

Verify: `ls ~/.claude/skills` and `ls ~/.claude/commands` (and their `~/.codex` equivalents, if Codex is used) show the global skills from `system/skills/_active/` and `system/commands/` — including the vault ones (`capture`, `search-brain`, `create-note`, `create-source`, `create-task`, `update-brain`) and the content ones (`create-content-idea`, `validate-content-idea`, `unblock-content`).

## Requires confirmation

- Any `gws` OAuth grant (do it with the human watching).
- Any MCP connection to a hosted service with account access (Notion, Gmail, Calendar).
- Deciding what goes in `system/preferences/user.md` — that's the human's call, not a default to invent.

## Done

Setup is complete when: CLIs from `system/cli/tooling.md` respond, the `mattpocock` marketplace is installed, secrets are in Keychain only, `system/preferences/user.md` reflects the human (not the template), `second-brain/` exists with the expected structure and a backup plan chosen, and `~/.claude/skills` (or `~/.codex/skills`) lists the global skills.
