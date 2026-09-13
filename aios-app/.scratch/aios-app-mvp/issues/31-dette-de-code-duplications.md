# 31 — Dette de code : duplications et bugs d'hydratation

**What to build:** Les findings d'une revue à deux axes non traités, vérifiés
encore présents au 2026-08-24. Mécanique, sans décision produit.

**Blocked by:** 30 (pour ne pas rejouer les mêmes fichiers deux fois).

**Status:** ready-for-agent

- [ ] **Top bar dupliquée** entre `DailyView` et `GlobalProjectsView` : même
      header, même `SegmentedControl`, mêmes quatre boutons (rafraîchir,
      thème, inbox, recherche). `CountBadge` a déjà été extrait pour cette
      raison. → extraire un `TopBar`.
- [ ] `<a>` imbriqué dans `<a>` dans `SearchView` (pill Obsidian à l'intérieur
      du lien de résultat) : **échec d'hydratation**, même classe de bug que
      celui déjà corrigé dans `GroupRow`. Le plus urgent des trois.
- [ ] `.light` recopie ~30 lignes de `:root` verbatim dans `app/globals.css`
      → `:root, .light { … }`.
- [ ] `bg-bg/92 backdrop-blur-md` recopié **3 fois** hors du matériau
      `.glass`, avec une opacité arbitraire absente des tokens.
- [ ] `mt-hair` en dur dans `TaskCheckbox` : la marge d'un seul appelant,
      figée dans le composant feuille.
- [ ] `HABITS` dans `HabitsBar` : `meta: "🔥 12"` mélange une série et un
      pourcentage dans une même string, impossible à formater ou à trier.
- [ ] `DESIGN.md`, section « Extensions à venir » : liste encore la barre
      d'habitudes et le rail de goals, tous deux déjà modifiés.

## Piège vérifié cette session, à ne pas réintroduire

`lib/cn.ts` déclare les classes typo custom au groupe `font-size` de
tailwind-merge. **Toute nouvelle classe `.text-*` ajoutée à `globals.css` doit
être ajoutée à cette liste**, sinon elle est silencieusement supprimée partout
où elle côtoie une couleur de texte. `micro` et `nano` y manquaient : la
pastille de compteur n'a jamais appliqué sa taille, sans la moindre erreur.

## Ce qui n'est PAS dans ce ticket

`.glass` reste en place. Il est encore utilisé dans **12 fichiers**
(`ContextMenu` entier, variante `glass` de `SearchPill`, pills Obsidian des
trois vues de détail, `bg-glass-active` sur les survols de
`ListRow`/`ChipToggle`/`GroupRow`). Le supprimer n'est pas un nettoyage, c'est
un chantier, et il attend que l'utilisateur ait critiqué les vues de détail.
