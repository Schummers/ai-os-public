# 16 — Date "aujourd'hui" en fuseau local et fenêtre "cette semaine" correcte

**What to build:** L'utilisateur travaille dans un fuseau éloigné d'UTC (UTC+8). Tous les calculs de date du jour (filtres Aujourd'hui/En retard/Cette semaine, Daily View, plan du jour) doivent utiliser sa date locale, pas la date UTC — sinon l'app croit encore être la veille pendant les ~8 premières heures de sa journée. La fenêtre "cette semaine" doit couvrir 7 jours, pas 8.

**Blocked by:** Aucun — peut démarrer immédiatement.

**Status:** ready-for-agent

- [x] Le calcul de "aujourd'hui" utilisé par les filtres Global (Aujourd'hui/En retard/Cette semaine) et par la Daily View est basé sur la date locale de l'utilisateur, pas `toISOString()` (UTC)
- [x] Une tâche due "aujourd'hui" à 2h du matin locales est bien reconnue comme due aujourd'hui, pas hier
- [x] Le filtre "Cette semaine" inclut les tâches dues de J+0 à J+6 (7 jours), pas J+0 à J+7 (8 jours)
- [x] Les tests existants sur les filtres et la Daily View sont mis à jour pour couvrir un cas proche de minuit local
- [x] `npm run typecheck` et `npm test` passent

