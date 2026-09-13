import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { TaskItem } from "./types";
import { extractWikilinkSlug } from "./wikilinks";
import { getDailyNotePath, getLocalDateString } from "./dates";

export type DaySlotKind = "focus" | "meeting" | "proposal" | "perso";

export interface RawDaySlot {
  start: string;
  end: string;
  kind: DaySlotKind;
  label?: string;
  task?: string;
}

export interface DaySlot {
  type: "slot";
  start: string;
  end: string;
  kind: DaySlotKind;
  label: string;
  taskSlug: string | null;
  durationMinutes: number;
  heightPx: number;
}

export interface DayGap {
  type: "gap";
  start: string;
  end: string;
  durationMinutes: number;
  label: string;
  suggestedTask: TaskItem | null;
  heightPx: number;
}

export type TimelineItem = DaySlot | DayGap;

export interface DayPlanResult {
  hasPlan: boolean;
  slots: DaySlot[];
  timeline: TimelineItem[];
  totalOccupiedMinutes: number;
  totalFreeMinutes: number;
}

export function readDayPlan(
  vaultPath: string,
  now: Date = new Date(),
  candidateTasks: TaskItem[] = [],
): DayPlanResult {
  const dateStr = getLocalDateString(now);
  const dailyFilePath = getDailyNotePath(vaultPath, dateStr);

  if (!fs.existsSync(dailyFilePath)) {
    return {
      hasPlan: false,
      slots: [],
      timeline: [],
      totalOccupiedMinutes: 0,
      totalFreeMinutes: 0,
    };
  }

  try {
    const raw = fs.readFileSync(dailyFilePath, "utf-8");
    const { data } = matter(raw);

    if (!Array.isArray(data.plan) || data.plan.length === 0) {
      return {
        hasPlan: false,
        slots: [],
        timeline: [],
        totalOccupiedMinutes: 0,
        totalFreeMinutes: 0,
      };
    }

    const rawSlots: RawDaySlot[] = [];
    for (const item of data.plan) {
      if (item && typeof item === "object" && typeof item.start === "string" && typeof item.end === "string") {
        const kind: DaySlotKind = isValidSlotKind(item.kind) ? item.kind : "focus";
        const label = typeof item.label === "string" ? item.label : "";
        const task = typeof item.task === "string" ? item.task : undefined;
        rawSlots.push({
          start: item.start,
          end: item.end,
          kind,
          label,
          task,
        });
      }
    }

    if (rawSlots.length === 0) {
      return {
        hasPlan: false,
        slots: [],
        timeline: [],
        totalOccupiedMinutes: 0,
        totalFreeMinutes: 0,
      };
    }

    const timeline = computeDayPlanSchedule(rawSlots, candidateTasks);
    const slots = timeline.filter((item): item is DaySlot => item.type === "slot");

    let totalOccupiedMinutes = 0;
    if (slots.length > 0) {
      const intervals = slots.map(s => [timeToMinutes(s.start), timeToMinutes(s.end)]);
      intervals.sort((a, b) => a[0] - b[0]);
      let currentStart = intervals[0][0];
      let currentEnd = intervals[0][1];
      
      for (let i = 1; i < intervals.length; i++) {
        const [nextStart, nextEnd] = intervals[i];
        if (nextStart <= currentEnd) {
          currentEnd = Math.max(currentEnd, nextEnd);
        } else {
          totalOccupiedMinutes += currentEnd - currentStart;
          currentStart = nextStart;
          currentEnd = nextEnd;
        }
      }
      totalOccupiedMinutes += currentEnd - currentStart;
    }
    const totalFreeMinutes = timeline
      .filter((item): item is DayGap => item.type === "gap")
      .reduce((acc, g) => acc + g.durationMinutes, 0);

    return {
      hasPlan: true,
      slots,
      timeline,
      totalOccupiedMinutes,
      totalFreeMinutes,
    };
  } catch {
    return {
      hasPlan: false,
      slots: [],
      timeline: [],
      totalOccupiedMinutes: 0,
      totalFreeMinutes: 0,
    };
  }
}

export function computeDayPlanSchedule(
  rawSlots: RawDaySlot[],
  candidateTasks: TaskItem[],
): TimelineItem[] {
  // 1. Trier les créneaux par heure de début
  const sorted = [...rawSlots].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

  // Préparer la liste des tâches non encore planifiées pour les suggestions de trous
  const plannedTaskSlugs = new Set<string>();
  for (const s of rawSlots) {
    const slug = extractWikilinkSlug(s.task);
    if (slug) plannedTaskSlugs.add(slug);
  }

  const unassignedCandidates = candidateTasks.filter(
    (t) => !plannedTaskSlugs.has(t.slug) && (t.status === "doing" || t.status === "todo") && !t.isBlocked,
  );

  const timeline: TimelineItem[] = [];
  let candidateIndex = 0;
  let lastOccupiedEndMinutes = -1;

  for (let i = 0; i < sorted.length; i++) {
    const raw = sorted[i];
    const startMin = timeToMinutes(raw.start);
    const endMin = timeToMinutes(raw.end);
    const duration = Math.max(15, endMin - startMin);
    const taskSlug = extractWikilinkSlug(raw.task);

    // Vérifier s'il y a un trou avant ce créneau
    if (lastOccupiedEndMinutes !== -1 && startMin > lastOccupiedEndMinutes) {
      const gapDuration = startMin - lastOccupiedEndMinutes;
      if (gapDuration >= 15) {
        const gapStart = minutesToTime(lastOccupiedEndMinutes);
        const gapEnd = raw.start;
        const suggested = unassignedCandidates[candidateIndex % unassignedCandidates.length] || null;
        if (suggested) candidateIndex++;

        timeline.push({
          type: "gap",
          start: gapStart,
          end: gapEnd,
          durationMinutes: gapDuration,
          label: formatDurationLabel(gapDuration),
          suggestedTask: suggested,
          heightPx: calculateProportionalHeight(gapDuration, true),
        });
      }
    }

    const slotLabel = raw.label || (taskSlug ? `Task: ${taskSlug}` : `${raw.kind.toUpperCase()}`);

    timeline.push({
      type: "slot",
      start: raw.start,
      end: raw.end,
      kind: raw.kind,
      label: slotLabel,
      taskSlug,
      durationMinutes: duration,
      heightPx: calculateProportionalHeight(duration, false),
    });

    lastOccupiedEndMinutes = Math.max(lastOccupiedEndMinutes, endMin);
  }

  return timeline;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(m: number): string {
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function formatDurationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h${String(mins).padStart(2, "0")} libres`;
  }
  if (hours > 0) {
    return `${hours}h libres`;
  }
  return `${mins} min libres`;
}

function calculateProportionalHeight(minutes: number, isGap: boolean): number {
  // Échelle proportionnelle : ~0.65px par minute avec un minimum garantissant la lisibilité
  if (isGap) {
    return Math.max(34, Math.min(100, Math.round(minutes * 0.45)));
  }
  return Math.max(44, Math.min(160, Math.round(minutes * 0.75)));
}

function isValidSlotKind(val: unknown): val is DaySlotKind {
  return val === "focus" || val === "meeting" || val === "proposal" || val === "perso";
}
