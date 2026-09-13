import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  GoalItem,
  GlobalViewData,
  ProjectGroup,
  ProjectItem,
  ProjectStatus,
  TaskCounts,
  TaskItem,
  TaskStatus,
  TemporalSignal,
  Priority,
  Autonomy,
} from "./types";
import { extractWikilinkSlug, extractWikilinkSlugs } from "./wikilinks";
import { getLocalDateString, parseDateString } from "./dates";


const CANONICAL_STATUS_GROUPS: { status: ProjectStatus; label: string }[] = [
  { status: "on", label: "Active" },
  { status: "ongoing", label: "Ongoing" },
  { status: "simmering", label: "Simmering" },
  { status: "sleeping", label: "Sleeping" },
];

export function readGlobalViewData(vaultPath: string, now: Date = new Date()): GlobalViewData {
  // 1. Lire toutes les tâches
  const allTasks = readAllTasks(vaultPath);

  // Indexer les tâches par statut pour vérifier si les bloqueurs sont terminés
  const taskStatusMap = new Map<string, TaskStatus>();
  for (const task of allTasks) {
    taskStatusMap.set(task.slug, task.status);
  }

  // Marquer isBlocked sur chaque tâche
  for (const task of allTasks) {
    if (task.blockedBySlugs.length > 0) {
      const hasUnresolvedBlocker = task.blockedBySlugs.some(
        (blockerSlug) => taskStatusMap.get(blockerSlug) !== "done",
      );
      task.isBlocked = hasUnresolvedBlocker;
    } else {
      task.isBlocked = false;
    }
  }

  // 2. Lire tous les projets
  const allProjects = readAllProjects(vaultPath, now, allTasks);

  // 3. Lire tous les goals avec agrégats calculés
  const goals = readGoals(vaultPath, allProjects, allTasks);

  // 4. Grouper les projets par statut canonique
  const groups: ProjectGroup[] = CANONICAL_STATUS_GROUPS.map(({ status, label }) => {
    const projectsInGroup = allProjects.filter((p) => p.status === status);
    return {
      status,
      label,
      projects: projectsInGroup,
    };
  });

  return {
    goals,
    groups,
    allTasks,
  };
}

function readAllTasks(vaultPath: string): TaskItem[] {
  const tasksDir = path.join(vaultPath, "projects", "tasks");
  if (!fs.existsSync(tasksDir)) return [];

  const files = fs.readdirSync(tasksDir).filter((f) => f.endsWith(".md"));
  const tasks: TaskItem[] = [];

  for (const file of files) {
    const filePath = path.join(tasksDir, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);
      const slug = path.basename(file, ".md");
      const name = typeof data.name === "string" ? data.name : slug;
      const status: TaskStatus = isValidTaskStatus(data.status) ? data.status : "todo";
      const priority: Priority | null = isValidPriority(data.priority) ? data.priority : null;
      const autonomy: Autonomy | null = data.autonomy === "assist" || data.autonomy === "ask" ? data.autonomy : null;

      tasks.push({
        slug,
        name,
        project: extractWikilinkSlug(data.project),
        goal: extractWikilinkSlug(data.goal),
        content: extractWikilinkSlug(data.content),
        status,
        priority,
        assignee: typeof data.assignee === "string" ? data.assignee : null,
        autonomy,
        blockedBySlugs: extractWikilinkSlugs(data.blocked_by),
        isBlocked: false,
        created: parseDateString(data.created),
        due: parseDateString(data.due),
      });
    } catch {
      // ignorer les fichiers illisibles
    }
  }

  return tasks;
}


