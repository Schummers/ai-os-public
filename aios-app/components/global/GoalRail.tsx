"use client";

import type { GoalItem } from "@/lib/vault/types";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface GoalRailProps {
  goals: GoalItem[];
  selectedGoalSlug: string | null;
  onToggleGoal: (slug: string) => void;
}

export function GoalRail({ goals, selectedGoalSlug, onToggleGoal }: GoalRailProps) {
  if (goals.length === 0) return null;

  return (
    <section className="px-container pt-md">
      <SectionLabel label="Goals Q3" meta="Tap to filter" />
      {/* Voir ActiveProjectsRail : `-mx-container px-container` aligne la
          première carte sur le titre tout en laissant le rail défiler jusqu'au
          bord. */}
      <div className="-mx-container scrollbar-none flex gap-xs2 overflow-x-auto px-container py-2xs">
        {goals.map((goal) => {
          const isSelected = selectedGoalSlug === goal.slug;
          return (
            <button
              key={goal.slug}
              type="button"
              onClick={() => onToggleGoal(goal.slug)}
              className={cn(
                // Le `ring-1` d'origine (box-shadow) se faisait rogner en haut
                // par le scroller (`overflow-x-auto` calcule aussi
                // `overflow-y: auto`, qui clippe la boîte) : le palliatif posé
                // dessus (`py-2xs`) n'avait jamais été vérifié à l'écran, et
                // DESIGN.md impose de toute façon la structure par bordures,
                // pas par ombre. La bordure seule (déjà dans le box-model,
                // jamais rognée) suffit à porter l'état actif — ticket 32.
                "press flex flex-col justify-between shrink-0 w-rail-card text-left p-xs2 rounded-lg border transition-colors duration-fast",
                isSelected
                  ? "bg-surface-2 border-brand"
                  : "bg-surface border-border hover-supported:border-border-strong"
              )}
            >
              <div>
                <span className="text-body-sm font-semibold text-text-primary line-clamp-1">
                  {goal.name}
                </span>
                <div className="flex items-center gap-2xs mt-2xs text-caption">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      goal.health === "on_track" || goal.health === "ok"
                        ? "bg-positive"
                        : goal.health === "at_risk" || goal.health === "warn"
                          ? "bg-warning"
                          : goal.health === "critical" || goal.health === "danger"
                            ? "bg-danger"
                            : "bg-status-neutral"
                    )}
                  />
                  <span className="text-text-secondary truncate">
                    {goal.health ? goal.health : "Health not set"}
                  </span>
                </div>
              </div>
              <div className="mt-xs text-caption text-text-tertiary">
                {goal.activeProjectsCount} on · {goal.openTasksCount} task{goal.openTasksCount > 1 ? "s" : ""}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
