---
name: morning-ritual
description: Rituel matinal conversationnel en 3 phases — Contexte+Priorité, Journaling, Deep Work Prep — nourri par le second brain, Gmail et Calendar.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(date:*), Bash(gws calendar events list:*), Bash(gws calendar calendars get:*), Bash(gws gmail users messages list:*), Bash(gws gmail users messages get:*), Bash(gws gmail users threads list:*), Bash(gws gmail users threads get:*), Bash(gws gmail users labels list:*), mcp__Claude_Browser__preview_start
---

<!--
Le rituel est en LECTURE SEULE sur Gmail, Drive et Calendar. `allowed-tools`
ci-dessus n'autorise que des commandes `list`/`get` : aucun envoi, aucune
suppression, aucune modification de réglages n'est atteignable depuis ce skill,
quoi que dise la conversation. Ne jamais y ajouter `send`, `delete`, `trash`,
`settings` ou un `Bash(gws *)` générique — ce serait rouvrir la porte.
Filet supplémentaire, indépendant de ce fichier : les règles `ask` de
`~/.claude/settings.json` sur `gws gmail users messages send`, `gws gmail users
settings`, `gws drive permissions`, `gws drive files delete` et
`gws calendar events delete`.

`mcp__Claude_Browser__preview_start` ne sert qu'à ouvrir l'app AIOS dans le
panel (`.claude/launch.json`, entrée `aios-app`) : ni Gmail, ni Drive, ni
Calendar, ni envoi ni suppression. Les écritures de ce skill sont des
écritures de fichiers du vault via `Edit`/`Write`, déjà autorisées et sans
lien avec Gmail/Drive/Calendar.
-->


# Morning Ritual

Rituel matinal conversationnel en 3 phases. Conçu pour démarrer la journée avec clarté, intention et focus. Les 3 phases s'enchaînent au rythme de la conversation : envoyer une phase, attendre la réponse, enchaîner. Ne JAMAIS envoyer les 3 phases d'un coup.

## Phase 1 — Contexte + Priorité

### En tout premier, avant toute collecte

1. **Ouvrir l'app** : `mcp__Claude_Browser__preview_start` avec `{"name": "aios-app"}` (entrée déjà présente dans `.claude/launch.json` de ce vault). L'utilisateur doit la voir se peupler au fil du rituel, pas seulement à la fin.
2. **Vérifier le frontmatter de la daily note du jour** (`calendar/YYYY-MM/YYYY-MM-DD.md`) :
   - Si le fichier n'existe pas encore, le créer à partir de `_agent/templates/daily.md`.
   - S'il existe mais **sans frontmatter** (cas déjà rencontré : un fichier peut commencer directement par `## Session Recap`, produit par un autre skill qui ne suit pas le template) : ajouter `---\ntype: daily\ndate: YYYY-MM-DD\n---` en tête, **sans toucher au corps existant**, et le mentionner à l'utilisateur en une ligne dans le message de phase 1 (« Note : j'ai ajouté le frontmatter manquant à la daily note d'aujourd'hui, le corps n'a pas bougé. »).
   - S'il a déjà un frontmatter valide, ne rien faire ici.

### Données à collecter

