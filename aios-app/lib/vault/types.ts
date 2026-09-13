export type ProjectStatus = "on" | "ongoing" | "simmering" | "sleeping" | "archive";
export type TaskStatus = "todo" | "doing" | "done" | "dropped";
export type Priority = "low" | "medium" | "high";
export type Autonomy = "assist" | "ask";

export type OnProject = {
  slug: string;
  name: string;
  goal: string | null;
  priority: string | null;
};

export type GoalItem = {
  slug: string;
  name: string;
  status: string;
  health: string | null;
  activeProjectsCount: number;
  openTasksCount: number;
};

export type TaskItem = {
  slug: string;
  name: string;
  project: string | null;
  goal: string | null;
  content: string | null;
  status: TaskStatus;
  priority: Priority | null;
  assignee: string | null;
  autonomy: Autonomy | null;
  blockedBySlugs: string[];
  isBlocked: boolean;
  created: string | null;
  due: string | null;
  fileHash?: string;
};

export type TemporalSignalKind = "target_date_overdue" | "target_date" | "inactivity" | "none";

export type TemporalSignal = {
  kind: TemporalSignalKind;
  label: string;
  days?: number;
  isWarning: boolean;
};

export type TaskCounts = {
  doing: number;
  todo: number;
  done: number;
  dropped: number;
  totalOpen: number;
  totalClosed: number;
};

export type ProjectItem = {
  slug: string;
  name: string;
  goal: string | null;
  status: ProjectStatus;
  priority: Priority | null;
  responsible: string | null;
  created: string | null;
  lastActivated: string | null;
  targetDate: string | null;
  temporalSignal: TemporalSignal;
  taskCounts: TaskCounts;
  openTasks: TaskItem[];
  closedTasks: TaskItem[];
};

export type ProjectGroup = {
  status: ProjectStatus;
  label: string;
  projects: ProjectItem[];
};

export type GlobalViewData = {
  goals: GoalItem[];
  groups: ProjectGroup[];
  /**
   * Toutes les tâches du vault, `isBlocked` déjà calculé, y compris celles
   * qu'aucun projet ne réclame. Les groupes ne suffisent pas : une tâche sans
   * `project:` (il en existe, avec seulement un `goal:`) n'apparaît dans aucun
   * `ProjectItem.openTasks` et serait invisible partout.
   */
  allTasks: TaskItem[];
};
