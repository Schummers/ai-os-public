---
name: create-goal
description: Coaching GPS (Goal-Plan-System) pour créer, tracker et reviewer les goals du second brain — méthode Ali Abdaal enrichie Rumelt, Ferriss, EBM, Hormozi.
disable-model-invocation: true
---

# Create Goal — GPS (Goal, Plan, System)

Skill de coaching stratégique basé sur la méthode GPS d'Ali Abdaal, enrichi par le Kernel de Rumelt, l'Evidence-Based Management (Scrum.org), le Fear Setting de Tim Ferriss, et la Règle de Concentration d'Hormozi.

## Base Théorique

La méthode est décrite en entier dans ce skill : **aucune note du vault n'est requise** pour s'en servir.

Si l'utilisateur a indexé ses propres sources sur le goal setting dans
`knowledge/sources/`, ou écrit une note de synthèse personnelle dans
`knowledge/notes/`, appuie-toi dessus en priorité quand tu expliques un concept :
sa formulation à lui prime toujours sur la théorie générique. Cherche-les au
moment d'en avoir besoin, ne présuppose aucun nom de fichier, et n'annonce jamais
une note que tu n'as pas ouverte.

## Principes Directeurs

1. **Conversationnel** : dialogue comme un coach, pas un formulaire. Ne JAMAIS présenter un template vide — toujours guider par les questions.
2. **Théorique** : explique POURQUOI chaque question est posée en référençant la méthode.
3. **Cycle trimestriel** : les goals fonctionnent sur des cycles de 3 mois. Signale les dates et propose des target_date alignées.
4. **Intégré** : chaque opération met à jour le vault et les fichiers liés.

## Schéma du fichier goal

Le schéma canonique (frontmatter + structure G/P/S du corps) vit dans `_agent/templates/goal.md` — source unique de vérité, ne pas le reproduire de mémoire.

## Opérations

### Op 1 — Créer un Goal (coaching GPS)

Approche : coaching conversationnel, phase par phase.

**Phase G — GOAL**
1. **Le Quoi** — objectif spécifique et quantifiable. Si vague : "Ali Abdaal insiste sur la spécificité — 'lancer un business' est un souhait, pas un goal. À quoi ressemble le succès en chiffres ? Revenu ? Clients ? Timeline ?" Pousser pour un nombre.
2. **Le Pourquoi** — motivation intrinsèque. Si extrinsèque (argent, statut, "je devrais") : "La recherche montre que les goals motivés extrinsèquement ont moins de chances d'aboutir ET rendent le processus moins agréable. Qu'est-ce qui te motive INTRINSÈQUEMENT ici ?" Excitement Map : "Réaction physique quand tu y penses ?"
3. **Anti-Goals** — "Qu'est-ce que tu REFUSES de sacrifier en route ? Weekends ? Santé ? Temps famille ? C'est le garde-fou contre le succès autodestructeur."
4. **Priorité** — rang numérique, une seule priorité 1. Hormozi : "chaque projet parallèle coûte 20 % d'efficacité. Quelle priorité par rapport à tes autres goals ?"

**Phase P — PLAN**
5. **Diagnostic (Rumelt)** — "En UNE phrase : quel est l'obstacle critique qui t'empêche d'atteindre ce goal AUJOURD'HUI ?"
6. **3-5 Major Moves** — "Les mouvements STRATÉGIQUES, pas 20 tâches."
7. **Test de Réalisme** — "Sur 100 : ce plan fonctionne EN THÉORIE ? Et EN PRATIQUE, tu le suivras vraiment ?" L'un des deux < 80 → simplifier.
8. **Crystal Ball** — "Oettingen a montré que visualiser l'échec AUGMENTE les chances de succès. Dans 3 mois tu n'as PAS atteint ce goal : les 3 raisons principales ?" Pour chacune : mitigation dès maintenant.

**Phase S — SYSTEM**
9. **Tracking** — "Une méta-analyse de 138 études montre que le suivi augmente drastiquement les chances de succès. Quels KPIs, à quelle fréquence ?"
10. **Reminders** — "Écrire ses goals augmente de 42 % les chances de les atteindre. Comment vas-tu te rappeler de ce goal quotidiennement ?"
11. **Accountability** — "Qui va te tenir accountable ? Un buddy, un groupe, l'agent en review hebdo ?"

**Finalisation**
12. Créer le fichier dans `knowledge/goals/<slug-kebab-case>.md` selon le schéma canonique, rempli avec tout ce qui a été récolté.
13. **Backlog** — demander où vit le réservoir non priorisé de ce goal et renseigner le champ `backlog:`. Règle : le backlog vit là où vit le travail (note du vault `<slug>-backlog.md` par défaut, chemin externe si le goal a son propre repo), jamais aux deux endroits. Rien n'en descend vers une tâche avant la semaine où c'est engagé : c'est ce qui garde le goal court et évite les tâches fantômes.
14. Mettre à jour `index.md` (section Goals) et `_agent/hot.md`.
15. Signaler le cycle : "Ce goal s'inscrit dans le trimestre en cours. Target date suggérée : fin de trimestre."
16. **Prompt de deep research** — toujours terminer par là. Rédiger un prompt de recherche approfondie que l'utilisateur lancera lui-même (ne jamais le lancer automatiquement), destiné à attaquer le goal avec des données que le coaching socratique ne peut pas produire : tailles de marché, taux de conversion comparables, échecs documentés de projets similaires, benchmarks de pricing et de délai.
    - **Thèse à réfuter, pas question ouverte.** Le prompt énonce la stratégie retenue comme une hypothèse falsifiable et demande explicitement les preuves du contraire. « Voici le plan, cherche pourquoi il échoue » et non « que penses-tu de ce marché ».
    - Inclure les chiffres réels du goal (cible, prix, délai, canal, marché) : c'est ce qui rend la recherche attaquable.
    - Demander des sources datées et des ordres de grandeur chiffrés, pas des généralités.
    - Demander explicitement de nommer les hypothèses non testées et les angles morts, plus les cas comparables qui ont échoué.
    - Le livrer dans un bloc de code, prêt à copier.
    - Au retour de la recherche, Op 5 (Challenge & Research) intègre les découvertes dans les Major Moves et la Crystal Ball.

