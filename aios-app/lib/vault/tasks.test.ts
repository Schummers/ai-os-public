import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readTask, updateTaskFrontmatter } from "./tasks";

describe("Task Vault Gateway (Writing & Concurrency)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-tasks-"));
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  const SAMPLE_BODY = `\n# Nom Lisible De La Tâche\n\n## Contexte\nUn contexte riche avec des listes :\n- Point A\n- Point B\n\n## Critères de succès\n- [ ] Critère 1\n\n## Journal\n- 2026-08-15 : Début du travail.\n`;

  function createTaskFile(slug: string, frontmatter: string, body: string = SAMPLE_BODY) {
    const raw = `---\n${frontmatter}\n---${body}`;
    fs.writeFileSync(path.join(vaultPath, "projects", "tasks", `${slug}.md`), raw, "utf-8");
    return raw;
  }

  it("preserves the markdown body byte-for-byte after frontmatter update", () => {
    const initialFm = "type: task\nname: Ma Tâche\nproject: '[[pipeline]]'\nstatus: todo\npriority: medium\nautonomy: assist\ncreated: 2026-08-15";
    createTaskFile("my-task", initialFm, SAMPLE_BODY);

    const result = updateTaskFrontmatter(vaultPath, "my-task", {
      status: "doing",
    });

    expect(result.success).toBe(true);

    const updatedRaw = fs.readFileSync(path.join(vaultPath, "projects", "tasks", "my-task.md"), "utf-8");
    const parts = updatedRaw.split("---");
    // parts[0] est vide avant le premier ---, parts[1] est le frontmatter, parts[2] et suivants sont le body
    const updatedBody = updatedRaw.slice(updatedRaw.indexOf("---", 3) + 3);

    expect(updatedBody).toBe(SAMPLE_BODY);
  });

  it("updates all 4 allowed fields (status, priority, due, autonomy) while preserving other frontmatter keys and their order", () => {
    const initialFm = `type: task
name: Ma Tâche
project: '[[pipeline]]'
goal: '[[agency]]'
status: todo
priority: medium
assignee: owner
autonomy: assist
blocked_by: ['[[other]]']
created: 2026-08-15
due: 2026-08-20`;

    createTaskFile("my-task", initialFm);

    const result = updateTaskFrontmatter(vaultPath, "my-task", {
      status: "done",
      priority: "high",
      due: "2026-08-25",
      autonomy: "ask",
    });

    expect(result.success).toBe(true);

    const updatedTask = readTask(vaultPath, "my-task");
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe("done");
    expect(updatedTask?.priority).toBe("high");
    expect(updatedTask?.due).toBe("2026-08-25");
    expect(updatedTask?.autonomy).toBe("ask");
    expect(updatedTask?.name).toBe("Ma Tâche");
    expect(updatedTask?.project).toBe("pipeline");
    expect(updatedTask?.goal).toBe("agency");
    expect(updatedTask?.assignee).toBe("owner");
    expect(updatedTask?.created).toBe("2026-08-15");
  });

  it("rejects invalid enum values for status, priority, and autonomy", () => {
    const initialFm = "type: task\nname: Tâche Test\nstatus: todo\npriority: low";
    createTaskFile("enum-test", initialFm);

    // @ts-expect-error invalid status test
    const resStatus = updateTaskFrontmatter(vaultPath, "enum-test", { status: "invalid_status" });
    expect(resStatus.success).toBe(false);
    expect(resStatus.error).toMatch(/invalid status/i);

    // @ts-expect-error invalid priority test
    const resPri = updateTaskFrontmatter(vaultPath, "enum-test", { priority: "ultra_high" });
    expect(resPri.success).toBe(false);
    expect(resPri.error).toMatch(/invalid priority/i);

    // @ts-expect-error invalid autonomy test
    const resAuto = updateTaskFrontmatter(vaultPath, "enum-test", { autonomy: "automatic" });
    expect(resAuto.success).toBe(false);
    expect(resAuto.error).toMatch(/invalid autonomy/i);
  });

  it("detects concurrent modification and aborts write without touching disk", () => {
    const initialFm = "type: task\nname: Tâche Concurrente\nstatus: todo\npriority: medium";
    createTaskFile("concurrent-task", initialFm);

    // Récupérer l'état initial avec son hash/version
    const initialTask = readTask(vaultPath, "concurrent-task")!;
    const expectedHash = initialTask.fileHash;

    // Simuler une écriture concurrente par un agent externe (ex: Obsidian ou agent CLI)
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "concurrent-task.md"),
      `---\ntype: task\nname: Tâche Concurrente Modifiée\nstatus: doing\npriority: high\n---${SAMPLE_BODY}`,
    );

    // Tentative d'écriture avec l'ancien expectedHash
    const result = updateTaskFrontmatter(vaultPath, "concurrent-task", { status: "done" }, expectedHash);

    expect(result.success).toBe(false);
    expect(result.conflict).toBe(true);
    expect(result.freshData?.status).toBe("doing");
    expect(result.freshData?.name).toBe("Tâche Concurrente Modifiée");

    // Vérifier que le fichier sur disque n'a pas été écrasé
    const diskContent = fs.readFileSync(path.join(vaultPath, "projects", "tasks", "concurrent-task.md"), "utf-8");
    expect(diskContent).toContain("status: doing");
    expect(diskContent).not.toContain("status: done");
  });
});
