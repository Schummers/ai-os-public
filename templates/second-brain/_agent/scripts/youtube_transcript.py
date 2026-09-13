#!/usr/bin/env python3
"""Extract a YouTube transcript + metadata as a vault-ready source markdown.

Adapted from the "youtube-transcript" skill pattern (yt-dlp + VTT cleanup + dedup),
aligned on the canonical schema in `_agent/templates/source.md`.

Usage:
    python3 youtube_transcript.py <youtube_url>            # markdown to stdout
    python3 youtube_transcript.py <youtube_url> -o out.md  # markdown to file

Requires yt-dlp on PATH (brew install yt-dlp). No Python dependencies.
"""

from __future__ import annotations

import argparse
import datetime
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

SUB_LANGS = "fr,en"

# YouTube blocks the default web client with HTTP 429 / "Sign in to confirm you're
# not a bot" on most non-residential IPs. Spoofing the Android client bypasses it
# without needing cookies or a proxy.
EXTRACTOR_ARGS = "youtube:player_client=android"


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def fetch_metadata(url: str) -> dict:
    proc = run(["yt-dlp", "--extractor-args", EXTRACTOR_ARGS,
                "--skip-download", "--dump-json", url])
    if proc.returncode != 0:
        sys.exit(f"yt-dlp metadata failed: {proc.stderr.strip()[:500]}")
    return json.loads(proc.stdout)


def fetch_vtt(url: str, tmpdir: str) -> Path | None:
    out = str(Path(tmpdir) / "sub")
    proc = run([
        "yt-dlp", "--extractor-args", EXTRACTOR_ARGS, "--skip-download",
        # Without this, a 429 on one language (typically the translated track)
        # aborts the run before the other languages are written.
        "--ignore-errors",
        "--write-subs", "--write-auto-subs",
        "--sub-format", "vtt", "--sub-langs", SUB_LANGS,
        "-o", out, url,
    ])
    vtts = sorted(Path(tmpdir).glob("*.vtt"))
    if proc.returncode != 0 and not vtts:
        sys.exit(f"yt-dlp subtitles failed: {proc.stderr.strip()[:500]}")
    if not vtts:
        return None
    # A nonzero exit with files present means only some languages failed
    # (typically a 429 on a translated track) — keep what we got.
    # Prefer language order of SUB_LANGS
    for lang in SUB_LANGS.split(","):
        for v in vtts:
            if f".{lang}." in v.name or v.name.endswith(f".{lang}.vtt"):
                return v
    return vtts[0]


TAG_RE = re.compile(r"<[^>]+>")
TIMESTAMP_LINE_RE = re.compile(r"^\s*\d{2}:\d{2}:\d{2}[.,]\d{3}\s+-->")


def clean_vtt(path: Path) -> str:
    """Strip headers, timestamps, inline tags; deduplicate rolling caption lines."""
    lines: list[str] = []
    last = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if (not line or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE"))
                or TIMESTAMP_LINE_RE.match(line) or line.isdigit()):
            continue
        line = TAG_RE.sub("", line).strip()
        if not line or line == last:
            continue  # auto-captions roll: consecutive duplicates are noise
        lines.append(line)
        last = line
    return "\n".join(lines)


def to_markdown(meta: dict, transcript: str | None) -> str:
    title = meta.get("title", "Untitled")
    upload = meta.get("upload_date", "")
    upload_fmt = f"{upload[:4]}-{upload[4:6]}-{upload[6:]}" if len(upload) == 8 else ""
    today = datetime.date.today().isoformat()
    body = transcript if transcript else "_No subtitles available for this video._"
    return f"""---
type: source
name: {title}
created: {today}
source_type: video
status: raw
url: {meta.get('webpage_url', '')}
author: {meta.get('channel') or meta.get('uploader', '')}
---

# {title}

## Source

- Chaîne : {meta.get('channel') or meta.get('uploader', '')}
- Publié : {upload_fmt}
- Durée : {meta.get('duration_string', '')}
- URL : {meta.get('webpage_url', '')}

## Raw Material

{body}

## Summary

## Links To Notes
"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("-o", "--output", help="write markdown to this file")
    args = parser.parse_args()

    meta = fetch_metadata(args.url)
    with tempfile.TemporaryDirectory() as tmpdir:
        vtt = fetch_vtt(args.url, tmpdir)
        transcript = clean_vtt(vtt) if vtt else None

    md = to_markdown(meta, transcript)
    if args.output:
        Path(args.output).write_text(md, encoding="utf-8")
        print(f"written: {args.output} ({len(md)} chars"
              f"{', no subtitles' if transcript is None else ''})")
    else:
        print(md)


if __name__ == "__main__":
    main()
