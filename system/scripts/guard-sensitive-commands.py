#!/usr/bin/env python3
"""
Hook PreToolUse (matcher Bash) — garde-fou sur les commandes sensibles.

POURQUOI CE FICHIER EXISTE
--------------------------
Les règles `permissions.ask` de settings.json sont comparées au DÉBUT de la
commande. Dès que la commande sensible n'est pas en première position, la règle
ne matche plus et la popup n'apparaît pas. Tout ceci passe au travers :

    cd /tmp
    gws gmail users messages send ...          # précédé d'un cd

    echo ok && gws gmail users messages send ...

    gws gmail users messages send ... | tail   # noyé dans un pipe

Le 29/07/2026 un email est parti sans confirmation exactement comme ça, alors
que `Bash(gws gmail users messages send*)` était bien dans la liste `ask`.

Ce hook reçoit la commande ENTIÈRE sur stdin et cherche les motifs n'importe où
dedans, donc la position n'a plus d'importance.

CE QU'IL NE FAIT PAS
--------------------
Ce n'est pas un bac à sable. Un contournement délibéré reste possible (encodage
base64, variables, script intermédiaire). L'objectif est d'attraper les
formulations involontaires, qui sont le vrai risque au quotidien.

SORTIE
------
JSON sur stdout, conforme au schéma PreToolUse :
  {"hookSpecificOutput": {"hookEventName": "PreToolUse",
                          "permissionDecision": "ask"|"deny",
                          "permissionDecisionReason": "..."}}
Rien du tout (exit 0) si aucun motif ne matche : le flux de permissions normal
s'applique alors, donc ce hook ne peut jamais élargir les droits, seulement les
restreindre.
"""
import json
import re
import sys

