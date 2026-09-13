import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readDailyViewData } from "./daily";

describe("Daily View Gateway", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-daily-"));
    fs.mkdirSync(path.join(vaultPath, "calendar", "2026-08"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "on"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  it("reads active projects, daily focus task, and today open tasks", () => {
    const today = new Date("2026-08-15");

    // Projet on
    fs.writeFileSync(
      path.join(vaultPath, "projects", "on", "pipeline.md"),
      `---\ntype: project\nname: Pipeline\ngoal: '[[agency]]'\nstatus: 'on'\npriority: high\nlast_activated: 2026-08-14\n---\n`,
    );

    // Tâches
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-focus.md"),
      `---\ntype: task\nname: Focus Task\nproject: '[[pipeline]]'\ngoal: '[[agency]]'\nstatus: doing\npriority: high\nautonomy: assist\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-today.md"),
      `---\ntype: task\nname: Today Task\nproject: '[[pipeline]]'\nstatus: todo\npriority: medium\ndue: 2026-08-15\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-blocked.md"),
      `---\ntype: task\nname: Blocked Task\nproject: '[[pipeline]]'\nstatus: todo\nblocked_by: ['[[other]]']\n---\n`,
    );

    // Daily note du jour avec focus
    fs.writeFileSync(
      path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"),
      `---\ntype: daily\nfocus: '[[task-focus]]'\n---\n\n## Session Recap\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    expect(data.hasDailyNote).toBe(true);
    expect(data.activeProjects).toHaveLength(1);
    expect(data.activeProjects[0].slug).toBe("pipeline");


    // Le focus n'est plus une section à part : il vit dans « tâches du jour »
    // et se reconnaît à son slug.
    expect(data.focusSlug).toBe("task-focus");

    // `task-focus` est `doing` sans `due`, donc elle appartient au bloc
    // « en retard et en cours », en tête parce qu'elle porte le focus.
    expect(data.lateAndDoingTasks[0]?.slug).toBe("task-focus");

    // Tâches du jour : `due` exactement aujourd'hui, rien d'autre.
    expect(data.todayTasks.map((t) => t.slug)).toEqual(["task-today"]);

    // La bloquée n'a ni `due` ni `doing` : elle ne remonte nulle part.
    const allShown = [...data.todayTasks, ...data.lateAndDoingTasks].map((t) => t.slug);
    expect(allShown).not.toContain("task-blocked");
  });

  it("surfaces a task that has no project, when it is due today", () => {
    const today = new Date("2026-08-15");

    // Cas réel du vault : une tâche rattachée à un goal, sans `project:`.
    // Elle n'apparaît dans les `openTasks` d'aucun projet.
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-orphan.md"),
      `---\ntype: task\nname: Orphan\ngoal: '[[admin]]'\nstatus: todo\ndue: 2026-08-15\n---\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    expect(data.todayTasks.map((t) => t.slug)).toEqual(["task-orphan"]);
  });

  it("never shows closed tasks, even when they are due today", () => {
    const today = new Date("2026-08-15");

    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-done.md"),
      `---\ntype: task\nname: Done\nstatus: done\ndue: 2026-08-15\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-dropped.md"),
      `---\ntype: task\nname: Dropped\nstatus: dropped\ndue: 2026-08-10\n---\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    expect(data.todayTasks).toEqual([]);
    expect(data.lateAndDoingTasks).toEqual([]);
  });

  it("shows today and late tasks even when no daily note exists", () => {
    const today = new Date("2026-08-15");

    fs.writeFileSync(
      path.join(vaultPath, "projects", "on", "pipeline.md"),
      `---\ntype: project\nname: Pipeline\nstatus: 'on'\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-today.md"),
      `---\ntype: task\nname: Today\nproject: '[[pipeline]]'\nstatus: todo\ndue: 2026-08-15\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-late.md"),
      `---\ntype: task\nname: Late\nproject: '[[pipeline]]'\nstatus: todo\ndue: 2026-08-10\n---\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    expect(data.hasDailyNote).toBe(false);
    expect(data.proposals).toEqual([]);
    expect(data.todayTasks.map((t) => t.slug)).toEqual(["task-today"]);
    expect(data.lateAndDoingTasks.map((t) => t.slug)).toEqual(["task-late"]);
  });

  it("reads ritual proposals, and drops those already scheduled for today", () => {
    const today = new Date("2026-08-15");

    fs.writeFileSync(
      path.join(vaultPath, "projects", "on", "pipeline.md"),
      `---\ntype: project\nname: Pipeline\nstatus: 'on'\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-proposed.md"),
      `---\ntype: task\nname: Proposed\nproject: '[[pipeline]]'\nstatus: todo\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-validated.md"),
      `---\ntype: task\nname: Validated\nproject: '[[pipeline]]'\nstatus: todo\ndue: 2026-08-15\n---\n`,
    );

    fs.writeFileSync(
      path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"),
      `---\ntype: daily\nproposals:\n  - task: '[[task-proposed]]'\n    why: "deadline dans 2 jours"\n  - task: '[[task-validated]]'\n    why: "déjà validée ce matin"\n  - task: '[[task-ghost]]'\n---\n\n## Session Recap\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    // La validée est sortie des propositions : elle est dans les tâches du jour.
    expect(data.proposals.map((p) => p.taskSlug)).toEqual(["task-proposed", "task-ghost"]);
    expect(data.proposals[0].why).toBe("deadline dans 2 jours");
    expect(data.proposals[0].task?.name).toBe("Proposed");
    // Un wikilink qui pointe dans le vide reste affichable, sans tâche résolue.
    expect(data.proposals[1].task).toBeNull();
    expect(data.proposals[1].why).toBeNull();
    expect(data.todayTasks.map((t) => t.slug)).toContain("task-validated");
  });

  it("handles missing daily note or missing focus gracefully with empty state indicator", () => {
    const today = new Date("2026-08-15");
    // Aucune daily note créée
    const data = readDailyViewData(vaultPath, today);

    expect(data.hasDailyNote).toBe(false);
    expect(data.focusSlug).toBeNull();
  });

  it("includes due and doing tasks from non-active projects (e.g., sleeping)", () => {
    const today = new Date("2026-08-15");
    fs.mkdirSync(path.join(vaultPath, "projects", "sleeping"), { recursive: true });

    fs.writeFileSync(
      path.join(vaultPath, "projects", "sleeping", "sommeil.md"),
      `---\ntype: project\nname: Projet Sommeil\nstatus: 'sleeping'\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-sleeping-due.md"),
      `---\ntype: task\nname: Tâche due\nproject: '[[sommeil]]'\nstatus: todo\ndue: 2026-08-15\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-sleeping-doing.md"),
      `---\ntype: task\nname: Tâche en cours\nproject: '[[sommeil]]'\nstatus: doing\n---\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-sleeping-ignored.md"),
      `---\ntype: task\nname: Tâche ignorée\nproject: '[[sommeil]]'\nstatus: todo\n---\n`,
    );

    const data = readDailyViewData(vaultPath, today);

    expect(data.todayTasks.map((t) => t.slug)).toContain("task-sleeping-due");
    expect(data.lateAndDoingTasks.map((t) => t.slug)).toContain("task-sleeping-doing");
    const allShown = [...data.todayTasks, ...data.lateAndDoingTasks].map((t) => t.slug);
    expect(allShown).not.toContain("task-sleeping-ignored");
  });
});
