import type { ProjectItem, ProjectStatus, Priority, Autonomy, TaskItem } from "./types";
import { getLocalDateString } from "./dates";

export type DueFilter = "today" | "overdue" | "week" | "all";

export interface FilterState {
  status?: ProjectStatus | "all";
  priority?: Priority | "all";
  due?: DueFilter;
  autonomy?: Autonomy | "all";
  goal?: string | null;
}

export function parseFilterState(searchParams: URLSearchParams): FilterState {
  const statusParam = searchParams.get("status");
  const priorityParam = searchParams.get("priority");
  const dueParam = searchParams.get("due");
  const autonomyParam = searchParams.get("autonomy");
  const goalParam = searchParams.get("goal");

  const state: FilterState = {};

  if (statusParam && (["on", "ongoing", "simmering", "sleeping", "all"] as const).includes(statusParam as any)) {
    state.status = statusParam as ProjectStatus | "all";
  }
  if (priorityParam && (["high", "medium", "low", "all"] as const).includes(priorityParam as any)) {
    state.priority = priorityParam as Priority | "all";
  }
  if (dueParam && (["today", "overdue", "week", "all"] as const).includes(dueParam as any)) {
    state.due = dueParam as DueFilter;
  }
  if (autonomyParam && (["assist", "ask", "all"] as const).includes(autonomyParam as any)) {
    state.autonomy = autonomyParam as Autonomy | "all";
  }
  if (goalParam && goalParam.trim().length > 0) {
    state.goal = goalParam.trim();
  }

  return state;
}

export function serializeFilterState(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.status && state.status !== "all") params.set("status", state.status);
  if (state.priority && state.priority !== "all") params.set("priority", state.priority);
  if (state.due && state.due !== "all") params.set("due", state.due);
  if (state.autonomy && state.autonomy !== "all") params.set("autonomy", state.autonomy);
  if (state.goal) params.set("goal", state.goal);

  return params;
}

export function countActiveSecondaryFilters(state: FilterState): number {
  let count = 0;
  if (state.autonomy && state.autonomy !== "all") count++;
  if (state.status && state.status !== "all" && state.status !== "on") count++;
  if (state.due && state.due !== "all" && state.due !== "today") count++;
  return count;
}

export function filterProjectsAndTasks(
  projects: ProjectItem[],
  filter: FilterState,
  now: Date = new Date(),
): ProjectItem[] {
  const todayStr = getLocalDateString(now);

  return projects
    .filter((project) => {
      // 1. Filtre par Goal
      if (filter.goal && project.goal !== filter.goal) {
        return false;
      }

      // 2. Filtre par statut projet
      if (filter.status && filter.status !== "all" && project.status !== filter.status) {
        return false;
      }

      // 3. Filtre par priorité projet (si priorité spécifiée et projet sans tâches)
      if (filter.priority && filter.priority !== "all") {
        const projectMatchesPriority = project.priority === filter.priority;
        const hasTaskWithPriority = project.openTasks.some((t) => t.priority === filter.priority);
        if (!projectMatchesPriority && !hasTaskWithPriority) return false;
      }

      // 4. Filtre par autonomie (si autonomie spécifiée, projet doit avoir au moins une tâche correspondante)
      if (filter.autonomy && filter.autonomy !== "all") {
        const hasTaskWithAutonomy = project.openTasks.some((t) => t.autonomy === filter.autonomy);
        if (!hasTaskWithAutonomy) return false;
      }

      // 5. Filtre par due date
      if (filter.due && filter.due !== "all") {
        const hasMatchingDue = project.openTasks.some((t) => matchesDueFilter(t.due, filter.due!, todayStr));
        if (!hasMatchingDue) return false;
      }

      return true;
    })
    .map((project) => {
      // Filtrer les tâches ouvertes à l'intérieur du projet selon les filtres actifs
      let filteredOpenTasks = project.openTasks;

      if (filter.priority && filter.priority !== "all") {
        const matchingTasks = filteredOpenTasks.filter((t) => t.priority === filter.priority);
        // Si le projet a des tâches avec cette priorité, on n'affiche que celles-ci
        if (matchingTasks.length > 0) {
          filteredOpenTasks = matchingTasks;
        }
      }

      if (filter.autonomy && filter.autonomy !== "all") {
        filteredOpenTasks = filteredOpenTasks.filter((t) => t.autonomy === filter.autonomy);
      }

      if (filter.due && filter.due !== "all") {
        filteredOpenTasks = filteredOpenTasks.filter((t) => matchesDueFilter(t.due, filter.due!, todayStr));
      }

      const newDoing = filteredOpenTasks.filter((t) => t.status === "doing").length;
      const newTodo = filteredOpenTasks.filter((t) => t.status === "todo").length;

      return {
        ...project,
        openTasks: filteredOpenTasks,
        taskCounts: {
          ...project.taskCounts,
          doing: newDoing,
          todo: newTodo,
          totalOpen: filteredOpenTasks.length,
        },
      };
    });
}

function matchesDueFilter(dueStr: string | null, dueFilter: DueFilter, todayStr: string): boolean {
  if (!dueStr) return false;
  if (dueFilter === "today") {
    return dueStr === todayStr;
  }
  if (dueFilter === "overdue") {
    return dueStr < todayStr;
  }
  if (dueFilter === "week") {
    // Dans les 7 prochains jours
    const dueTime = new Date(dueStr + "T00:00:00Z").getTime();
    const todayTime = new Date(todayStr + "T00:00:00Z").getTime();
    const diffDays = Math.round((dueTime - todayTime) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 6;
  }
  return true;
}
