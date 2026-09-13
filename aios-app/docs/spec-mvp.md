# AIOS App — Spec MVP

> Statut : `ready-for-agent`. Issue tracker : markdown local (`.scratch/aios-app-mvp/issues/`).
> Wireframes de référence : `wireframes/wireframes.html` (7 écrans) et `wireframes/labo.html` (les 5 forks tranchés).
> Vocabulaire : celui du vault (`second-brain/CLAUDE.md` et `_agent/templates/`). Un **goal** porte le trimestre, un **projet** la semaine, une **tâche** la journée. Un **contenu** est frère du projet, pas un projet.

---

## Problem Statement

L'utilisateur pilote son travail depuis un vault Markdown de 15 goals, 17 projets vivants et 236 tâches. Obsidian affiche des fichiers, pas un état : pour savoir ce qui avance, ce qui dérive et ce qu'il doit faire aujourd'hui, il doit ouvrir plusieurs dossiers et lire du frontmatter à la main. Les signaux qui comptent (un projet `on` inactif depuis 21 jours, une `target_date` dépassée, une tâche bloquée) sont présents dans les fichiers mais invisibles sans agrégation.

En parallèle, il travaille toute la journée dans Claude Code. Le vault y est manipulé par des skills, mais rien ne lui **montre** l'état résultant. Il n'existe aucune surface où voir sa journée et l'état de ses projets pendant qu'il travaille, ni où changer un statut de tâche sans ouvrir un fichier.

## Solution

Une application web locale, **AIOS App**, qui lit le vault sur disque et le rend sous deux vues :

- **Daily** : ce qu'il y a à faire aujourd'hui, sa forme dans le temps, et l'état des projets actifs.
- **Global** : tous les goals, projets et contenus, filtrables, avec les tâches accessibles sans changer de page.

Elle est conçue à 390px pour tenir dans le panneau droit de Claude Code, et reste utilisable jusqu'au desktop. Elle est en lecture seule sauf quatre champs de tâche, que l'utilisateur peut changer d'un tap depuis n'importe quelle liste.

Elle ne remplace pas les skills : tout ce qui crée, classe ou déplace un fichier reste un geste d'agent. L'app est une surface de lecture avec un canif.

---

## User Stories

### Navigation et cadre

1. En tant que l'utilisateur, je veux basculer entre Daily et Global depuis le coin supérieur gauche, afin de changer d'échelle sans quitter des yeux le contenu.
2. En tant que l'utilisateur, je veux la recherche accessible en permanence à l'extrême droite de la barre du haut, afin d'y accéder au pouce depuis n'importe quel écran.
3. En tant que l'utilisateur, je veux un accès à l'inbox juste à gauche de la recherche, avec un compteur des captures non traitées, afin de savoir qu'il y a du non-traité sans y aller.
4. En tant que l'utilisateur, je veux que l'app soit lisible à 390px de large, afin de la garder ouverte dans le panneau droit de Claude Code pendant que je travaille.
5. En tant que l'utilisateur, je veux que la même app s'élargisse proprement sur un écran d'ordinateur, afin de ne pas avoir deux produits à maintenir.
6. En tant que l'utilisateur, je veux lancer l'app par une commande unique en local, afin de ne jamais dépendre du réseau ni d'un déploiement.
7. En tant que l'utilisateur, je veux qu'elle relise le vault quand je reviens sur l'onglet, afin de ne pas regarder un état périmé après une session d'agent.

### Vue Daily

