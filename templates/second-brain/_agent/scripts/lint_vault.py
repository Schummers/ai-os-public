#!/usr/bin/env python3
"""Lint the second-brain vault: dead wikilinks, missing frontmatter, orphan notes, MOC count.

Usage: python3 lint_vault.py [--verbose]
Prints a summary; with --verbose also lists each offending file/link.
"""
import os
import re
import sys
import time
from collections import defaultdict

VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SKIP_DIRS = {".claude", ".obsidian", ".git", "attachments"}
# Areas where frontmatter is expected for durable notes
FRONTMATTER_AREAS = ("knowledge/notes", "knowledge/sources", "knowledge/goals", "projects", "content")
WIKILINK = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")

CONTENT_STATUSES = {"idea", "production", "published", "archive"}
CONTENT_STAGES = {
    "packaging", "scripting", "ready-to-film", "filmed",
    "editing", "complete", "scheduled",
}
# An idea untouched for this long is a candidate for content/archive/.
# Replaces the Notion `Auto Archive?` formula.
STALE_IDEA_DAYS = 15


def frontmatter(text):
    """Return the flat top-level frontmatter as a dict of strings. Empty if none."""
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    out = {}
    for line in text[3:end].splitlines():
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
        if m:
            out[m.group(1)] = m.group(2).strip().strip("'\"")
    return out


def lint_content(rel, text, path):
    """Rules specific to content/. Returns a list of problem strings."""
    fm = frontmatter(text)
    if not fm:
        return [f"{rel}: no frontmatter"]

    problems = []
    parts = rel.split(os.sep)
    folder = parts[1] if len(parts) > 2 else ""
    status = fm.get("status", "")
    stage = fm.get("stage", "")

    if status != folder:
        problems.append(f"{rel}: status '{status}' does not match folder '{folder}'")
    if status not in CONTENT_STATUSES:
        problems.append(f"{rel}: status '{status}' is not one of {sorted(CONTENT_STATUSES)}")

    has_stage = stage not in ("", "null", "~")
    if status == "production" and not has_stage:
        problems.append(f"{rel}: status 'production' requires a stage")
    if status != "production" and has_stage:
        problems.append(f"{rel}: stage '{stage}' requires status 'production', got '{status}'")
    if has_stage and stage not in CONTENT_STAGES:
        problems.append(f"{rel}: stage '{stage}' is not one of {sorted(CONTENT_STAGES)}")

    goal = fm.get("goal", "")
    if goal in ("", "null", "~"):
        problems.append(f"{rel}: goal is empty")

    if status == "idea":
        age_days = (time.time() - os.path.getmtime(path)) / 86400
        if age_days > STALE_IDEA_DAYS:
            problems.append(f"{rel}: idea untouched for {int(age_days)} days, archive or work it")

    return problems

def md_files():
    for root, dirs, files in os.walk(VAULT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f.endswith(".md"):
                yield os.path.join(root, f)

def main():
    verbose = "--verbose" in sys.argv
    files = list(md_files())
    names = defaultdict(list)  # basename (no .md, lowercased) -> paths
    for p in files:
        names[os.path.splitext(os.path.basename(p))[0].lower()].append(p)

    dead = []          # (file, target)
    incoming = defaultdict(int)
    no_frontmatter = []
    content_problems = []
    total_links = 0

    for p in files:
        rel = os.path.relpath(p, VAULT)
        try:
            text = open(p, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        if any(rel.startswith(a) for a in FRONTMATTER_AREAS) and not text.startswith("---"):
            no_frontmatter.append(rel)
        if rel.startswith("content" + os.sep):
            content_problems.extend(lint_content(rel, text, p))
        for m in WIKILINK.finditer(text):
            total_links += 1
            target = m.group(1).strip()
            key = os.path.basename(target).lower()
            if key in names:
                for t in names[key]:
                    incoming[t] += 1
            else:
                dead.append((rel, target))

    orphans = [
        os.path.relpath(p, VAULT)
        for p in files
        if os.path.relpath(p, VAULT).startswith(("knowledge/notes", "knowledge/goals"))
        and incoming[p] == 0
    ]
    mocs = [os.path.relpath(p, VAULT) for p in files if os.path.relpath(p, VAULT).startswith("knowledge/mocs")]
    inbox = [p for p in files if os.path.relpath(p, VAULT).startswith("inbox")]

    print(f"Vault root: {VAULT}")
    print(f"Markdown files: {len(files)}")
    print(f"Wikilinks: {total_links}")
    print(f"Dead wikilinks: {len(dead)}")
    print(f"Missing frontmatter (notes/sources/goals/projects/content): {len(no_frontmatter)}")
    print(f"Content problems: {len(content_problems)}")
    print(f"Orphan notes (knowledge/notes+goals, no incoming links): {len(orphans)}")
    print(f"MOC files: {len(mocs)}")
    print(f"Inbox captures: {len(inbox)}")

    if verbose:
        print("\n## Dead wikilinks")
        for f, t in sorted(dead):
            print(f"- {f} -> [[{t}]]")
        print("\n## Missing frontmatter")
        for f in sorted(no_frontmatter):
            print(f"- {f}")
        print("\n## Content problems")
        for f in sorted(content_problems):
            print(f"- {f}")
        print("\n## Orphans")
        for f in sorted(orphans):
            print(f"- {f}")

if __name__ == "__main__":
    main()
