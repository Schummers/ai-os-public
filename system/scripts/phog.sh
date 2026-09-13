#!/usr/bin/env bash
# phog — client PostHog minimal, une commande par question.
#
# Pourquoi pas le MCP PostHog : il expose une quarantaine d'outils qui sont
# chargés dans le contexte de chaque session, pour des réponses que trois
# endpoints REST donnent déjà. HogQL couvre tout ce que le MCP sait faire,
# et davantage. Décidé le 2026-09-02.
#
# La clé vit dans le Keychain, jamais sur disque :
#   security add-generic-password -U -a "$USER" -s POSTHOG_PERSONAL_API_KEY -w <phx_...>
#
# Usage :
#   phog projects
#   phog events   <project_id> [limit]
#   phog project  <project_id>
#   phog sql      <project_id> "select event, count() from events group by event"
#   phog raw      <chemin d'API>            # ex: /api/projects/210321/session_recordings/
#   phog post     <chemin> '<json>'
#   phog patch    <chemin> '<json>'
#   phog delete   <chemin>
#
# La clé est full scope. `patch` et `delete` peuvent détruire un projet et ses
# données, sans corbeille et sans confirmation. Relire le chemin avant d'envoyer.

set -euo pipefail

HOST="${POSTHOG_HOST:-https://eu.posthog.com}"

# Résolue une seule fois : `exit` dans un $(sous-shell) ne tue pas le script,
# la vérification doit donc se faire ici et pas dans la fonction appelée.
KEY="$(security find-generic-password -a "$USER" -s POSTHOG_PERSONAL_API_KEY -w 2>/dev/null || true)"
if [ -z "$KEY" ]; then
  echo "Clé absente du Keychain. Voir l'en-tête de ce script." >&2
  exit 1
fi

api() {
  curl -sS -H "Authorization: Bearer $KEY" "$@"
}

cmd="${1:-}"
case "$cmd" in
  projects)
    api "$HOST/api/projects/" | jq -r '.results[] | "\(.id)\t\(.name)\t\(.api_token)"'
    ;;
  project)
    api "$HOST/api/projects/${2:?project_id manquant}/" | jq
    ;;
  events)
    api "$HOST/api/projects/${2:?project_id manquant}/events/?limit=${3:-5}" | jq
    ;;
  sql)
    pid="${2:?project_id manquant}"; q="${3:?requête HogQL manquante}"
    api -X POST "$HOST/api/projects/$pid/query/" \
      -H "Content-Type: application/json" \
      -d "$(jq -nc --arg q "$q" '{query:{kind:"HogQLQuery",query:$q}}')" \
      | jq '{columns, results}'
    ;;
  raw)
    api "$HOST${2:?chemin manquant}" | jq
    ;;
  post|patch)
    verb=$(printf '%s' "$cmd" | tr '[:lower:]' '[:upper:]')
    api -X "$verb" "$HOST${2:?chemin manquant}" \
      -H "Content-Type: application/json" \
      -d "${3:?corps JSON manquant}" | jq
    ;;
  delete)
    api -X DELETE -o /dev/null -w 'HTTP %{http_code}\n' "$HOST${2:?chemin manquant}"
    ;;
  *)
    sed -n '2,26p' "$0"
    exit 1
    ;;
esac