8. En tant que l'utilisateur, je veux voir en première section mes projets actifs sous forme de cartes en scroll horizontal, afin d'ouvrir ma journée sur l'état du travail en cours.
9. En tant que l'utilisateur, je veux que chaque carte de projet actif montre son compteur de tâches et son signal de dérive, afin de repérer sans lire ce qui décroche.
10. En tant que l'utilisateur, je veux qu'un tap sur une carte projet ouvre la page du projet, afin d'y descendre immédiatement.
11. En tant que l'utilisateur, je veux revenir en arrière depuis la page projet, afin de repartir d'où j'étais.
12. En tant que l'utilisateur, je veux une section « Focus du jour » qui affiche la tâche désignée le matin, afin de savoir ce qui compte avant tout le reste.
13. En tant que l'utilisateur, je veux voir à quel goal et à quel projet ce focus se rattache, afin de vérifier que ma priorité du jour sert bien mon trimestre.
14. En tant que l'utilisateur, je veux la liste des tâches du jour juste sous le focus, afin d'avoir ma to-do sans scroller.
15. En tant que l'utilisateur, je veux voir sur chaque ligne de tâche sa priorité, son échéance et son autonomie, afin de trier sans ouvrir.
16. En tant que l'utilisateur, je veux que les tâches bloquées apparaissent en fin de liste, atténuées, avec la raison du blocage, afin de ne pas les confondre avec du travail disponible.
17. En tant que l'utilisateur, je veux voir ma journée sous forme de blocs proportionnels à leur durée, afin de sentir la charge sans lire des horaires.
18. En tant que l'utilisateur, je veux que les trous entre les blocs soient nommés et chiffrés (« 1h45 libres »), afin de savoir ce que je peux encore y mettre.
19. En tant que l'utilisateur, je veux que chaque trou propose une tâche candidate, afin de remplir ma journée sans réfléchir de zéro.
20. En tant que l'utilisateur, je veux distinguer visuellement une réunion réelle, un bloc de focus posé, une proposition et un moment perso, afin de savoir ce qui est engagé et ce qui est suggéré.
21. En tant que l'utilisateur, je veux voir l'heure courante sur cette vue, afin de me situer dans la journée d'un coup d'œil.
22. En tant que l'utilisateur, je veux une barre d'habitudes collée en bas d'écran, afin de les cocher sans jamais chercher où elles sont.
23. En tant que l'utilisateur, je veux que cette barre ne dépasse pas 40px et n'ait pas de trait de séparation, afin qu'elle ne mange pas la lecture du contenu.

### Vue Global

24. En tant que l'utilisateur, je veux basculer entre Projets et Contenus dans la barre de filtres, afin de traiter mes deux types de production au même niveau.
25. En tant que l'utilisateur, je veux voir tous mes goals en cartes dans un rail horizontal en haut, afin d'avoir le trimestre en tête avant de regarder la semaine.
26. En tant que l'utilisateur, je veux qu'un tap sur une carte goal filtre tout ce qui est en dessous, afin de ne voir que ce qui sert ce goal.
27. En tant que l'utilisateur, je veux désélectionner ce goal d'un second tap, afin de revenir à la vue complète sans chercher un bouton.
28. En tant que l'utilisateur, je veux voir sur chaque carte goal sa santé et le volume de travail qui y est rattaché, afin de repérer un goal sans aucun projet actif.
29. En tant que l'utilisateur, je veux mes projets groupés par statut (`on`, `ongoing`, `simmering`, `sleeping`), afin de lire la même structure que mes dossiers.
30. En tant que l'utilisateur, je veux des cartes projet denses portant goal, priorité, statut, compteurs et signal temporel, afin d'avoir le maximum d'information sans ouvrir.
31. En tant que l'utilisateur, je veux qu'un projet sans `target_date` affiche son inactivité à la place, afin que la carte reste informative pour la moitié de mes projets qui n'ont pas d'échéance.
32. En tant que l'utilisateur, je veux déplier un projet en place pour voir ses tâches, afin de juger de son contenu sans changer de page.
33. En tant que l'utilisateur, je veux que le dépliage montre **toutes** les tâches ouvertes, sans bouton « voir plus », afin qu'ouvrir veuille dire ouvrir.
34. En tant que l'utilisateur, je veux que les tâches terminées restent repliées derrière un compteur, afin qu'elles ne noient pas le travail restant.
35. En tant que l'utilisateur, je veux filtrer par statut, priorité et échéance depuis la barre visible, afin de couvrir mes trois questions les plus fréquentes en un tap.
36. En tant que l'utilisateur, je veux les filtres secondaires derrière un bouton portant un compteur d'actifs, afin de ne jamais me demander pourquoi une liste est courte.
37. En tant que l'utilisateur, je veux que mes filtres survivent au passage Projets/Contenus, afin de ne pas les reposer à chaque bascule.
38. En tant que l'utilisateur, je veux voir mes contenus groupés par statut puis, à l'intérieur de `production`, par stage, afin de savoir quelle action est possible sur chacun.
39. En tant que l'utilisateur, je veux que les stages soient présentés comme des jalons et non comme un tunnel fléché, afin que le design ne mente pas sur mon process (les stages ne sont pas une séquence).
40. En tant que l'utilisateur, je veux voir les états vides des contenus, afin que la navigation reste stable quand j'aurai commencé à produire.

