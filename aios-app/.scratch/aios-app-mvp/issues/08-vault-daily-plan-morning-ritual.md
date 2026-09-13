# 08 — VAULT : la daily note porte `focus` et `plan`, écrits par le rituel du matin

**What to build:** Chaque matin, le rituel du matin lit Google Calendar et écrit dans le frontmatter de la daily note la tâche focus et les créneaux de la journée, sous une forme lisible par une machine. Aucun code d'application dans ce ticket : c'est un chantier de vault.

**Blocked by:** None — can start immediately.

**Status:** superseded par [29](29-morning-ritual-ecrit-focus-proposals-plan.md), qui reprend ce contrat et y ajoute `proposals`, l'ordre d'écriture et les garde-fous du skill.

- [ ] Le schéma canonique de la daily note gagne deux clés de frontmatter, `focus` et `plan`, documentées comme les autres schémas du vault
- [ ] Le corps de la daily note est **inchangé** : les sections existantes restent identiques, dans le même ordre
- [ ] Forme retenue, issue de la session de cadrage :

```yaml
focus: '[[slug-de-la-tache]]'
plan:
  - { start: "09:00", end: "10:30", kind: focus,    task: '[[slug]]', label: "Focus LinkedIn" }
  - { start: "11:00", end: "11:30", kind: meeting,  label: "Call client" }
  - { start: "16:00", end: "17:30", kind: proposal, task: '[[slug]]' }
```

- [ ] `kind` prend une valeur parmi `focus`, `meeting`, `proposal`, `perso`
- [ ] Les trous ne sont jamais stockés : ils se déduisent de la journée cadrée moins les créneaux occupés
- [ ] Le rituel du matin remplit ces clés à partir de Google Calendar pour les réunions, et de la priorisation de la session pour le focus et les propositions
- [ ] Les daily notes existantes sans ces clés restent valides et ne sont pas migrées
- [ ] Une daily note réelle est produite avec le nouveau format, et vérifiée à la main
