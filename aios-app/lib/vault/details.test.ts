import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readProjectDetail, readTaskDetail } from "./details";

describe("Project & Task Detail Gateway", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-details-"));
    fs.mkdirSync(path.join(vaultPath, "knowledge", "goals"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "on"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "knowledge", "notes"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  it("reads complete project detail including parsed markdown sections and linked tasks", () => {
    const projectContent = `---
type: project
name: Pipeline Candidatures
goal: '[[agency]]'
status: 'on'
priority: high
created: 2026-08-01
last_activated: 2026-08-14
target_date: 2026-09-15
---

# Pipeline Candidatures

## Objectif
Trouver un poste de Lead Engineer d'ici fin septembre.

## Notes liées
- [[note-recrutement]]
- [[note-morte-introuvable]]

## Journal
- 2026-08-14 : Premier call avec le recruteur.
`;
    fs.writeFileSync(path.join(vaultPath, "projects", "on", "pipeline.md"), projectContent, "utf-8");
    fs.writeFileSync(path.join(vaultPath, "knowledge", "notes", "note-recrutement.md"), "# Note Recrutement\n", "utf-8");

    // Créer 2 tâches pour ce projet
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-1.md"),
      `---\ntype: task\nname: Rédiger CV\nproject: '[[pipeline]]'\nstatus: doing\npriority: high\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-2.md"),
      `---\ntype: task\nname: Candidater\nproject: '[[pipeline]]'\nstatus: done\n---\n`,
    );

    const project = readProjectDetail(vaultPath, "pipeline");

    expect(project).not.toBeNull();
    expect(project?.slug).toBe("pipeline");
    expect(project?.name).toBe("Pipeline Candidatures");
    expect(project?.goal).toBe("agency");
    expect(project?.status).toBe("on");
    expect(project?.priority).toBe("high");
    expect(project?.targetDate).toBe("2026-09-15");
    expect(project?.sections.objectif).toContain("Trouver un poste");
    expect(project?.sections.journal).toContain("2026-08-14");
    expect(project?.openTasks).toHaveLength(1);
    expect(project?.closedTasks).toHaveLength(1);
    expect(project?.filePath).toContain("projects/on/pipeline.md");

    // Vérifier la détection des liens morts
    const linkedNotes = project?.linkedWikilinks || [];
    const validLink = linkedNotes.find((l) => l.slug === "note-recrutement");
    const deadLink = linkedNotes.find((l) => l.slug === "note-morte-introuvable");
    expect(validLink?.exists).toBe(true);
    expect(deadLink?.exists).toBe(false);
  });

  it("reads complete task detail including sections and editable fields", () => {
    const taskContent = `---
type: task
name: Retravailler le positionnement
project: '[[pipeline]]'
goal: '[[agency]]'
status: doing
priority: high
assignee: owner
autonomy: assist
created: 2026-08-15
due: 2026-08-15
---

# Retravailler le positionnement

## Contexte
Clarifier la proposition de valeur sur les rôles Lead Engineer.

## Solution proposée
Rédiger 3 bullet points d'impact.

## Critères de succès
- [ ] 1 phrase d'accroche rédigée
- [ ] 3 réalisations clés chiffrées

## Journal
- 2026-08-15 : Démarrage du travail.
`;
    fs.writeFileSync(path.join(vaultPath, "projects", "tasks", "positionnement.md"), taskContent, "utf-8");

    const task = readTaskDetail(vaultPath, "positionnement");

    expect(task).not.toBeNull();
    expect(task?.name).toBe("Retravailler le positionnement");
    expect(task?.project).toBe("pipeline");
    expect(task?.status).toBe("doing");
    expect(task?.priority).toBe("high");
    expect(task?.autonomy).toBe("assist");
    expect(task?.sections.contexte).toContain("Clarifier la proposition");
    expect(task?.sections.solution).toContain("Rédiger 3 bullet points");
    expect(task?.sections.criteres).toContain("phrase d'accroche");
    expect(task?.sections.journal).toContain("Démarrage du travail");
    expect(task?.filePath).toContain("projects/tasks/positionnement.md");
  });

  it("extracts wikilinks with accents and resolves existence in new directories", () => {
    fs.mkdirSync(path.join(vaultPath, "content", "idea"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "knowledge", "sources"), { recursive: true });

    // Créer des cibles
    fs.writeFileSync(path.join(vaultPath, "content", "idea", "idée-vidéo.md"), "# Idée\n", "utf-8");
    fs.writeFileSync(path.join(vaultPath, "knowledge", "sources", "source-référence.md"), "# Source\n", "utf-8");

    // Créer une tâche avec des liens
    const taskContent = `---
type: task
---
## Contexte
Voir [[idée-vidéo]] et [[source-référence|Alias test]] et [[lien-cassé]].
Et un autre : [[ça-marche-aussi-avec-des-cédilles]].
`;
    fs.writeFileSync(path.join(vaultPath, "projects", "tasks", "test-links.md"), taskContent, "utf-8");

    const task = readTaskDetail(vaultPath, "test-links");

    expect(task).not.toBeNull();
    const links = task?.linkedWikilinks || [];
    
    const idee = links.find(l => l.slug === "idée-vidéo");
    const source = links.find(l => l.slug === "source-référence");
    const broken = links.find(l => l.slug === "lien-cassé");
    const cedille = links.find(l => l.slug === "ça-marche-aussi-avec-des-cédilles");

    expect(idee?.exists).toBe(true);
    expect(source?.exists).toBe(true);
    expect(broken?.exists).toBe(false);
    expect(cedille?.exists).toBe(false);
  });
});