1. **Hier** — lire `calendar/YYYY-MM/YYYY-MM-DD.md` (date d'hier). Résumer en 1 ligne.
2. **Emails actionnables** (via `gws gmail users threads list` / `gws gmail users messages get`, les seules commandes Gmail whitelistées dans `allowed-tools` ; si `gws` échoue ou n'est pas configuré, afficher "Gmail : non connecté") :
   - **Syntaxe exacte, à ne pas redécouvrir chaque matin** : `gws <service> <resource> [sub-resource] <method> --params '<JSON>'`. Pas de flags courts type `--calendar` ou `--from` : tout passe dans `--params`.
     - Liste des threads, filtrée dès le départ (évite de scanner puis filtrer en deux passes) :
       `gws gmail users threads list --params '{"userId":"me","q":"newer_than:7d -from:vercel -from:github -from:notifications -from:noreply -from:no-reply -from:jobstreet -from:strava -from:fireflies","maxResults":50}'`
     - Headers d'un thread (`From`/`Subject`/`Date` seulement, pas le corps) :
       `gws gmail users messages get --params '{"userId":"me","id":"<ID>","format":"metadata","metadataHeaders":["From","Subject","Date"]}'`
     - La commande imprime une ligne `Using keyring backend: keyring` avant le JSON : si on parse la sortie, chercher le premier `{`, ne pas parser tel quel.
     - Ajuster la liste d'exclusion `-from:` au fil des mois si de nouveaux expéditeurs automatiques apparaissent, mais ne jamais repartir sans aucune exclusion.
   - Scanner les 7 derniers jours. `threads list` peut retourner plus de résultats que la page par défaut (`resultSizeEstimate` fait foi, pas la taille de la première page) : si `nextPageToken` est présent ou `resultSizeEstimate` dépasse le nombre de threads reçus, repasser avec un `maxResults` plus grand ou pager, ne jamais s'arrêter à la première page.
   - **Ne jamais juger un thread sur son `snippet`.** Un `snippet` vide ou tronqué ne veut pas dire "sans intérêt" — souvent le contenu est en pièce jointe ou le message est court. Récupérer les headers (`From`, `Subject`, `Date`) de CHAQUE thread de la fenêtre avant de filtrer, pas seulement de ceux dont le snippet a l'air prometteur.
   - **Croiser avec les Follow-Ups d'hier** : lire la section Follow-Ups de la veille (`calendar/YYYY-MM/YYYY-MM-DD.md`) et vérifier explicitement, pour chaque personne/organisme y figurant, si un mail d'elle est arrivé dans la fenêtre. Un follow-up ouvert qui reçoit une réponse est automatiquement actionnable, même si le snippet ne le signale pas.
   - **Croiser avec les tâches `doing`** : avant d'écarter un expéditeur comme "notif auto", vérifier s'il correspond à une tâche `status: doing` (déjà engagée, donc susceptible d'attendre une réponse externe — une tâche `todo` pas encore commencée n'attend rien). Grep rapide du nom de l'expéditeur/objet contre les tâches `doing` (sous-ensemble restreint, ~15-20 fichiers, coût quasi nul). Un mail automatique qui répond à une tâche `doing` est actionnable même s'il vient d'un expéditeur non-humain (`no-reply@`, notification système) — le critère n'est pas "qui envoie" mais "est-ce que ça débloque quelque chose". Décision et questions ouvertes non résolues : [[nettoyer-workflow-google-email-calendrier]].
   - Pour le reste (hors correspondance avec une tâche ouverte), vrais humains uniquement (ignorer notifs auto, newsletters) — mais un humain reste un humain même quand le snippet est vide.
   - Identifier les mails qui attendent une ACTION (réponse, décision, envoi de document), lus ou non.
   - Max 3 dans le message, mais le scan lui-même doit être exhaustif sur la fenêtre avant de couper à 3. Format : expéditeur + sujet + action attendue.
3. **Calendrier du jour** (via `gws calendar events list` / `gws calendar calendars get`, whitelistées dans `allowed-tools` ; sinon "Calendar : non connecté") : liste factuelle heure + titre + participants.
   - Syntaxe exacte : `gws calendar events list --params '{"calendarId":"primary","timeMin":"YYYY-MM-DDT00:00:00+08:00","timeMax":"YYYY-MM-DDT23:59:59+08:00","singleEvents":true,"orderBy":"startTime"}'` (adapter à la timezone de l'utilisateur, voir `system/preferences/user.md` ; l'exemple ci-dessus est en UTC+8). Pas de flag `--calendar` : tout passe dans `--params`, comme pour Gmail.
4. **Goals** — lire `knowledge/goals/*.md` (`status: active`), trier par `priority` croissant. **Toujours faire l'état des lieux des 3 premiers**, pas seulement de celui qui portera le focus : santé, phase courante, deadline si < 7 jours, 1-2 KPIs clés, pour chacun des 3. S'il y a moins de 3 goals actifs, tous y passent.
5. **Tâches** — lire `projects/tasks/*.md`, filtrer `status: todo|doing`, trier par priorité.
6. **Projets** — lire `projects/on/*.md` : état de chaque projet actif.
7. **Contenus** — lire `content/production/*.md` : à filmer aujourd'hui (`film_date`), à publier aujourd'hui (`publish_date`), et ceux figés au même `stage` depuis plus de 7 jours. Sauter la section si `content/production/` est vide.
8. **Inbox** — compter les items non traités dans `inbox/`.
9. **Prospection/CRM** — si un système de prospection existe dans le vault, intégrer son résumé (prospects actifs, relances overdue, contacts envoyés vs objectif). Sinon, sauter la section.

### Check de charge (avant le Medical Triage)

Compter les projets dans `projects/on/` + `projects/ongoing/` (budget commun, plafond 5, voir `_agent/templates/project.md`). Si le total > 5 : inclure un bloc "Charge projets" avec le total et les noms, et demander : "Tu as N projets actifs, au-dessus du plafond de 5. Lequel mets-tu en simmering avant de continuer ?" Si <= 5 : ne pas mentionner la charge.

Signaler aussi tout projet `on` dont la `target_date` est dépassée : un projet est le livrable de la semaine, une target_date dépassée est le signal de dérive.

### Medical Triage — choisir LA priorité

1. Deadline < 48h ? → c'est la priorité.
2. Sinon : quelle tâche a le plus d'impact sur le goal at-risk ou priorité 1 ?
3. Ne proposer qu'UNE seule tâche focus. Pas une liste.

### Écrire `proposals` et `plan`, avant d'envoyer le message Phase 1

L'app AIOS lit ces deux clés en lecture seule (section « Propositions du
rituel » et timeline du jour) : elles doivent être posées **avant** d'envoyer
le message ci-dessous, pas après la réponse de l'utilisateur. Voir « Contrat
d'écriture » plus bas pour le format exact.

- `proposals` : la tâche focus retenue par le Medical Triage, plus toute
  autre tâche repérée pendant le scan et qui mérite d'être signalée
  aujourd'hui (deadline proche, dépend d'un goal at-risk...) — chacune avec
  un `why` d'une ligne. Ce n'est pas encore un focus validé, juste ce que le
  rituel propose de considérer.
