# 33 — Section Journal : le corps de la daily note dans la vue Daily

**What to build:** Le gateway lisait le frontmatter de la daily note et jetait
le corps. `## Session Recap`, `## Decisions`, `## Follow-Ups`,
`## Morning Journaling` n'existaient nulle part dans l'app.

**Blocked by:** None.

**Status:** complete — commit 4a8f33c

- [x] `splitMarkdownSections()` dans `lib/vault/details.ts` : découpe un corps
      Markdown par titres de niveau 2, dans l'ordre du fichier. Complète
      `extractMarkdownSection`, qui exige de connaître le titre à l'avance
- [x] Aucune liste de titres codée en dur : le rituel et `/update-brain` en
      ajoutent au fil du temps, une liste figée finirait par masquer du
      contenu sans le dire
- [x] `DailyViewData` porte `journal`, `journalWikilinks` et `obsidianUrl`
- [x] `DailyJournalSection`, dernière section de la page, toutes sous-sections
      dépliées, wikilinks cliquables via `MarkdownWithWikilinks`
- [x] Lecture seule, plus un lien `obsidian://` vers la note
- [x] Vérifié dans le navigateur sur la vraie daily note du 2026-08-24

## Limite connue, à traiter ailleurs

`MarkdownWithWikilinks` ne rend pas le gras : `**grilling**` s'affiche avec
ses astérisques. Le composant gère les wikilinks, les listes et les cases à
cocher, pas l'emphase. Visible dans le journal parce que `/update-brain` en
écrit beaucoup. À reprendre dans le ticket 32 (retours visuels).