### Pages de détail

41. En tant que l'utilisateur, je veux une page projet montrant objectif, dates, tâches ouvertes, notes liées et journal, afin d'avoir tout le contexte au même endroit.
42. En tant que l'utilisateur, je veux une page tâche montrant contexte, solution proposée, critères de succès et journal, afin de reprendre une tâche sans relire le fichier.
43. En tant que l'utilisateur, je veux un retour en arrière explicite sur les deux pages, afin de naviguer sans le bouton du navigateur.
44. En tant que l'utilisateur, je veux ouvrir le fichier correspondant dans Obsidian depuis la page, afin d'éditer le corps du texte là où c'est fait pour.

### Édition

45. En tant que l'utilisateur, je veux changer le statut d'une tâche depuis la vue Daily, la vue Global et la page tâche, afin de ne jamais avoir à naviguer pour un geste d'une seconde.
46. En tant que l'utilisateur, je veux que ce changement passe par un sélecteur simple, afin de ne pas apprendre de gestes cachés.
47. En tant que l'utilisateur, je veux changer la priorité d'une tâche de la même façon, afin de repriorisier en cours de journée.
48. En tant que l'utilisateur, je veux changer l'échéance d'une tâche, afin de repousser sans ouvrir le fichier.
49. En tant que l'utilisateur, je veux changer l'autonomie d'une tâche entre `assist` et `ask`, afin de marquer ce que je peux déléguer à un agent.
50. En tant que l'utilisateur, je veux filtrer sur les tâches `assist`, afin de constituer une file de travail délégable.
51. En tant que l'utilisateur, je veux que tout champ non éditable porte un marqueur visuel explicite, afin de ne jamais essayer de cliquer sur ce qui ne bouge pas.
52. En tant que l'utilisateur, je veux que le corps de mes fichiers reste strictement intact après une écriture, afin de ne jamais perdre une ligne de journal ou une mise en forme.
53. En tant que l'utilisateur, je veux être averti si le fichier a changé sur le disque depuis son affichage, afin de ne pas écraser le travail d'un agent ou d'Obsidian.

### Inbox et recherche

54. En tant que l'utilisateur, je veux voir toutes mes captures non traitées sur une page dédiée, afin de vider ma tête au même endroit où je la remplis.
55. En tant que l'utilisateur, je veux déclencher le traitement de l'inbox par l'agent depuis cette page, afin de ne pas classer à la main ce qu'un skill fait mieux.
56. En tant que l'utilisateur, je veux une recherche qui filtre dès la première frappe, afin de retrouver une tâche plus vite qu'en naviguant.
57. En tant que l'utilisateur, je veux des résultats groupés par type (tâches, projets, notes, contenus, sources, goals), afin de distinguer une note d'une tâche du même nom.
58. En tant que l'utilisateur, je veux que la recherche porte d'abord sur les titres et le frontmatter, afin de ne pas noyer un résultat dans des occurrences de corps de texte.
59. En tant que l'utilisateur, je veux déclencher la recherche plein texte en un second geste explicite, afin de l'avoir quand j'en ai besoin sans la subir.
60. En tant que l'utilisateur, je veux que `calendar/` et `_agent/` soient exclus par défaut, afin que mes recaps de session ne polluent pas mes résultats.

---

## Implementation Decisions

### Périmètre d'écriture

