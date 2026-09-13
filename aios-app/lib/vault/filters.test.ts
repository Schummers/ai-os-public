import { describe, expect, it } from "vitest";
import type { ProjectItem, TaskItem } from "./types";
import { filterProjectsAndTasks, parseFilterState, serializeFilterState, type FilterState } from "./filters";

describe("Global Filters Logic", () => {
  const dummyTask = (slug: string, overrides: Partial<TaskItem> = {}): TaskItem => ({
    slug,
    name: slug,
    project: "proj-1",
    goal: "goal-1",
    content: null,
    status: "todo",
    priority: "medium",
    assignee: "owner",
    autonomy: "assist",
    blockedBySlugs: [],
    isBlocked: false,
    created: "2026-08-15",
    due: "2026-08-15",
    ...overrides,
  });

  const dummyProject = (slug: string, overrides: Partial<ProjectItem> = {}): ProjectItem => ({
    slug,
    name: slug,
    goal: "goal-1",
    status: "on",
    priority: "high",
    responsible: "owner",
    created: "2026-08-15",
    lastActivated: "2026-08-14",
    targetDate: "2026-08-20",
    temporalSignal: { kind: "target_date", label: "J-5", isWarning: false },
    taskCounts: { doing: 1, todo: 1, done: 0, dropped: 0, totalOpen: 2, totalClosed: 0 },
    openTasks: [dummyTask("t1", { priority: "high", autonomy: "assist" }), dummyTask("t2", { priority: "low", autonomy: "ask" })],
    closedTasks: [],
    ...overrides,
  });

  it("parses and serializes filter state from/to URL query params", () => {
    const params = new URLSearchParams("status=on&priority=high&autonomy=assist&due=today&goal=agency");
    const state = parseFilterState(params);

    expect(state).toEqual({
      status: "on",
      priority: "high",
      autonomy: "assist",
      due: "today",
      goal: "agency",
    });

    const serialized = serializeFilterState(state);
    expect(serialized.get("status")).toBe("on");
    expect(serialized.get("priority")).toBe("high");
    expect(serialized.get("autonomy")).toBe("assist");
    expect(serialized.get("due")).toBe("today");
    expect(serialized.get("goal")).toBe("agency");
  });

  it("filters projects and tasks by autonomy=assist", () => {
    const p1 = dummyProject("p1");
    const filter: FilterState = { autonomy: "assist" };

    const result = filterProjectsAndTasks([p1], filter, new Date("2026-08-15"));

    expect(result).toHaveLength(1);
    expect(result[0].openTasks).toHaveLength(1);
    expect(result[0].openTasks[0].slug).toBe("t1");
  });

  it("filters projects by status and priority", () => {
    const pOnHigh = dummyProject("p-on-high", { status: "on", priority: "high", openTasks: [dummyTask("t1", { priority: "high" })] });
    const pOnLow = dummyProject("p-on-low", { status: "on", priority: "low", openTasks: [dummyTask("t2", { priority: "low" })] });
    const pSleepHigh = dummyProject("p-sleep-high", { status: "sleeping", priority: "high", openTasks: [dummyTask("t3", { priority: "high" })] });

    const filter: FilterState = { status: "on", priority: "high" };

    const result = filterProjectsAndTasks([pOnHigh, pOnLow, pSleepHigh], filter, new Date("2026-08-15"));

    expect(result.map((p) => p.slug)).toEqual(["p-on-high"]);
  });

  it("filters tasks by due=today or overdue", () => {
    const today = new Date("2026-08-15");
    const p = dummyProject("p", {
      openTasks: [
        dummyTask("t-today", { due: "2026-08-15" }),
        dummyTask("t-future", { due: "2026-08-25" }),
        dummyTask("t-overdue", { due: "2026-08-10" }),
      ],
    });

    const resToday = filterProjectsAndTasks([p], { due: "today" }, today);
    expect(resToday[0].openTasks.map((t) => t.slug)).toEqual(["t-today"]);

    const resOverdue = filterProjectsAndTasks([p], { due: "overdue" }, today);
    expect(resOverdue[0].openTasks.map((t) => t.slug)).toEqual(["t-overdue"]);
  });

  it("filters tasks by due=week (J+0 to J+6)", () => {
    const today = new Date("2026-08-15T12:00:00Z");
    const p = dummyProject("p", {
      openTasks: [
        dummyTask("t-today", { due: "2026-08-15" }),
        dummyTask("t-j6", { due: "2026-08-21" }),
        dummyTask("t-j7", { due: "2026-08-22" }),
      ],
    });

    const resWeek = filterProjectsAndTasks([p], { due: "week" }, today);
    expect(resWeek[0].openTasks.map((t) => t.slug)).toEqual(["t-today", "t-j6"]);
  });

  it("recalculates taskCounts based on active filters", () => {
    const p = dummyProject("p-counts", {
      status: "on",
      taskCounts: { doing: 1, todo: 2, done: 0, dropped: 0, totalOpen: 3, totalClosed: 0 },
      openTasks: [
        dummyTask("t1", { status: "doing", priority: "high" }),
        dummyTask("t2", { status: "todo", priority: "high" }),
        dummyTask("t3", { status: "todo", priority: "low" }),
      ],
    });

    const filter: FilterState = { priority: "high" };
    const result = filterProjectsAndTasks([p], filter, new Date("2026-08-15"));

    expect(result).toHaveLength(1);
    expect(result[0].openTasks).toHaveLength(2);
    // Le compteur est recalculé : 1 doing, 1 todo
    expect(result[0].taskCounts.doing).toBe(1);
    expect(result[0].taskCounts.todo).toBe(1);
    expect(result[0].taskCounts.totalOpen).toBe(2);
  });

  it("computes today correctly using the local timezone (e.g. UTC+8)", () => {
    const originalTZ = process.env.TZ;
    process.env.TZ = "Asia/Makassar"; // UTC+8

    // 2026-08-15T17:00:00.000Z is 2026-08-16 01:00:00 AM locally in UTC+8
    const localMidnight = new Date("2026-08-15T17:00:00.000Z");

    const p = dummyProject("p-tz", {
      openTasks: [
        dummyTask("t-local-today", { due: "2026-08-16" }),
        dummyTask("t-local-yesterday", { due: "2026-08-15" }),
      ],
    });

    const resToday = filterProjectsAndTasks([p], { due: "today" }, localMidnight);
    expect(resToday[0].openTasks.map(t => t.slug)).toEqual(["t-local-today"]);

    const resOverdue = filterProjectsAndTasks([p], { due: "overdue" }, localMidnight);
    expect(resOverdue[0].openTasks.map(t => t.slug)).toEqual(["t-local-yesterday"]);

    process.env.TZ = originalTZ;
  });
});
