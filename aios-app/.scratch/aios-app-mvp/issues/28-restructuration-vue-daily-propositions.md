# 28 — Restructuration de la vue Daily : tâches du jour, retards, propositions, journée

**What to build:** La vue Daily remonte aujourd'hui **toutes** les tâches
ouvertes des projets `on` (46 lignes, illisible). Elle est restructurée en
quatre sections ordonnées, et lit les propositions du rituel du matin.

**Blocked by:** 27 (le chemin de la daily note).

**Status:** ready-for-agent

Référence visuelle : `wireframes/daily-v2.html` (trois états + séquence).

## Sections, dans l'ordre

1. **Projets en cours** — rail, inchangé.
2. **Tâches du jour** — `due == aujourd'hui` uniquement. La tâche portant le
   `focus` de la daily note est en tête, marquée `focus`.
3. **En retard et en cours** — un seul bloc, retards d'abord (`due < aujourd'hui`),
   puis les `doing` sans `due` du jour. Pills distinctes, pas deux sections.
4. **Propositions du rituel** — lues dans le frontmatter de la daily note,
   **lecture seule**. Une proposition dont la tâche a déjà `due == aujourd'hui`
   n'est plus affichée ici : elle est remontée en section 2.
5. **Journée** — timeline, inchangée sauf l'ordre.

## Ce qui ne dépend pas du rituel

Les sections 2 et 3 lisent `projects/tasks/*.md` et s'affichent **sans** que le
rituel ait tourné. Seules 4 et 5 dépendent de la daily note, et affichent un
état vide « lance le rituel du matin » en son absence.

## Décisions de cadrage

- [ ] Aucune donnée de la daily note d'hier n'est jamais remontée aujourd'hui.
      L'absence de plan du jour affiche du vide, jamais le plan de la veille.
- [ ] Les propositions ne sont pas validables depuis l'app. La validation passe
      par la conversation avec le rituel, qui pose la `due`.
- [ ] `readDailyViewData` cesse de remonter toutes les tâches des projets `on`.
      Le filtre actuel (`daily.ts:57-77`) est remplacé par les trois ensembles
      ci-dessus.
- [ ] Nouvelle clé de frontmatter lue : `proposals: [{ task, why }]`, absente
      des daily notes existantes, donc optionnelle.
- [ ] Le bouton de lancement du rituel n'existe pas : l'app ne peut pas lancer
      un skill, c'est le skill qui ouvre l'app.
- [ ] Les strings nouvelles sont écrites **directement en anglais** (voir 30).
