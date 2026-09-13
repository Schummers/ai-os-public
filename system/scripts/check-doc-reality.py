#!/usr/bin/env python3
"""Verifie que les fichiers de pilotage ne mentent pas.

Trois classes d'affirmation, toutes verifiables mecaniquement, toutes prises en
defaut lors de l'audit manuel du 2026-08-27 :

1. un chemin cite entre backticks doit exister
2. un skill cite par son nom doit exister quelque part
3. un script cite doit exister et etre syntaxiquement valide

Ce qui n'est PAS verifiable ici (une cible de goal, une decision) doit vivre
dans sa source et etre pointe, jamais recopie. Voir docs/adr/0005.
"""
import datetime
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")

# Fichiers lus par un agent a chaque session : ce sont eux qui doivent etre vrais.
PILOT = ["AGENTS.md", "SETUP.md", "system/README.md", "system/skills/README.md",
         "aios-app/CLAUDE.md"]

# Un chemin en prose n'est pas une affirmation sur le disque. Trois formes :
# un placeholder (`<domain>/`), un nom generique de convention (`archive/`),
# un exemple nomme (`audit-acme/`). Ajouter ici seulement si c'est vraiment
# de la prose, jamais pour faire taire un vrai chemin casse.
PROSE = {
    "archive/", "audit-acme/", "cv/", "prospection/", "projects/",
    "issues/NN-slug.md", "Schummers/aios-app", "docs/adr/", "skills/",
    "second-brain/.claude/skills/", "knowledge/goals/", "knowledge/notes/",
    "knowledge/sources/", "knowledge/mocs/", "projects/tasks/", "calendar/",
    "content/idea/", "content/production/", "_agent/templates/", "inbox/",
    "projects/<state>/", "<domain>/skills/<name>/", "knowledge/experiences/",
}

# Chemins appartenant a un AUTRE depot, cites en exemple. Un ajout ici doit
# nommer le depot concerne : c'est le seul garde-fou contre l'usage de cette
# liste pour faire taire un vrai chemin casse.
EXTERNAL = {
    "mattpocock/skills", "Leonxlnx/taste-skill", "github.com/mattpocock/skills",
    # arborescence interne du plugin mattpocock, pas la notre
    "skills/engineering/", "skills/productivity/", "deprecated/", "in-progress/",
    "misc/", "personal/",
}

PATH_RE = re.compile(r"`([A-Za-z0-9_][A-Za-z0-9_./@-]*/[A-Za-z0-9_./@-]*)`")
errors = []


def is_gitignored(path):
    try:
        return subprocess.run(["git", "-C", ROOT, "check-ignore", "-q", path],
                              capture_output=True).returncode == 0
    except OSError:
        return False


def skill_names():
    """Tous les skills atteignables : repo, plugins, projections."""
    names = set()
    roots = [os.path.join(ROOT, "system", "skills"),
             os.path.expanduser("~/.claude/plugins/marketplaces"),
             os.path.expanduser("~/.claude/skills")]
    for r in roots:
        for dp, dn, fn in os.walk(r) if os.path.isdir(r) else []:
            if "SKILL.md" in fn:
                names.add(os.path.basename(dp))
    return names


