"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface HabitsBarProps {
  className?: string;
}

/** Deux grandeurs différentes (une série de jours, un pourcentage) : les
 * distinguer par type plutôt que de les mélanger dans une string libre,
 * sinon ni formatage ni tri ne sont possibles (ticket 31). */
type HabitMetric = { kind: "streak"; days: number } | { kind: "percent"; value: number };

interface Habit {
  label: string;
  done: boolean;
  metric: HabitMetric;
}

// Coquille visuelle pour le MVP : les habitudes sont hors-périmètre de données
// (ticket 15, décision de schéma non tranchée). Les valeurs sont figées ici et
// ne viennent pas du vault.
const HABITS: Habit[] = [
  { label: "Sport", done: true, metric: { kind: "streak", days: 12 } },
  { label: "Deep Work", done: true, metric: { kind: "streak", days: 8 } },
  { label: "Reading", done: false, metric: { kind: "percent", value: 85 } },
];

function formatHabitMetric(metric: HabitMetric): string {
  return metric.kind === "streak" ? `🔥 ${metric.days}` : `${metric.value}%`;
}

/**
 * Barre d'habitudes collée en bas d'écran (≤ 40px), sans trait de séparation.
 *
 * Le fond court sur TOUTE la largeur de la fenêtre ; seul le contenu est
 * contraint à la largeur du conteneur principal. La version précédente posait
 * le fond sur un bloc `max-w-lg` centré, donc le voile s'arrêtait à 512px et
 * le contenu de la page défilait à découvert de part et d'autre.
 */
export function HabitsBar({ className }: HabitsBarProps) {
  return (
    <div
      className={cn(
        "chrome-overlay pb-safe fixed inset-x-0 bottom-0 z-30",
        className
      )}
    >
      <div className="mx-auto flex h-10 max-w-4xl items-center justify-around gap-xs px-container">
        {HABITS.map((habit) => (
          <div
            key={habit.label}
            className="flex min-w-0 items-center gap-2xs text-caption font-semibold text-text-secondary"
          >
            <span
              className={cn(
                "flex h-sm w-sm shrink-0 items-center justify-center rounded-xs border",
                habit.done
                  ? "border-positive bg-positive text-bg"
                  : "border-border-strong bg-transparent"
              )}
            >
              {habit.done && <Icon icon={Check} size={9} strokeWidth={3.5} />}
            </span>
            <span className="truncate">{habit.label}</span>
            <span className="shrink-0 text-micro text-text-tertiary">
              {formatHabitMetric(habit.metric)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