# (regex, décision, explication montrée à l'utilisateur)
# ASK  = popup de confirmation.
# DENY = refus net, à faire à la main hors agent.
RULES = [
    # ---------- Gmail : envoi ----------
    (r"\bgws\s+gmail\b.*\bmessages\s+send\b", "ask",
     "Envoi d'un email depuis ton compte Gmail."),
    (r"\bgws\s+gmail\b.*\bdrafts\s+send\b", "ask",
     "Envoi d'un brouillon Gmail existant."),

    # ---------- Gmail : exfiltration silencieuse ----------
    # Une règle de transfert ou un filtre survit à la session et détourne du
    # courrier en continu, sans que rien n'apparaisse dans les messages envoyés.
    # Pas de \b devant `forwarding` : les méthodes réelles sont en camelCase
    # (`updateAutoForwarding`, `forwardingAddresses`) et une frontière de mot
    # ne matcherait pas au milieu de `updateAutoForwarding`.
    (r"\bgws\s+gmail\b.*\bsettings\b.*forwarding", "ask",
     "Règle de transfert automatique Gmail : effet permanent, invisible dans les envois."),
    (r"\bgws\s+gmail\b.*\bsettings\b.*\bfilters\b.*\b(create|update)\b", "ask",
     "Filtre Gmail : peut rediriger ou supprimer du courrier en continu."),
    (r"\bgws\s+gmail\b.*\bsettings\b.*\bdelegates\b.*\b(create|update)\b", "ask",
     "Délégation Gmail : donne accès à ta boîte à un tiers."),
    (r"\bgws\s+gmail\b.*\bsettings\b.*\bsendAs\b.*\b(create|update|patch)\b", "ask",
     "Alias d'expédition Gmail : permet d'envoyer sous une autre identité."),
    (r"\bgws\s+gmail\b.*\bsettings\b.*\bvacation\b", "ask",
     "Réponse automatique Gmail : répond en ton nom à tes correspondants."),

    # ---------- Gmail : destruction ----------
    (r"\bgws\s+gmail\b.*\bmessages\s+batchDelete\b", "deny",
     "Suppression définitive en masse de messages Gmail. À faire à la main."),
    (r"\bgws\s+gmail\b.*\bmessages\s+delete\b", "ask",
     "Suppression définitive d'un message Gmail (contourne la corbeille)."),

    # ---------- Drive : partage ----------
    # Créer une permission peut rendre un document public.
    (r"\bgws\s+drive\b.*\bpermissions\b.*\b(create|update|delete)\b", "ask",
     "Modification du partage Drive : peut rendre un fichier accessible à des tiers."),

    # ---------- Drive : destruction ----------
    (r"\bgws\s+drive\b.*\bfiles\s+emptyTrash\b", "deny",
     "Vidage définitif de la corbeille Drive. À faire à la main."),
    (r"\bgws\s+drive\b.*\bfiles\s+delete\b", "ask",
     "Suppression définitive d'un fichier Drive (contourne la corbeille)."),
    (r"\bgws\s+drive\b.*\brevisions\s+delete\b", "ask",
     "Suppression d'une révision Drive : perte d'historique."),

    # ---------- Calendar ----------
    (r"\bgws\s+calendar\b.*\bcalendars\s+clear\b", "deny",
     "Vidage complet d'un calendrier. À faire à la main."),
    (r"\bgws\s+calendar\b.*\bcalendars\s+delete\b", "ask",
     "Suppression d'un calendrier entier."),
    (r"\bgws\s+calendar\b.*\bevents\s+delete\b", "ask",
     "Suppression d'un événement de ton agenda."),
    (r"\bgws\s+calendar\b.*\bacl\b.*\b(insert|update|delete)\b", "ask",
     "Partage de calendrier : donne accès à ton agenda."),

    # ---------- Contacts ----------
    (r"\bgws\s+people\b.*\bdelete", "ask",
     "Suppression d'un contact Google."),

    # ---------- Admin SDK ----------
    (r"\bgws\s+admin\b.*\b(delete|suspend)\b", "ask",
     "Opération Admin Google Workspace sur un utilisateur ou un groupe."),

    # ---------- Git destructif ----------
    # --force-with-lease est volontairement épargné : il refuse d'écraser un
    # travail distant qu'on n'a pas vu, contrairement à --force.
    (r"\bgit\s+push\b(?!.*--force-with-lease).*\s(--force|-f)\b", "ask",
     "git push --force : réécrit l'historique distant."),
    (r"\bgit\s+reset\s+--hard\b", "ask",
     "git reset --hard : perte des modifications non commitées."),
    (r"\bgit\s+clean\s+-[a-z]*f", "ask",
     "git clean -f : suppression de fichiers non suivis."),

    # ---------- Supabase production ----------
    # `db push` n'a pas d'équivalent local : il cible toujours le projet lié
    # (remote), donc systématiquement à confirmer.
    (r"\bsupabase\b.*\bdb\s+push\b", "ask",
     "Push Supabase : vérifier qu'il ne s'agit pas de la prod."),
    # `db reset` seul ne touche que la base locale (rebuild depuis les
    # migrations) ; seul --linked reset la base distante.
    (r"\bsupabase\b.*\bdb\s+reset\b.*--linked", "ask",
     "Reset Supabase distant (--linked) : vérifier qu'il ne s'agit pas de la prod."),

    # ---------- PostHog ----------
    # La clé du Keychain est full scope (décidé le 2026-09-02) : elle peut
    # supprimer un projet et tout son historique d'events, sans corbeille.
    # Supprimer un projet entier ne se fait pas depuis un agent : le chemin
    # `/api/projects/<id>/` sans sous-ressource derrière est refusé net.
    (r"\bphog(\.sh)?\b[^|;&]*\bdelete\s+[\"']?/api/projects/\d+/?[\"']?\s*($|[|;&])", "deny",
     "Suppression d'un projet PostHog entier et de ses events. Irréversible, à faire à la main."),
    (r"\bphog(\.sh)?\b.*\bdelete\b", "ask",
     "Suppression d'une ressource PostHog : la clé est full scope, PostHog n'a pas de corbeille."),
    (r"\bphog(\.sh)?\b.*\bpatch\b", "ask",
     "Modification d'une ressource PostHog (un patch `deleted:true` supprime aussi)."),
    # Le script n'est pas le seul chemin vers l'API : un curl direct avec la
    # même clé ferait exactement la même chose sans passer par `phog`.
    # Deux lookaheads plutôt qu'une séquence : `-X DELETE` peut précéder ou
    # suivre l'URL sur la ligne de commande, une regex ordonnée en raterait la
    # moitié.
    (r"\bcurl\b(?=[^|;&]*posthog\.com)(?=[^|;&]*(-X|--request)\s*[\"']?(DELETE|PATCH|PUT)\b)", "ask",
     "Écriture directe sur l'API PostHog, hors du script `phog`."),

    # ---------- Filesystem ----------
    (r"\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b", "ask",
     "rm -rf : suppression récursive irréversible."),
]

COMPILED = [(re.compile(p, re.IGNORECASE), d, r) for p, d, r in RULES]


def decide(haystack):
    """Retourne (décision, raison) ou None. `deny` prime sur `ask`."""
    hits = [(d, r) for rx, d, r in COMPILED if rx.search(haystack)]
    if not hits:
        return None
    for decision, reason in hits:
        if decision == "deny":
            return "deny", reason
    return hits[0]


def main():
    raw = sys.stdin.read()

    # Si le JSON est illisible, on cherche quand même dans le texte brut :
    # rater un motif est pire que lever une confirmation en trop.
    try:
        command = json.loads(raw).get("tool_input", {}).get("command", "") or raw
    except (json.JSONDecodeError, AttributeError):
        command = raw

    verdict = decide(command)
    if verdict is None:
        return 0

    decision, reason = verdict
    suffix = ("\n\nCe hook voit la commande entière, y compris après un cd, un "
              "&& ou un pipe, là où les règles permissions.ask ne matchent que "
              "le début.")
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": reason + suffix,
        }
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
