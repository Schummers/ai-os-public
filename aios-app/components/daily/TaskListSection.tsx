"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskItem } from "@/lib/vault/types";
import { nextTaskStatus } from "@/lib/vault/task-status";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TaskQuickEditModal } from "@/components/tasks/TaskQuickEditModal";
import { TaskRow } from "./TaskRow";

interface TaskListSectionProps {
  label: string;
  tasks: TaskItem[];
  todayStr: string;
  focusSlug: string | null;
  /** Message affiché quand la liste est vide. Absent : la section disparaît. */
  emptyMessage?: string;
  /**
   * Nombre de tâches visibles avant le bouton « Show more ». Absent : tout est
   * affiché. Utilisé par « Late & in progress », qui dépasse la vingtaine et
   * repoussait les sections suivantes hors de portée.
   */
  initialVisible?: number;
}

/**
 * Une liste de tâches de la Daily.
 *
 * Sert les DEUX listes de la vue (« Today » et « Late & in progress »). Elles
 * ne diffèrent que par leur titre et par l'ensemble que le gateway leur
 * passe : tout le filtrage est fait dans `readDailyViewData`, ce composant ne
 * décide rien.
 */
export function TaskListSection({
  label,
  tasks,
  todayStr,
  focusSlug,
  emptyMessage,
  initialVisible,
}: TaskListSectionProps) {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleTaskUpdated = () => {
    router.refresh();
  };

  const handleToggleStatus = async (task: TaskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/tasks/${task.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextTaskStatus(task.status) }),
      });
      handleTaskUpdated();
    } catch {
      // Un échec réseau laisse la row telle quelle : le vault fait foi, et le
      // prochain refresh dira la vérité.
    }
  };

  if (tasks.length === 0) {
    if (!emptyMessage) return null;
    return (
      <section className="px-container">
        <SectionLabel label={label} />
        <p className="rounded-lg border border-border bg-surface p-md text-caption italic text-text-tertiary">
          {emptyMessage}
        </p>
      </section>
    );
  }

  const isTruncated = initialVisible !== undefined && !expanded && tasks.length > initialVisible;
  const visibleTasks = isTruncated ? tasks.slice(0, initialVisible) : tasks;
  const hiddenCount = tasks.length - visibleTasks.length;

  return (
    <section className="px-container">
      {/* Le compteur porte TOUJOURS le total, jamais le nombre affiché : un
          compteur qui suit le repli ferait croire que des tâches disparaissent
          au lieu d'être masquées. */}
      <SectionLabel label={label} meta={String(tasks.length)} />

      <div className="space-y-xs">
        {visibleTasks.map((task) => (
          <TaskRow
            key={task.slug}
            task={task}
            todayStr={todayStr}
            isFocus={task.slug === focusSlug}
            onOpen={setSelectedTask}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="press mt-xs flex w-full items-center justify-center gap-2xs rounded-lg border border-dashed border-border-strong py-xs2 text-caption font-medium text-text-secondary transition-colors hover-supported:text-text-primary"
        >
          Show {hiddenCount} more
          <Icon icon={ChevronDown} size={14} />
        </button>
      )}

      {selectedTask && (
        <TaskQuickEditModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSaved={handleTaskUpdated}
        />
      )}
    </section>
  );
}