### Op 2 — Tracker le Progrès

1. Identifier le goal (nommé par l'utilisateur, ou via le champ `goal:` d'un projet/tâche terminé).
2. Lire les données liées : le goal, les projets (`projects/on|ongoing|simmering|sleeping/` avec `goal:` correspondant), les tâches (`projects/tasks/`).
3. Calculer : tâches done/total, distribution des statuts projets, Major Moves ayant progressé, KPIs actuel vs objectif.
4. Mettre à jour les KPIs si l'utilisateur fournit des données (table Tracking du goal).
5. Évaluer le health : tout progresse → `on-track` ; KPIs en retard ou tâches gelées → `at-risk` ; blocage majeur → `blocked`.
6. Mettre à jour le fichier goal : `health`, `last_reviewed`, entrée datée au Review Log.

### Op 3 — Review des Goals

**Hebdomadaire (conversationnel)**
1. Lire tous les goals `status: active` de `knowledge/goals/`.
2. Pour chacun : Op 2 en silence, puis résumé concis (health, KPIs, Major Moves). **EBM Experiment Loop** : "Les Major Moves produisent-ils les résultats attendus ? Si non, faut-il adapter le plan ?" Comparer `last_reviewed` à `review_cadence` — flagger les reviews en retard. Blockers → next steps concrets.
3. Check de priorisation : les rangs sont-ils encore corrects ? Dispersion excessive (règle Hormozi) ?
4. Enregistrer : `last_reviewed` + `health` + Review Log de chaque goal, et le recap hebdo via le skill du vault `weekly-review` (réutiliser, ne pas réimplémenter).

**Trimestrielle**
1. Audit GPS complet par goal actif : G (le Quoi a-t-il changé ? le Pourquoi tient-il ?), P (Major Moves pertinents ? scores à refaire ?), S (le système tourne-t-il ? KPIs trackés ? accountability en place ?).
2. Décisions de cycle de vie : `achieved` → célébrer + archiver ; `on-track` → continuer ; `at-risk` → diagnostiquer et adapter ; `blocked` → débloquer ou passer `inactive`. Nouveaux goals du trimestre ?
3. Note trimestrielle dans `calendar/`.

### Op 4 — Fear Setting (exercice guidé, Tim Ferriss)

1. Contexte : quel goal, projet ou décision ?
2. **Define** — "Le PIRE scénario si tu poursuis agressivement ?" 3-5 cas concrets, pas de peurs vagues.
3. **Prevent** — pour chacun : "Comment RÉDUIRE la probabilité ?"
4. **Repair** — pour chacun : "Si ça arrive quand même : minimiser l'impact, qui appeler, que faire ?"
5. **Coût de l'Inaction** — "Où seras-tu dans 6 MOIS si tu ne fais rien ? Dans 3 ANS ? Ce coût est-il acceptable ?"
6. Score : probabilité __/10 × impact __/10 vs gain potentiel.
7. Nourrir la Crystal Ball du goal lié ; nouvelles mitigations → Major Moves.
8. Enregistrer l'exercice complet dans `knowledge/notes/fear-setting-<goal>-<date>.md`.

### Op 5 — Challenge & Research

Deux modes complémentaires dans une même conversation :

**Mode Research** : WebSearch sur études, cas comparables, best practices ; benchmark du plan (timelines typiques, taux de succès, pièges) ; présenter où le plan s'aligne et où il diverge — intentionnel ou angle mort ?

**Mode Coaching Socratique** :
- Challenge G : "Ton 'Quoi' est-il vraiment spécifique ?" "Ton 'Pourquoi' — c'est le TIEN, ou celui que tu penses devoir avoir ?"
- Challenge P : "Pourquoi CES Major Moves et pas d'autres ?" "Ton score pratique — honnête ? Qu'est-ce qui t'a empêché de le faire par le passé ?" "Ta Crystal Ball — tes VRAIES peurs ou les peurs 'acceptables' ?"
- Challenge S : "Ton tracking — tu vas VRAIMENT le maintenir ? Qu'est-ce qui t'a fait abandonner les systèmes similaires avant ?" "Ton buddy va te challenger ou juste acquiescer ?"
- Relance : réponse vague → pousser au spécifique ; conformiste → pousser à l'honnêteté ; rationalisation → la nommer respectueusement.
- Intégrer : les découvertes mettent à jour le fichier goal (Major Moves, Crystal Ball, System).

## Hard Rules

- Jamais de template vide : toujours le coaching conversationnel.
- Une seule priorité 1 parmi les goals actifs.
- Changer `status`/`priority` d'un goal = décision de l'utilisateur, jamais du skill seul.
- Jamais de suppression sans confirmation explicite.
- Wikilinks Obsidian pour tout lien interne.
