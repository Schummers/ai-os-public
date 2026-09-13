"use client";

import Link from "next/link";
import type { TaskItem } from "@/lib/vault/types";
import { isTaskClosed } from "@/lib/vault/task-status";
import { cn } from "@/lib/cn";
import { ArrowUpRight, Ban, Sparkles, Zap } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { TaskCheckbox } from "@/components/ui/TaskCheckbox";

interface TaskRowProps {
  task: TaskItem;
  /** Date du jour, pour qualifier `due` en retard / aujourd'hui / à venir. */
  todayStr: string;
  /** La tâche porte le focus validé du jour. */
  isFocus?: boolean;
  onOpen: (task: TaskItem) => void;
  onToggleStatus: (task: TaskItem, e: React.MouseEvent) => void;
}

/**
 * Ligne de tâche des listes de la Daily.
 *
 * Extraite parce que les deux listes (« Today » et « Late & in progress »)
 * affichent exactement la même chose : dupliquer la row, c'était garantir que
 * les deux divergent au premier ajustement.
 */
export function TaskRow({ task, todayStr, isFocus, onOpen, onToggleStatus }: TaskRowProps) {
  const isClosed = isTaskClosed(task.status);
  const isLate = task.due !== null && task.due < todayStr;

  return (
    <div
      onClick={() => onOpen(task)}
      className={cn(
        "group flex cursor-pointer items-start gap-xs2 rounded-lg border p-xs2 text-left transition-colors",
        task.isBlocked
          ? "border-dashed border-danger/30 bg-danger/5 opacity-70"
          : "border-border bg-surface hover-supported:border-border-strong",
        // Le focus se signale par une arête accentuée, pas par un fond teinté :
        // l'accent est réservé à l'interaction, et un fond coloré sur une row
        // cliquable se lit comme un état de survol figé.
        isFocus && !task.isBlocked && "border-l-2 border-l-brand",
        isClosed && "opacity-55"
      )}
    >
      <TaskCheckbox
        status={task.status}
        taskName={task.name}
        onToggle={(e) => onToggleStatus(task, e)}
        // Aligne la case sur la première ligne du texte, à côté d'elle.
        // Marge de CE row, pas du composant feuille (ticket 31).
        className="mt-hair"
      />

      <div className="min-w-0 flex-1 space-y-2xs">
        <div className="flex items-start justify-between gap-xs">
          <span
            className={cn(
              "block truncate text-body-sm font-medium text-text-primary",
              isClosed && "text-text-tertiary line-through"
            )}
          >
            {task.name}
          </span>

          {/* Une seule cible, 28px et non un glyphe de 13px collé : trop
              petit pour être visé de façon fiable. Il y avait auparavant une
              seconde icône (crayon) à côté, purement décorative — elle
              n'était pas cliquable, mais se lisait comme un deuxième bouton,
              « on se perd » (ticket 32). La row entière ouvre déjà la modale
              d'édition rapide ; ce lien est la seule action distincte. */}
          <Link
            href={`/tasks/${task.slug}`}
            aria-label={`Open ${task.name}`}
            onClick={(e) => e.stopPropagation()}
            className="press -my-2xs flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary opacity-0 transition-opacity hover-supported:bg-surface-2 hover-supported:text-text-primary group-hover:opacity-100"
          >
            <Icon icon={ArrowUpRight} size={16} />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-xs gap-y-2xs text-caption text-text-tertiary">
          {isFocus && (
            <span className="flex items-center gap-2xs font-semibold text-brand-text">
              <Icon icon={Sparkles} size={11} />
              focus
            </span>
          )}

          {task.priority && !isClosed && (
            <span
              className={cn(
                "rounded px-2xs2 py-hair font-medium",
                task.priority === "high"
                  ? "bg-danger/10 text-danger"
                  : task.priority === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-surface-2 text-text-secondary"
              )}
            >
              {task.priority}
            </span>
          )}

          {task.project && <span className="truncate">{task.project}</span>}

          {/* Une date en retard est une ALERTE, elle passe en danger. Une date
              du jour ou à venir reste neutre : la couleur sémantique ne sert
              qu'à signaler, jamais à décorer. */}
          {task.due && (
            <span className={cn(isLate && "font-medium text-danger")}>
              {isLate ? `overdue · ${task.due}` : task.due}
            </span>
          )}

          {task.status === "doing" && !isFocus && (
            <span className="font-medium text-warning">in progress</span>
          )}

          {task.autonomy === "assist" && (
            <span className="flex items-center gap-2xs font-medium text-positive">
              <Icon icon={Zap} size={11} />
              assist
            </span>
          )}

          {task.isBlocked && (
            <span className="flex items-center gap-2xs font-medium text-danger">
              <Icon icon={Ban} size={11} />
              blocked by: {task.blockedBySlugs.join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
