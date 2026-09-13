# 29 — Le rituel du matin écrit `focus`, `proposals` et `plan` dans la daily note

**What to build:** `second-brain/.claude/skills/morning-ritual/SKILL.md` n'écrit
aujourd'hui que la section « Morning Journaling » du corps. Il doit écrire le
frontmatter machine que l'app lit. Remplace et précise le ticket 08.

**Blocked by:** 28 (le contrat de lecture côté app).

**Status:** ready-for-agent

**À faire en session dédiée, avec relecture.** Ce ticket touche un skill dont
l'`allowed-tools` est volontairement en lecture seule sur Gmail, Drive et
Calendar, et dont l'en-tête explique pourquoi. **Ne jamais y ajouter `send`,
`delete`, `trash`, `settings`, ni un `Bash(gws *)` générique.** Les écritures de
ce ticket sont des écritures **de fichiers du vault**, via `Edit`/`Write`, déjà
autorisées.

## Contrat d'écriture

```yaml
---
type: daily
date: 2026-08-24
focus: '[[slug]]'          # null tant que non validé en phase 1
proposals:
  - task: '[[slug]]'
    why: "une ligne, la raison de la reco"
plan:
  - { start: "09:00", end: "10:30", kind: focus,   task: '[[slug]]' }
  - { start: "11:00", end: "11:30", kind: meeting, label: "Call client" }
  - { start: "16:00", end: "17:00", kind: perso,   label: "Sport" }
---
```

- [ ] `kind` parmi `focus`, `meeting`, `proposal`, `perso`
- [ ] Les trous ne sont jamais stockés, ils se déduisent
- [ ] Le corps de la daily note est **inchangé**, mêmes sections, même ordre
- [ ] Le rituel ouvre l'app dans le panel **dès le début** de la phase 1
      (`.claude/launch.json` du vault a déjà l'entrée `aios-app`)
- [ ] `proposals` et `plan` sont écrits en phase 1, **avant** ta réponse
- [ ] `focus` n'est écrit qu'**après** ta validation explicite
- [ ] À la validation, le rituel pose `due: <aujourd'hui>` sur le fichier de la
      tâche retenue. Il ne touche **pas** au `status` : c'est l'app qui passe en
      `doing` quand le travail démarre réellement
- [ ] Si la daily note du jour n'a pas de frontmatter (cas réel : `2026-08-24.md`
      commence par `## Session Recap`), le rituel l'ajoute en conservant le corps
      tel quel, et le mentionne en une ligne
- [ ] Les daily notes existantes sans ces clés restent valides, aucune migration
- [ ] Une daily note réelle est produite au nouveau format et vérifiée à la main

## Dette adjacente à signaler, pas à corriger ici

Quelque chose crée des daily notes sans suivre `_agent/templates/daily.md`, qui
porte pourtant déjà un frontmatter. Identifier le producteur.
