import type { TaskItem, TaskStatus } from "./types";

/**
 * Une tâche est « fermée » si elle est terminée OU abandonnée.
 *
 * Le prédicat vit ici et non dans les composants : la même expression était
 * recopiée dans `TaskCheckbox` et dans les listes de la Daily, et une
 * divergence entre les deux se lit comme un bug d'affichage impossible à
 * situer.
 */
export function isTaskClosed(status: TaskStatus): boolean {
  return status === "done" || status === "dropped";
}

/**
 * Statut suivant au clic sur la case à cocher : `todo` → `doing` → `done` →
 * `todo`. `dropped` retombe sur `todo`, il n'y a pas d'autre sortie depuis la
 * case (l'abandon passe par la modale d'édition).
 */
export function nextTaskStatus(status: TaskStatus): TaskStatus {
  if (status === "todo") return "doing";
  if (status === "doing") return "done";
  return "todo";
}

export function isTaskItemClosed(task: TaskItem): boolean {
  return isTaskClosed(task.status);
}