- Quatre champs éditables, tous sur la tâche : `status`, `priority`, `due`, `autonomy`.
- Tout le reste est en lecture, y compris les contenus (décision explicite : rien n'est éditable côté `content` en v1).
- Le `status` d'un projet n'est **pas** éditable : il est porté par le dossier (`projects/<status>/`), donc le changer est un déplacement de fichier plus une mise à jour d'`index.md` et des wikilinks. Cela reste un geste d'agent (`update-brain`).
- L'app ne crée aucune note, aucune tâche, aucun projet. La création reste l'affaire des skills (`capture`, `create-task`, `process-inbox`).

### Lecture du vault

- Le vault est résolu par `$VAULT_PATH`, défaut `~/AI OS/second-brain`, comme les skills globaux.
- Lecture du disque à chaque requête. Le volume (environ 300 fichiers d'entités) rend l'indexation prématurée ; pas de watcher, pas de cache persistant en v1.
- Rafraîchissement au retour de focus de l'onglet, plus une action de rafraîchissement manuelle.
- Les wikilinks `[[slug]]` sont résolus par nom de fichier. Un lien mort est affiché comme tel, jamais silencieusement ignoré.

### Écriture du vault

- Seul le frontmatter est réécrit. Le corps du fichier est préservé **octet pour octet** : on ne repasse jamais le corps dans un sérialiseur.
- Avant chaque écriture, relecture du fichier et comparaison avec l'état affiché. Divergence détectée, l'écriture est refusée et l'utilisateur voit l'état frais.
- Les valeurs autorisées sont contraintes par les énumérations des schémas canoniques (`_agent/templates/`), jamais du texte libre.

### Modèle de domaine

- Cinq entités lues : `goal`, `project`, `task`, `content`, `daily`, plus les captures d'`inbox/`.
- Les agrégats sont **calculés**, jamais stockés : compteurs de tâches par statut, jours d'inactivité (`last_activated`), dépassement de `target_date`, tâches d'un projet (par le champ `project` de la tâche, pas par le corps du projet).
- Le rattachement tâche vers projet fait foi via le frontmatter de la tâche. La liste en corps de projet est traitée comme décorative.

### Schéma de la daily note, additif

Le corps de la daily note ne change pas (`## Session Recap`, `## Decisions`, `## Follow-Ups`, `## Links`). Deux clés sont **ajoutées** au frontmatter :

```yaml
focus: '[[slug-de-la-tache]]'
plan:
  - { start: "09:00", end: "10:30", kind: focus,    task: '[[slug]]', label: "Focus LinkedIn" }
  - { start: "11:00", end: "11:30", kind: meeting,  label: "Call client" }
  - { start: "16:00", end: "17:30", kind: proposal, task: '[[slug]]' }
```

- `kind` : `focus | meeting | proposal | perso`.
- Les trous ne sont pas stockés : ils se déduisent de la journée cadrée moins les créneaux occupés.
- L'app **lit** ces clés, elle ne les écrit pas. C'est `morning-ritual` qui les produit, à partir de Google Calendar via `gws`, et c'est un chantier vault distinct.
- Absence de `plan` : la section Journée affiche un état vide invitant à lancer le rituel du matin.

### Design system

- Le design system est **forké** de celui de DS-source (v1.4.0, lui-même porté du portfolio v1.0.0), et devient `aios-app/DESIGN.md` v1.0.0 avec sa filiation écrite en tête. Pas de package partagé : deux consommateurs seulement, dont un prototype, ne justifient pas une infra de monorepo entre deux repos séparés. Le précédent portfolio vers DS-source montre que le fork tient.
- **Dark par défaut**, light en overlay, comme chez DS-source. Le contexte d'usage réel est le panneau droit de Claude Code, sombre.
- Typographie Space Grotesk (display) et Manrope (corps), échelle d'espacement sur grille 4px, bordures plutôt qu'ombres, tokens nommés par rôle. Règle héritée et maintenue : aucun hex ni px inliné hors du fichier de tokens.
- Sont forkés les composants **présentationnels** de DS-source, dont l'app-mvp est déjà une interface dense de 390px : contrôle segmenté, pilules et bouton de filtre, rangée de filtres actifs, pilule de recherche, rangées de liste et de groupe, section groupée, en-tête de section, mini statut, carte, bascule à puce, en-tête de détail, menu contextuel. Les composants couplés au domaine DS-source sont écartés.
- Quatre composants sont **neufs** et documentés comme extensions : vue journée en blocs proportionnels, rail horizontal de cartes goal, accordéon projet vers tâches, barre d'habitudes.

### Interface

- Deux breakpoints : 390px canonique (vérifié à 360px), et desktop où la colonne s'élargit et les filtres passent sur le côté. Pas de troisième palier.
- Barre du haut : bascule Daily/Global à gauche, inbox puis recherche à droite. Pas de nom d'application affiché.
- Ordre de la vue Daily : projets en cours (rail horizontal), focus du jour, tâches du jour, journée.
- Vue Journée : blocs proportionnels à la durée, sans grille horaire dessinée, avec les trous nommés et chiffrés portant une proposition de tâche.
- Dépliage projet : accordéon en place, toutes les tâches ouvertes, terminées repliées derrière un compteur.
- Barre d'habitudes : collée en bas, 40px maximum, sans trait de séparation, contenu en fondu derrière.
- Carte goal en v1 : santé plus volume de travail rattaché. Aucune métrique saisie n'est affichée tant que le schéma de KPI n'existe pas.

### Infrastructure

- Next.js exécuté en local, port fixe, ouvrable dans le panneau droit de Claude Code.
- `aios-app/` suit le **plan GitHub** de l'AI OS, mais **dans le repo `ai-os`**, pas comme repo imbriqué : ce n'est pas un domaine, c'est une surface système sur le vault. Décision révisée le 2026-08-26, voir `CLAUDE.md` du dossier.
- Le vault n'est jamais dupliqué ni importé : il est lu là où il est.

---

## Testing Decisions

**Ce qu'est un bon test ici** : il donne un dossier de vault en fixture, appelle la passerelle, et vérifie ce qui sort ou ce qui a été écrit sur le disque. Il ne connaît ni les composants React, ni les noms de fonctions internes, ni la forme des requêtes HTTP.

- **Seam unique** : la passerelle vault, fonctions pures prenant un chemin de dossier. Toute la logique de domaine (parsing, agrégats, dérive, résolution de wikilinks, écriture de frontmatter) est testée là, et nulle part ailleurs.
- **Fixtures** : un mini-vault jetable créé par test (quelques goals, projets répartis sur plusieurs dossiers de statut, tâches liées, une daily note avec et sans `plan`), jamais le vrai vault.
- **Tests de lecture** : les compteurs, l'inactivité, le dépassement d'échéance, le rattachement des tâches, les groupes de contenus, la résolution et la casse des wikilinks.
- **Tests d'écriture**, les plus importants : après modification d'un champ, le corps du fichier est **identique octet pour octet** ; les autres clés de frontmatter sont inchangées et dans le même ordre ; une valeur hors énumération est rejetée ; une modification concurrente du fichier fait échouer l'écriture sans toucher au disque.
- **Pas de tests d'interface en v1.** Les écrans sont issus de wireframes qui vont encore bouger ; les figer en tests coûterait plus qu'ils ne protègent. Un seul test de fumée vérifie que chaque route se rend sans erreur.
- **Prior art** : aucune, le projet est neuf. Ces tests **sont** l'art antérieur pour la suite.

---

## Out of Scope

- **Les habitudes.** Aucun modèle de données n'existe, et le streak plus le taux de complétion exigent un historique daté. Deux bases Notion ont été fournies comme source à importer ; leur conversion en Markdown et le choix du stockage feront l'objet d'une session dédiée. La barre est dessinée, elle n'est pas fonctionnelle.
- **Les KPI de goal.** Les métriques vivent aujourd'hui dans un tableau Markdown en corps de fichier, sans relevé daté. Leur passage en frontmatter est une décision de schéma de vault, à instruire en session de grilling avant toute ligne de code.
- **L'intégration directe de Google Calendar.** L'app ne parle jamais à Google. Elle lit `plan:`, que `morning-ritual` produit.
- **L'écriture de créneaux vers Google Calendar** depuis l'app.
- **La création d'entités** (notes, tâches, projets, contenus), qui reste aux skills.
- **Le changement de statut d'un projet ou d'un contenu**, qui implique un déplacement de fichier.
- **L'édition du corps des fichiers.** Le corps s'édite dans Obsidian, vers lequel l'app renvoie.
- Multi-utilisateur, authentification, déploiement distant, mode hors ligne, installation PWA, notifications.

---

## Further Notes

- Le couplage app vers vault est **doux et connu comme fragile** : il repose sur les schémas de `_agent/templates/`. Un changement de schéma casse silencieusement un agrégat. C'est la raison pour laquelle toute la logique vit derrière un seam unique et testé.
- Deux tickets touchent le vault et non l'app (`daily.md` plus `morning-ritual`, puis le schéma de KPI). Ils sont indépendants de la livraison de l'app, sauf la vue Journée qui reste vide sans le premier.
- Le pari du projet, dit explicitement en session : le différenciateur face à Obsidian Bases est **la vue Daily composite plus la présence dans le panneau Claude Code**. La vue Global, prise seule, est du Bases déguisé. Si après une semaine d'usage la vue Daily n'est pas ouverte tous les matins, le projet doit être arrêté plutôt qu'agrandi.
- Rappel de contexte : le goal `agency` (poste salarié, cycle 2026-Q3) est la priorité du trimestre. AIOS App n'y contribue pas. Il doit rester dimensionné en conséquence, et son statut de projet dans le vault doit dire la vérité sur ce point.
