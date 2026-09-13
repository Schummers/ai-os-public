"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectItem, TaskItem, TaskStatus } from "@/lib/vault/types";
import { cn } from "@/lib/cn";
import { ChevronDown, ChevronUp, Edit2, ExternalLink } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { TaskQuickEditModal } from "@/components/tasks/TaskQuickEditModal";

interface ProjectAccordionProps {
  project: ProjectItem;
  defaultExpanded?: boolean;
}

export function ProjectAccordion({ project, defaultExpanded = false }: ProjectAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showClosedTasks, setShowClosedTasks] = useState(false);
  const router = useRouter();

  const { taskCounts, temporalSignal, openTasks, closedTasks } = project;

  const handleTaskUpdated = () => {
    router.refresh();
  };

  return (
    <div
      className={cn(
        "rounded-lg border transition-colors duration-fast overflow-hidden",
        isExpanded ? "bg-surface border-border-strong" : "bg-surface border-border hover-supported:border-border-strong"
      )}
    >
      {/*
        En-tête de carte dense cliquable pour déplier. `<div>` et non
        `<button>` : un vrai `<a>` (« ouvrir la page ») vit dans le coin
        droit, et un `<a>` DANS un `<button>` est un nesting HTML tout aussi
        invalide qu'un `<a>` dans un `<a>` (voir ticket 31, SearchView).
      */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsExpanded(!isExpanded);
        }}
        className="press w-full text-left p-sm flex items-start justify-between gap-sm cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-xs flex-wrap mb-2xs">
            <span className="text-body font-semibold text-text-primary">
              {project.name}
            </span>
            {project.goal && (
              <span className="inline-flex items-center px-xs py-0.5 rounded-full text-caption font-medium bg-surface-2 text-text-secondary border border-border">
                {project.goal}
              </span>
            )}
            {project.priority && (
              <span
                className={cn(
                  "inline-flex items-center px-xs py-0.5 rounded-full text-caption font-medium border",
                  project.priority === "high"
                    ? "bg-danger/10 text-danger border-danger/20"
                    : project.priority === "medium"
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-surface-2 text-text-secondary border-border"
                )}
              >
                {project.priority}
              </span>
            )}
          </div>

          <div className="flex items-center gap-sm flex-wrap text-caption text-text-secondary">
            <span className="inline-flex items-center gap-2xs">
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  project.status === "on"
                    ? "bg-status-progress"
                    : project.status === "ongoing"
                      ? "bg-text-tertiary"
                      : project.status === "simmering"
                        ? "bg-warning"
                        : "bg-text-tertiary"
                )}
              />
              <span>
                {taskCounts.doing} doing · {taskCounts.todo} todo
              </span>
            </span>

            {/* Signal temporel */}
            {temporalSignal.kind !== "none" && (
              <span
                className={cn(
                  "font-medium",
                  temporalSignal.isWarning ? "text-warning" : "text-text-tertiary"
                )}
              >
                {temporalSignal.isWarning ? "⚠️ " : ""}
                {temporalSignal.label}
              </span>
            )}
          </div>
        </div>

        {/* Une seule action visible en plus du déplier : ouvrir la page
            complète, réduite à une icône (avant : icône + texte « Page » à
            côté du chevron, deux affordances qui se disputaient l'œil —
            ticket 32). */}
        <div className="shrink-0 flex items-center gap-2xs pt-2xs">
          <a
            href={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="press text-text-tertiary hover-supported:text-brand-text p-2xs2 -m-2xs2 rounded-full"
            title="Open the full project page"
          >
            <Icon icon={ExternalLink} size={14} />
          </a>
          <span className="text-text-tertiary">
            <Icon icon={isExpanded ? ChevronUp : ChevronDown} size={16} />
          </span>
        </div>
      </div>


      {/* Tâches dépliées en place */}
      {isExpanded && (
        <div className="border-t border-border bg-surface-2/40 p-sm space-y-xs">
          {openTasks.length === 0 ? (
            <p className="text-caption text-text-tertiary py-xs">
              No open task in this project.
            </p>
          ) : (
            openTasks.map((task) => (
              <TaskRow key={task.slug} task={task} onUpdated={handleTaskUpdated} />
            ))
          )}

          {/* Tâches terminées repliées derrière un compteur */}
          {taskCounts.totalClosed > 0 && (
            <div className="pt-2xs">
              <button
                type="button"
                onClick={() => setShowClosedTasks(!showClosedTasks)}
                className="press text-caption font-medium text-text-tertiary hover-supported:text-text-secondary flex items-center gap-xs py-1"
              >
                <span>{showClosedTasks ? "▾" : "▸"}</span>
                <span>
                  {taskCounts.totalClosed} task{taskCounts.totalClosed > 1 ? "s" : ""} done or dropped
                </span>
              </button>

              {showClosedTasks && (
                <div className="space-y-xs mt-xs pt-xs border-t border-border/50">
                  {closedTasks.map((task) => (
                    <TaskRow key={task.slug} task={task} onUpdated={handleTaskUpdated} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onUpdated }: { task: TaskItem; onUpdated: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const isDone = task.status === "done" || task.status === "dropped";

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    let nextStatus: TaskStatus = "done";
    if (task.status === "todo") nextStatus = "doing";
    else if (task.status === "doing") nextStatus = "done";
    else if (task.status === "done") nextStatus = "todo";

    try {
      await fetch(`/api/tasks/${task.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      onUpdated();
    } catch {
      // fallback
    }
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-xs p-xs rounded-md border text-left transition-colors cursor-pointer",
          task.isBlocked
            ? "opacity-65 border-dashed border-danger/30 bg-danger/5"
            : "bg-surface border-border hover-supported:border-border-strong",
          isDone && "opacity-50"
        )}
        onClick={() => setIsEditOpen(true)}
      >
        {/* Boîte à cocher pour bascule d'un tap */}
        <button
          type="button"
          onClick={handleToggleStatus}
          className={cn(
            "w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 press",
            task.status === "doing"
              ? "border-brand bg-brand/30"
              : isDone
                ? "border-text-tertiary bg-text-tertiary"
                : "border-border-strong bg-transparent hover-supported:border-brand"
          )}
          aria-label={`Change status of ${task.name}`}
        >
          {isDone && <span className="text-[10px] text-surface font-bold">✓</span>}
          {task.status === "doing" && <span className="text-[9px] text-brand-text font-bold">●</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-xs">
            <div
              className={cn(
                "text-body-sm font-medium text-text-primary",
                isDone && "line-through text-text-tertiary"
              )}
            >
              {task.name}
            </div>
            <div className="flex items-center gap-xs">
              <a
                href={`/tasks/${task.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-caption text-brand-text hover-supported:underline opacity-0 group-hover:opacity-100 transition-opacity"
                title="Full task page"
              >
                ↗ Detail
              </a>
              <span className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon={Edit2} size={13} />
              </span>
            </div>
          </div>


          <div className="flex items-center gap-xs flex-wrap mt-1 text-caption text-text-tertiary">
            {task.priority && !isDone && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded font-medium",
                  task.priority === "high"
                    ? "text-danger bg-danger/10"
                    : task.priority === "medium"
                      ? "text-warning bg-warning/10"
                      : "text-text-secondary"
                )}
              >
                {task.priority}
              </span>
            )}

            {task.due && <span>{task.due}</span>}

            {task.autonomy === "assist" && (
              <span className="text-positive font-medium">⚡ assist</span>
            )}

            {task.isBlocked && (
              <span className="text-danger font-medium">
                ⛔ blocked by: {task.blockedBySlugs.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <TaskQuickEditModal
        task={task}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={onUpdated}
      />
    </>
  );
}
