# 30 — Passer le châssis de l'interface en anglais

**What to build:** Toutes les strings d'interface passent en anglais, en vue
d'une publication publique éventuelle de l'app.

**Blocked by:** 28 (pour ne pas traduire des strings en cours de réécriture).

**Status:** ready-for-agent

## Périmètre

**En anglais** : labels de sections, boutons, états vides, tooltips,
`aria-label`, titres de pages, messages d'erreur.

**Reste en français** : tout ce qui sort du vault. Titres de tâches, noms de
projets et de goals, `why` des propositions, corps des notes. Ce contenu est
français et le restera.

- [ ] Format de date court et neutre (`Mon 24 Aug`) pour ne pas mélanger deux
      langues dans une même ligne
- [ ] Aucune string en dur nouvelle en français après ce ticket
- [ ] Pas d'i18n : strings anglaises en dur. Le jour où l'app devient publique
      avec plusieurs langues, ce sera un autre chantier
- [ ] Les commentaires de code restent en français (convention du repo)
