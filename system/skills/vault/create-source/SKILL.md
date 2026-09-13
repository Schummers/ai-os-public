---
name: create-source
description: Create a source note for external material, research, transcripts, documents, links, or imported references.
---

# Create Source

## Vault Resolution

The vault is `$VAULT_PATH` if set, otherwise `~/AI OS/second-brain`. All paths below are relative to that root.

## Purpose

Create a source record in `knowledge/sources/` so external material can be cited and reused without becoming personal notes too early.

## Workflow

1. Read the vault's `AGENTS.md`.
2. Read `_agent/hot.md` if present.
3. **Check for duplicates first**: search the vault (`rg` on title keywords, URL, author) across `knowledge/sources/`, `knowledge/notes/`, and `calendar/`. If the content already exists, link to the existing file instead of creating a duplicate — the existing location stays the single source of truth.
4. **Ingest the material according to input type:**
   - Web page URL → use the Defuddle CLI: `defuddle parse <url> --md` (install with `npm install -g defuddle` if missing).
   - YouTube URL → run `python3 _agent/scripts/youtube_transcript.py "<url>" -o knowledge/sources/<slug>.md` (requires `yt-dlp` on PATH; install with `brew install yt-dlp` if missing). The script fetches metadata + subtitles, cleans and deduplicates the VTT, and writes a source file already conforming to the canonical schema (`source_type: video`). Then fill in `## Summary` and `## Links To Notes`. If the cleaned transcript exceeds ~50K characters, summarize per chunk. If the video has no subtitles, the script says so and writes a metadata-only file.
     - **Several videos at once** (a playlist, a channel, a whole race): list the video ids first with `yt-dlp --extractor-args "youtube:player_client=android" --flat-playlist -J "<channel_or_playlist_url>"`, then loop over them calling the same script once per video with `sleep 3` between iterations. The pause matters — without it YouTube rate-limits and later videos fail. Run long loops in the background and check the output file rather than blocking.
     - **If YouTube answers `HTTP 429` or "Sign in to confirm you're not a bot"**: this is an IP-level block, not an authentication problem, and it hits even a single video. The `youtube:player_client=android` extractor arg baked into the script is what bypasses it — do not fall back to `--cookies-from-browser chrome`, which hangs on the macOS keychain prompt.
   - Local PDF/document → read it directly. If direct reading fails or the format is not readable (docx, pptx, xlsx, scanned image needing OCR, audio): convert with `uvx markitdown <file> -o <out>.md` (requires `uv`; install with `brew install uv` if missing). Move the original to `attachments/` if it should live in the vault, and record the path.
   - Pasted text → use as-is in Raw Material.
5. Create the source in `knowledge/sources/` using a clear lowercase slug.
6. Follow the canonical schema in `_agent/templates/source.md` (single source of truth for frontmatter and rules).
7. Preserve source attribution, URLs, author, date, and local attachment paths when available.
8. Link to notes or MOCs with wikilinks only when the relation is clear.
9. Update `_agent/hot.md` when the source changes durable context.
10. Show changed files and important diffs.

## Hard Rules

- Do not use the previous assistant's runtime, Notion, Telegram, heartbeat, ChromaDB, or SQLite.
- Do not delete files without explicit confirmation.
- Use Obsidian wikilinks for internal links.
- Do not present uncited external claims as the user's own notes.