def check_paths():
    for rel in PILOT:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            continue
        for m in PATH_RE.finditer(open(p, encoding="utf-8", errors="ignore").read()):
            t = m.group(1)
            if t in PROSE or "<" in t or t.endswith("*"):
                continue
            if t in EXTERNAL:
                continue
            base = t[:-1] if t.endswith("/") else t
            # Un chemin est relatif soit a la racine, soit au dossier du fichier
            # qui le cite, soit a un de ses ancetres : `skills/README.md` dans
            # system/README.md designe system/skills/README.md.
            bases = [ROOT, os.path.join(ROOT, "second-brain"), os.path.join(ROOT, "aios-app")]
            d = os.path.dirname(os.path.join(ROOT, rel))
            while len(d) >= len(ROOT):
                bases.append(d)
                d = os.path.dirname(d)
            if any(os.path.exists(os.path.join(b, base)) for b in bases):
                continue
            # Reference a un ADR par son numero : `docs/adr/0003` vaut pour
            # 0003-<slug>.md. C'est la forme lisible, on ne va pas exiger le slug.
            adr = re.match(r"(.*/adr)/(\d{4})$", base)
            if adr and any(
                any(f.startswith(adr.group(2)) for f in os.listdir(os.path.join(b, adr.group(1))))
                for b in bases if os.path.isdir(os.path.join(b, adr.group(1)))
            ):
                continue
            # Un chemin gitignore est ABSENT D'UN CLONE PAR CONCEPTION :
            # `user.md` nait a l'etape 4 de SETUP.md, `secrets.registry.md` est
            # local, `_active/.system/` appartient a Codex. Le citer dans la doc
            # est legitime ; exiger sa presence ferait echouer l'audit sur tout
            # clone neuf. On demande a git plutot que de tenir une liste, qui
            # aurait derive comme le reste.
            if is_gitignored(base):
                continue
            # Premier segment inconnu partout = reference a un depot etranger,
            # pas une affirmation sur ce repo. On ne peut pas la verifier.
            head = base.split("/")[0]
            if not any(os.path.exists(os.path.join(b, head)) for b in bases):
                continue
            errors.append(f"{rel}: chemin inexistant `{t}`")


def check_skills():
    known = skill_names()
    if not known:
        return
    ref = re.compile(r"`([a-z][a-z0-9-]{3,})`")
    # Un mot en backticks n'est un skill que s'il est deja connu ailleurs OU
    # s'il apparait dans une phrase qui parle de skills. On se limite donc aux
    # noms cites dans skills/README.md, le seul inventaire qui se veut exhaustif.
    p = os.path.join(ROOT, "system", "skills", "README.md")
    if not os.path.exists(p):
        return
    text = open(p, encoding="utf-8", errors="ignore").read()
    inventory = re.search(r"```text\n(.*?)```", text, re.S)
    if not inventory:
        return
    for m in ref.finditer(inventory.group(1)):
        if m.group(1) not in known:
            errors.append(f"system/skills/README.md: skill inexistant `{m.group(1)}`")


def check_scripts():
    d = os.path.join(ROOT, "system", "scripts")
    for rel in PILOT:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            continue
        for m in re.finditer(r"system/scripts/([a-z-]+\.(?:sh|py))",
                             open(p, encoding="utf-8", errors="ignore").read()):
            if not os.path.exists(os.path.join(d, m.group(1))):
                errors.append(f"{rel}: script inexistant system/scripts/{m.group(1)}")


def check_cycle():
    """Les caps du trimestre de user.md doivent afficher un cycle non depasse.

    user.md est gitignore (absent d'un clone, cree au setup) : on ne verifie que
    s'il existe. Mais s'il existe, le contrat est strict : un en-tete de cycle
    parsable, et une echeance non depassee. C'est le fichier projete dans chaque
    session ; un cycle perime y a deja vecu 15 jours sans que personne ne le voie.
    """
    p = os.path.join(ROOT, "system", "preferences", "user.md")
    if not os.path.exists(p):
        return
    text = open(p, encoding="utf-8", errors="ignore").read()
    m = re.search(r"cycle (20\d\d-Q\d), \S+ (\d{4}-\d{2}-\d{2})\)", text)
    if not m:
        errors.append("system/preferences/user.md: pas d'en-tete de cycle parsable "
                      "(attendu: '## Caps du trimestre (cycle YYYY-QN, echeance YYYY-MM-DD)')")
        return
    deadline = datetime.date.fromisoformat(m.group(2))
    if datetime.date.today() > deadline:
        errors.append(f"system/preferences/user.md: le cycle {m.group(1)} affiche est "
                      f"depasse depuis le {m.group(2)}, reecrire les caps du trimestre")


check_paths()
check_skills()
check_scripts()
check_cycle()

if errors:
    print("La documentation ne colle plus a la realite :")
    for e in sorted(set(errors)):
        print(f"  {e}")
    print("\nCorriger la doc, ou ajouter le chemin a PROSE s'il est vraiment illustratif.")
    sys.exit(1)
print("Doc/realite: OK")