function readAllProjects(vaultPath: string, now: Date, allTasks: TaskItem[]): ProjectItem[] {

  const projects: ProjectItem[] = [];
  const statusList: ProjectStatus[] = ["on", "ongoing", "simmering", "sleeping"];

  for (const status of statusList) {
    const dir = path.join(vaultPath, "projects", status);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);
        const slug = path.basename(file, ".md");
        const name = typeof data.name === "string" ? data.name : slug;
        const priority: Priority | null = isValidPriority(data.priority) ? data.priority : null;
        const goal = extractWikilinkSlug(data.goal);
        const targetDate = parseDateString(data.target_date);
        const lastActivated = parseDateString(data.last_activated);


        // Rattachement des tâches par frontmatter de la tâche
        const projectTasks = allTasks.filter((t) => t.project === slug);

        const taskCounts: TaskCounts = {
          doing: projectTasks.filter((t) => t.status === "doing").length,
          todo: projectTasks.filter((t) => t.status === "todo").length,
          done: projectTasks.filter((t) => t.status === "done").length,
          dropped: projectTasks.filter((t) => t.status === "dropped").length,
          totalOpen: projectTasks.filter((t) => t.status === "doing" || t.status === "todo").length,
          totalClosed: projectTasks.filter((t) => t.status === "done" || t.status === "dropped").length,
        };

        // Séparer tâches ouvertes et terminées
        const unblockedOpen = projectTasks.filter(
          (t) => (t.status === "doing" || t.status === "todo") && !t.isBlocked,
        );
        const blockedOpen = projectTasks.filter(
          (t) => (t.status === "doing" || t.status === "todo") && t.isBlocked,
        );
        const openTasks = [...unblockedOpen, ...blockedOpen];

        const closedTasks = projectTasks.filter((t) => t.status === "done" || t.status === "dropped");

        const temporalSignal = computeTemporalSignal(targetDate, lastActivated, now);

        projects.push({
          slug,
          name,
          goal,
          status,
          priority,
          responsible: typeof data.responsible === "string" ? data.responsible : null,
          created: typeof data.created === "string" ? data.created : null,
          lastActivated,
          targetDate,
          temporalSignal,
          taskCounts,
          openTasks,
          closedTasks,
        });
      } catch {
        // ignorer
      }
    }
  }

  return projects;
}

function readGoals(vaultPath: string, projects: ProjectItem[], tasks: TaskItem[]): GoalItem[] {
  const goalsDir = path.join(vaultPath, "knowledge", "goals");
  if (!fs.existsSync(goalsDir)) return [];

  const files = fs.readdirSync(goalsDir).filter((f) => f.endsWith(".md"));
  const goals: GoalItem[] = [];

  for (const file of files) {
    const filePath = path.join(goalsDir, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);
      const slug = path.basename(file, ".md");
      const name = typeof data.name === "string" ? data.name : slug;
      const status = typeof data.status === "string" ? data.status : "active";
      const health = typeof data.health === "string" ? data.health : null;

      // Calcul des projets actifs (status 'on') rattachés à ce goal
      const activeProjectsCount = projects.filter(
        (p) => p.goal === slug && p.status === "on",
      ).length;

      // Calcul des tâches ouvertes rattachées directement au goal ou via un projet du goal
      const openTasksCount = tasks.filter((t) => {
        const isOpen = t.status === "doing" || t.status === "todo";
        if (!isOpen) return false;
        if (t.goal === slug) return true;
        if (t.project) {
          const p = projects.find((proj) => proj.slug === t.project);
          if (p && p.goal === slug) return true;
        }
        return false;
      }).length;

      goals.push({
        slug,
        name,
        status,
        health,
        activeProjectsCount,
        openTasksCount,
      });
    } catch {
      // ignorer
    }
  }

  return goals;
}

export function computeTemporalSignal(
  targetDateStr: string | null,
  lastActivatedStr: string | null,
  now: Date,
): TemporalSignal {
  const todayStr = formatDate(now);

  if (targetDateStr) {
    const diffDays = daysDifference(todayStr, targetDateStr);
    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        kind: "target_date_overdue",
        label: `${overdueDays}d overdue (${targetDateStr})`,
        days: overdueDays,
        isWarning: true,
      };
    } else if (diffDays === 0) {
      return {
        kind: "target_date",
        label: "Due today",
        days: 0,
        isWarning: true,
      };
    } else {
      return {
        kind: "target_date",
        label: `J-${diffDays}`,
        days: diffDays,
        isWarning: false,
      };
    }

  }

  if (lastActivatedStr) {
    const diffDays = daysDifference(lastActivatedStr, todayStr);
    if (diffDays === 0) {
      return {
        kind: "inactivity",
        label: "Active today",
        days: 0,
        isWarning: false,
      };
    } else if (diffDays === 1) {
      return {
        kind: "inactivity",
        label: "Active yesterday",
        days: 1,
        isWarning: false,
      };
    } else {
      return {
        kind: "inactivity",
        label: `Inactive ${diffDays}d`,
        days: diffDays,
        isWarning: diffDays >= 14,
      };
    }
  }

  return {
    kind: "none",
    label: "No temporal signal",
    isWarning: false,
  };
}

function formatDate(d: Date): string {
  return getLocalDateString(d);
}

function daysDifference(fromStr: string, toStr: string): number {
  const from = new Date(fromStr + "T00:00:00Z").getTime();
  const to = new Date(toStr + "T00:00:00Z").getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

function isValidTaskStatus(val: unknown): val is TaskStatus {
  return val === "todo" || val === "doing" || val === "done" || val === "dropped";
}

function isValidPriority(val: unknown): val is Priority {
  return val === "low" || val === "medium" || val === "high";
}
