import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { computeDayPlanSchedule, readDayPlan } from "./dayplan";
import type { TaskItem } from "./types";

describe("Day Plan & Gaps Calculation (Vault Gateway)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-dayplan-"));
    fs.mkdirSync(path.join(vaultPath, "calendar", "2026-08"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  const dummyTask = (slug: string, name: string): TaskItem => ({
    slug,
    name,
    project: "proj",
    goal: null,
    content: null,
    status: "todo",
    priority: "high",
    assignee: "owner",
    autonomy: "assist",
    blockedBySlugs: [],
    isBlocked: false,
    created: "2026-08-15",
    due: "2026-08-15",
  });

  it("calculates named and quantified gaps between occupied slots and suggests candidate tasks", () => {
    const rawDaily = `---
type: daily
focus: '[[task-focus]]'
plan:
  - { start: "09:00", end: "10:30", kind: focus, task: '[[task-focus]]', label: "Focus LinkedIn" }
  - { start: "11:00", end: "11:30", kind: meeting, label: "Call client" }
  - { start: "16:00", end: "17:30", kind: proposal, task: '[[task-other]]' }
---

# Daily
`;
    fs.writeFileSync(path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"), rawDaily, "utf-8");

    const candidateTasks = [
      dummyTask("task-focus", "Focus LinkedIn"),
      dummyTask("task-cand-1", "Rédiger brief technique"),
      dummyTask("task-cand-2", "Nettoyer inbox"),
    ];

    const plan = readDayPlan(vaultPath, new Date("2026-08-15"), candidateTasks);

    expect(plan.hasPlan).toBe(true);
    expect(plan.slots).toHaveLength(3);

    // Vérifier les trous calculés
    expect(plan.timeline).toBeDefined();
    // Entre 10:30 et 11:00 -> trou de 30 min
    const gap30 = plan.timeline.find((item) => item.type === "gap" && item.durationMinutes === 30);
    expect(gap30).toBeDefined();
    expect(gap30?.label).toBe("30 min libres");
    if (gap30?.type === "gap") {
      expect(gap30.suggestedTask).toBeDefined();
      expect(gap30.suggestedTask?.slug).toBe("task-cand-1");
    }

    // Entre 11:30 et 16:00 -> trou de 4h30 (270 min)
    const gap270 = plan.timeline.find((item) => item.type === "gap" && item.durationMinutes === 270);
    expect(gap270).toBeDefined();
    expect(gap270?.label).toBe("4h30 libres");
    if (gap270?.type === "gap") {
      expect(gap270.suggestedTask?.slug).toBe("task-cand-2");
    }
  });


  it("handles empty day or missing plan gracefully", () => {
    const rawDaily = `---
type: daily
focus: '[[task-focus]]'
---

# Daily sans plan
`;
    fs.writeFileSync(path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"), rawDaily, "utf-8");

    const plan = readDayPlan(vaultPath, new Date("2026-08-15"), []);

    expect(plan.hasPlan).toBe(false);
    expect(plan.slots).toHaveLength(0);
    expect(plan.timeline).toHaveLength(0);
  });

  it("handles overlapping slots without crashing", () => {
    const rawSlots = [
      { start: "09:00", end: "10:30", kind: "focus" as const, label: "Slot 1" },
      { start: "10:00", end: "11:00", kind: "meeting" as const, label: "Slot 2 (Overlapping)" },
      { start: "12:00", end: "13:00", kind: "perso" as const, label: "Slot 3" },
    ];

    const timeline = computeDayPlanSchedule(rawSlots, [dummyTask("t1", "Tâche")]);

    expect(timeline.length).toBeGreaterThan(0);
    // Trou entre 11:00 (fin du chevauchement) et 12:00 -> 1h libre
    const gap1h = timeline.find((item) => item.type === "gap" && item.durationMinutes === 60);
    expect(gap1h).toBeDefined();
    expect(gap1h?.label).toBe("1h libres");
  });

  it("merges overlapping slots when calculating totalOccupiedMinutes", () => {
    const rawDaily = `---
type: daily
plan:
  - { start: "09:00", end: "10:00", kind: focus }
  - { start: "09:30", end: "10:30", kind: meeting }
---

# Daily
`;
    fs.writeFileSync(path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"), rawDaily, "utf-8");

    const plan = readDayPlan(vaultPath, new Date("2026-08-15"), []);

    expect(plan.hasPlan).toBe(true);
    // Les deux créneaux font 60 min chacun, mais ils se chevauchent de 30 min.
    // Total occupé = 09:00 à 10:30 = 90 min (pas 120 min)
    expect(plan.totalOccupiedMinutes).toBe(90);
  });
});