- `plan` : les événements du calendrier du jour, un `kind: meeting` par
  événement, `label` = titre de l'event. Ne rien inventer d'autre à ce
  stade : pas de bloc `focus` avant validation (l'utilisateur n'a pas encore
  répondu), pas de bloc `perso` sauf si l'utilisateur en a mentionné un
  explicitement dans une session précédente. Les trous entre les blocs ne
  s'écrivent jamais, l'app les déduit.

### Message Phase 1

```
Bonjour [prénom, depuis `system/preferences/user.md`] — [jour, date]

Hier
[1 ligne résumant la veille]

Emails actionnables
- [Expéditeur] — [Sujet] → [Action attendue]
[Ou : "Rien de prioritaire cette semaine" / "Gmail : non connecté"]

Aujourd'hui
- [Heure] — [Event] ([participants])
[Ou : "Pas d'events" / "Calendar : non connecté"]

Goals
- [Goal] — [santé] | [phase] | [deadline]
  [KPI clé : actuel / cible]

[Prospection / CRM — si applicable]

Ma recommandation
Goal focus : [nom]
Tâche focus : [LA tâche]
Pourquoi : [1 ligne]

Tu valides ce focus, ou tu veux ajuster ?
```

Attendre la réponse, puis enchaîner Phase 2 (ou si l'utilisateur demande la suite directement).

### Quand l'utilisateur valide (ou ajuste) le focus

1. Écrire `focus: '[[slug]]'` dans le frontmatter de la daily note — la tâche
   validée, ou celle vers laquelle l'utilisateur a réorienté s'il a ajusté.
2. Poser `due: <date du jour>` sur le fichier de **cette tâche**
   (`projects/tasks/<slug>.md`). Ne **jamais** toucher à son `status` : c'est
   l'app qui le fait passer à `doing` quand le travail démarre réellement,
   pas le rituel.
3. Si l'utilisateur ne valide rien de précis (silence, "on verra"), ne pas écrire
   `focus` : il reste `null`, et la tâche proposée continue à vivre dans
   `proposals` jusqu'à validation explicite.

## Phase 2 — Morning Journaling

### Message Phase 2

```
Morning Journaling

Take 2 minutes. Answer in 1 sentence each:

1. What's 1 thing you're grateful for today?
2. What's 1 thing you're excited about?
3. What's 1 virtue you want to exhibit today?
4. What's 1 thing you're avoiding right now?
5. What's THE 1 thing you need to do today?
```

(Les prompts de journaling restent en anglais, le reste en français.)

### Quand l'utilisateur répond

1. **Sauvegarder** dans `calendar/YYYY-MM/YYYY-MM-DD.md` :

```markdown
## Morning Journaling

- **Grateful**: [réponse]
- **Excited**: [réponse]
- **Virtue**: [réponse]
- **Avoiding**: [réponse]
- **THE 1 thing**: [réponse]
```

2. **Fear Setting check** : lire la section Fear Setting du goal actif. Si la réponse "avoiding" résonne avec une peur identifiée, répondre doucement : "Intéressant — tu avais identifié '[peur exacte]' dans ton Fear Setting. C'est peut-être lié ?" Ne pas insister. Juste nommer. Puis enchaîner Phase 3.

3. **Détection de patterns** : "avoiding" mentionne la même chose 3 jours consécutifs → le signaler franchement ; "THE 1 thing" diverge de la recommandation Phase 1 → noter la divergence.

## Phase 3 — Deep Work Prep

### Message Phase 3

```
Deep Work Prep

Ta mission : [tâche focus de Phase 1, ou ajustée si l'utilisateur a changé]

- Pense à cette SEULE tâche. Rien d'autre.
- Visualise-toi en train de la faire avec confiance.
  [1 détail de visualisation spécifique à la tâche]
- 1 minute de respiration. Inspire 4s — bloque 4s — expire 4s.
- Range ton téléphone. Ferme les tabs inutiles.
- Écris-moi quand tu commences.

Je te laisse tranquille jusqu'à ce que tu reviennes. Go.
```

### Après Phase 3

- Ne PAS relancer. Phase 3 est le dernier message du rituel.
- Si l'utilisateur écrit "je commence" → répondre brièvement : "Bon deep work. Je suis là quand tu as besoin."

## Contrat d'écriture (frontmatter lu par l'app AIOS)

L'app `aios-app` (panel ouvert en début de phase 1) lit ces clés en lecture
seule dans le frontmatter de la daily note du jour — c'est le seul format
qu'elle comprend, ne pas s'en écarter :

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

- `kind` ∈ `focus`, `meeting`, `proposal`, `perso`. `proposal` sert à un
  créneau explicitement réservé pour une tâche secondaire de `proposals`
  (rare en pratique — ne pas en inventer si l'utilisateur n'a rien dit).
- Les trous entre créneaux ne sont **jamais** stockés : l'app les déduit des
  `plan` fournis.
- Le corps de la daily note (sections `## Session Recap`, `## Decisions`,
  `## Follow-Ups`, `## Links`, `## Morning Journaling`) est **inchangé** par
  tout ce qui précède — ce contrat ne touche que le frontmatter.
- Les daily notes existantes sans ces clés restent valides : aucune clé n'est
  obligatoire côté lecture, `proposals`/`plan` vides ou absents affichent
  simplement un état vide dans l'app.

## Dette connue, pas de ce skill

`update-daily` (`.claude/skills/update-daily/SKILL.md`) crée/complète la
daily note du jour sans passer par `_agent/templates/daily.md` : les notes
qu'il produit seul n'ont pas de frontmatter. Le pas 0 de la Phase 1
ci-dessus (« Vérifier le frontmatter ») absorbe le cas quand le rituel tourne
après lui, mais le producteur lui-même n'est pas corrigé ici — hors
périmètre de ce ticket.

## Références internes

| Fichier | Ce qu'on extrait |
|---------|-----------------|
| `calendar/YYYY-MM/YYYY-MM-DD.md` (hier) | Résumé de la veille |
| `knowledge/goals/*.md` (active) | Santé, phase, KPIs, deadlines, Fear Setting |
| `projects/tasks/*.md` | Tâches todo/doing |
| `projects/on/*.md` | Projets actifs |
| `inbox/` | Items non traités |
| `knowledge/notes/*.md` (si une note de synthèse sur le goal setting existe) | Philosophie (Medical Triage). Optionnel : ne présuppose aucun nom de fichier. |

## Hard Rules

- Une phase à la fois, au rythme de la conversation.
- Une seule tâche focus, jamais une liste.
- Gmail/Calendar : vérifier la disponibilité des outils au runtime, pas d'échec si absents.
- Jamais de suppression sans confirmation explicite.
- `focus` ne s'écrit qu'après validation explicite de l'utilisateur — jamais en
  phase 1 avant sa réponse. `proposals`/`plan`, eux, s'écrivent avant sa
  réponse.
- La `due` posée sur la tâche focus au moment de la validation est la seule
  écriture que ce skill fait dans `projects/tasks/` ; ne jamais y toucher au
  `status`.
