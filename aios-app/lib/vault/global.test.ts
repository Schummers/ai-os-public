import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readGlobalViewData } from "./global";

describe("readGlobalViewData (Vault Gateway)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-global-"));
    fs.mkdirSync(path.join(vaultPath, "knowledge", "goals"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "on"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "ongoing"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "simmering"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "sleeping"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  function writeGoal(slug: string, frontmatter: string) {
    fs.writeFileSync(
      path.join(vaultPath, "knowledge", "goals", `${slug}.md`),
      `---\n${frontmatter}\n---\n\n# Goal\n`,
    );
  }

  function writeProject(status: "on" | "ongoing" | "simmering" | "sleeping", slug: string, frontmatter: string) {
    fs.writeFileSync(
      path.join(vaultPath, "projects", status, `${slug}.md`),
      `---\n${frontmatter}\n---\n\n# Project\n## Tâches liées\n- [[wrong-body-task]]\n`,
    );
  }

  function writeTask(slug: string, frontmatter: string) {
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", `${slug}.md`),
      `---\n${frontmatter}\n---\n\n# Task\n`,
    );
  }

  it("reads goals with computed active projects count and open tasks count", () => {
    writeGoal("agency", "type: goal\nname: Agency Job\nhealth: on_track\nstatus: active");
    writeGoal("patrimoine", "type: goal\nname: Gestion Patrimoine\nhealth: at_risk\nstatus: active");

    writeProject("on", "pipeline", "type: project\nname: Pipeline\ngoal: '[[agency]]'\nstatus: 'on'");
    writeProject("simmering", "immo", "type: project\nname: Immo\ngoal: '[[patrimoine]]'\nstatus: 'simmering'");

    writeTask("t1", "type: task\nname: Tâche 1\nproject: '[[pipeline]]'\ngoal: '[[agency]]'\nstatus: doing");
    writeTask("t2", "type: task\nname: Tâche 2\nproject: '[[pipeline]]'\ngoal: '[[agency]]'\nstatus: todo");
    writeTask("t3", "type: task\nname: Tâche 3\nproject: '[[pipeline]]'\ngoal: '[[agency]]'\nstatus: done");
    writeTask("t4", "type: task\nname: Tâche 4\nproject: '[[immo]]'\ngoal: '[[patrimoine]]'\nstatus: todo");

    const data = readGlobalViewData(vaultPath, new Date("2026-08-15"));

    expect(data.goals).toHaveLength(2);
    const agencyGoal = data.goals.find((g) => g.slug === "agency");
    expect(agencyGoal).toMatchObject({
      name: "Agency Job",
      health: "on_track",
      activeProjectsCount: 1,
      openTasksCount: 2,
    });

    const patrimoineGoal = data.goals.find((g) => g.slug === "patrimoine");
    expect(patrimoineGoal).toMatchObject({
      name: "Gestion Patrimoine",
      activeProjectsCount: 0, // car simmering, pas on
      openTasksCount: 1,
    });
  });

  it("groups projects by status in canonical order (on, ongoing, simmering, sleeping)", () => {
    writeProject("sleeping", "proj-sleep", "type: project\nname: Sleep\nstatus: 'sleeping'");
    writeProject("on", "proj-on", "type: project\nname: On\nstatus: 'on'");
    writeProject("simmering", "proj-sim", "type: project\nname: Simmer\nstatus: 'simmering'");
    writeProject("ongoing", "proj-ong", "type: project\nname: Ongoing\nstatus: 'ongoing'");

    const data = readGlobalViewData(vaultPath, new Date("2026-08-15"));

    expect(data.groups.map((g) => g.status)).toEqual(["on", "ongoing", "simmering", "sleeping"]);
    expect(data.groups[0].projects[0].slug).toBe("proj-on");
    expect(data.groups[1].projects[0].slug).toBe("proj-ong");
    expect(data.groups[2].projects[0].slug).toBe("proj-sim");
    expect(data.groups[3].projects[0].slug).toBe("proj-sleep");
  });

  it("attaches tasks via task frontmatter and computes task counts", () => {
    writeProject("on", "pipeline", "type: project\nname: Pipeline\nstatus: 'on'");
    writeTask("task-doing", "type: task\nname: En cours\nproject: '[[pipeline]]'\nstatus: doing\npriority: high");
    writeTask("task-todo", "type: task\nname: À faire\nproject: '[[pipeline]]'\nstatus: todo\npriority: medium");
    writeTask("task-done", "type: task\nname: Fait\nproject: '[[pipeline]]'\nstatus: done");
    writeTask("task-dropped", "type: task\nname: Abandonné\nproject: '[[pipeline]]'\nstatus: dropped");
    // Tâche orpheline (ne doit pas être rattachée)
    writeTask("task-other", "type: task\nname: Autre\nproject: '[[autre-projet]]'\nstatus: todo");

    const data = readGlobalViewData(vaultPath, new Date("2026-08-15"));
    const pipeline = data.groups[0].projects[0];

    expect(pipeline.taskCounts).toEqual({
      doing: 1,
      todo: 1,
      done: 1,
      dropped: 1,
      totalOpen: 2,
      totalClosed: 2,
    });
    expect(pipeline.openTasks).toHaveLength(2);
    expect(pipeline.closedTasks).toHaveLength(2);
  });

  it("places blocked tasks at the end of open tasks with blocking info", () => {
    writeProject("on", "pipeline", "type: project\nname: Pipeline\nstatus: 'on'");
    writeTask("unblocked-1", "type: task\nname: Normale 1\nproject: '[[pipeline]]'\nstatus: todo");
    writeTask("blocker", "type: task\nname: Tâche bloquante\nproject: '[[pipeline]]'\nstatus: doing");
    writeTask("blocked-task", "type: task\nname: Bloquée\nproject: '[[pipeline]]'\nstatus: todo\nblocked_by: ['[[blocker]]']");
    writeTask("unblocked-2", "type: task\nname: Normale 2\nproject: '[[pipeline]]'\nstatus: doing");

    const data = readGlobalViewData(vaultPath, new Date("2026-08-15"));
    const pipeline = data.groups[0].projects[0];

    const openSlugs = pipeline.openTasks.map((t) => t.slug);
    // Les tâches non bloquées viennent d'abord, la bloquée en dernier
    expect(openSlugs[openSlugs.length - 1]).toBe("blocked-task");
    const blocked = pipeline.openTasks.find((t) => t.slug === "blocked-task");
    expect(blocked?.isBlocked).toBe(true);
    expect(blocked?.blockedBySlugs).toEqual(["blocker"]);
  });

  it("computes temporal signal: target_date overdue prioritizes over inactivity", () => {
    const today = new Date("2026-08-15");
    // Projet avec target_date dépassée
    writeProject(
      "on",
      "p-overdue",
      "type: project\nname: Overdue\nstatus: 'on'\ntarget_date: 2026-08-10\nlast_activated: 2026-08-14",
    );
    // Projet sans target_date mais avec last_activated inactif depuis 21 jours
    writeProject(
      "on",
      "p-inactive",
      "type: project\nname: Inactive\nstatus: 'on'\nlast_activated: 2026-07-25",
    );
    // Projet avec target_date future
    writeProject(
      "on",
      "p-future",
      "type: project\nname: Future\nstatus: 'on'\ntarget_date: 2026-08-18",
    );

    const data = readGlobalViewData(vaultPath, today);
    const onProjects = data.groups[0].projects;

    const pOverdue = onProjects.find((p) => p.slug === "p-overdue")!;
    expect(pOverdue.temporalSignal.kind).toBe("target_date_overdue");
    expect(pOverdue.temporalSignal.isWarning).toBe(true);

    const pInactive = onProjects.find((p) => p.slug === "p-inactive")!;
    expect(pInactive.temporalSignal.kind).toBe("inactivity");
    expect(pInactive.temporalSignal.days).toBe(21);
    expect(pInactive.temporalSignal.isWarning).toBe(true);

    const pFuture = onProjects.find((p) => p.slug === "p-future")!;
    expect(pFuture.temporalSignal.kind).toBe("target_date");
    expect(pFuture.temporalSignal.days).toBe(3);
    expect(pFuture.temporalSignal.isWarning).toBe(false);
  });
});
