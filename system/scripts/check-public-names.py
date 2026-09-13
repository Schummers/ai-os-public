#!/usr/bin/env python3
"""Refuse un arbre qui contient un nom propre personnel.

Lance sur le repertoire courant (ou celui passe en argument), parcourt tous les
fichiers texte hors .git, et sort en 1 des qu'un mot de public-denylist.txt
apparait. Appele par sync-public.sh avant le push du snapshot public.

Le nom d'un fichier compte autant que son contenu : un ticket appele
00-fork-design-system-<projet>.md publie le nom dans l'URL du depot.
"""
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
DENYLIST = os.path.join(HERE, "public-denylist.txt")
SKIP_DIRS = {".git", "node_modules", ".next", "__pycache__"}
# La liste elle-meme contient forcement tous les termes interdits.
SKIP_FILES = {"public-denylist.txt"}
# Un terme suivi d'un patronyme en majuscule designe un tiers, pas le
# proprietaire : un prenom suivi d'un nom de famille est un auteur cite, le
# prenom seul est une fuite. Sans cette regle, un corpus de citations devient
# impubliable. Les paires listees ci-dessous ne beneficient jamais de
# l'exception : ce sont les noms complets du proprietaire lui-meme, a remplir
# dans public-denylist.txt avec le prefixe "=".
NEVER_ALLOW = set()
BINARY_EXT = {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".ico", ".woff", ".woff2",
              ".mov", ".mp4", ".zip", ".heic", ".webp", ".ttf", ".otf"}


def fold(s):
    """Minuscules sans accents, caractere par caractere.

    Le pliage se fait 1 caractere -> 1 caractere pour que les offsets restent
    alignes sur la chaine d'origine : c'est ce qui permet de retourner voir la
    CASSE du texte original apres un match. Un NFD global ne le permet pas, il
    change la longueur.
    """
    out = []
    for ch in s:
        base = unicodedata.normalize("NFD", ch)
        base = "".join(c for c in base if unicodedata.category(c) != "Mn")
        out.append((base or ch)[0].lower())
    return "".join(out)


def load_terms():
    terms = []
    with open(DENYLIST, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("="):
                # Nom complet du proprietaire : jamais couvert par l'exception
                # "prenom + patronyme = tiers".
                NEVER_ALLOW.add(fold(line[1:].strip()))
                continue
            terms.append(line)
    # Deduplique apres pliage : deux graphies d'un meme nom donnent un seul motif.
    seen, out = set(), []
    for t in terms:
        f = fold(t)
        if f not in seen:
            seen.add(f)
            out.append(f)
    return out


def main():
    # Usage : check-public-names.py [racine] [--exempt PREFIXE]...
    # Un prefixe exempte un sous-arbre de material externe recopie verbatim
    # (transcripts, articles), ou un nom de tiers n'est pas une fuite du
    # proprietaire. A n'utiliser que sur un dossier dont le contrat dit
    # explicitement qu'il ne contient rien du proprietaire.
    args = sys.argv[1:]
    exempt = []
    positional = []
    i = 0
    while i < len(args):
        if args[i] == "--exempt" and i + 1 < len(args):
            exempt.append(args[i + 1].strip("/"))
            i += 2
        else:
            positional.append(args[i])
            i += 1
    root = positional[0] if positional else "."
    terms = load_terms()
    if not terms:
        print("denylist vide, rien a verifier", file=sys.stderr)
        return 1
    pattern = re.compile(r"(?<![\w-])(" + "|".join(re.escape(t) for t in terms)
                         + r")(?![\w-])")
    # Patronyme qui suit : un mot CAPITALISE, eventuellement precede d'une
    # initiale ("Jonathan H. Ward"). Teste sur le texte d'origine, pas sur le
    # texte plie : sinon n'importe quel mot suivant passe pour un patronyme et
    # le garde-fou ne garde plus rien.
    surname = re.compile(r"[ \t]+(?:[A-Z]\.[ \t]+)?[A-Z][\w'-]+")

    def is_third_party(raw, folded, match):
        """Vrai si le terme est suivi d'un patronyme, donc designe un tiers."""
        m = surname.match(raw, match.end())
        if not m:
            return False
        pair = folded[match.start():m.end()].split()
        return " ".join(pair[:2]) not in NEVER_ALLOW
    hits = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name in SKIP_FILES:
                continue
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, root)
            if any(rel == e or rel.startswith(e + os.sep) for e in exempt):
                continue
            folded_rel = fold(rel)
            m = pattern.search(folded_rel)
            if m and not is_third_party(rel, folded_rel, m):
                hits.append((rel, 0, "nom de fichier", m.group(1)))
                continue
            if os.path.splitext(name)[1].lower() in BINARY_EXT:
                continue
            try:
                with open(path, encoding="utf-8", errors="ignore") as fh:
                    for lineno, line in enumerate(fh, 1):
                        folded = fold(line)
                        for m in pattern.finditer(folded):
                            if is_third_party(line, folded, m):
                                continue
                            hits.append((rel, lineno, line.strip()[:90],
                                         m.group(1)))
                            break
            except OSError:
                continue
    if hits:
        print(f"noms personnels dans le snapshot ({len(hits)}) :",
              file=sys.stderr)
        for rel, lineno, ctx, term in hits[:40]:
            where = f"{rel}:{lineno}" if lineno else rel
            print(f"  [{term}] {where}  {ctx}", file=sys.stderr)
        if len(hits) > 40:
            print(f"  ... et {len(hits) - 40} autres", file=sys.stderr)
        return 1
    suffix = f", {len(exempt)} sous-arbre(s) exempte(s)" if exempt else ""
    print(f"aucun nom personnel ({len(terms)} termes verifies{suffix})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
