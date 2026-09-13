"use client";

import { ListFilter } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Pastille de couleur (8px) devant le label — classe Tailwind `bg-*` (ex. `bg-brand`). */
  swatchClassName?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Affiche l'adornment filtre (façon Linear) accolé au label de l'onglet actif. */
  withFilter?: boolean;
  onFilter?: () => void;
  /**
   * Conservé pour compatibilité d'appel. Le rail et le curseur ne dépendent
   * plus de la surface d'accueil : ils viennent des tokens `seg-rail` /
   * `seg-active`, dont la seule règle est « le curseur est plus clair que le
   * rail », dans les deux thèmes.
   */
  surface?: "page" | "sheet";
  className?: string;
  "aria-label"?: string;
}

/**
 * Contrôle segmenté, forme carrée (rayons `lg`/`md`), calé sur celui de la
 * barre latérale de Claude Code. Hauteur alignée sur celle des boutons icône
 * du chrome (36px) pour que la barre supérieure ait une seule ligne de base.
 *
 * Le segment actif est TOUJOURS plus clair que son rail, dans les deux
 * thèmes : c'est la convention de la barre latérale de Claude Code, et c'est
 * ce que `seg-rail` / `seg-active` encodent. Ne pas revenir à
 * `surface-2` / `surface`, qui inversait la relation en mode sombre.
 *
 * Pas d'ombre sur le curseur : `DESIGN.md` impose la structure par bordures.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  withFilter = false,
  onFilter,
  surface = "page",
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 w-fit items-center rounded-lg border border-border bg-seg-rail p-hair",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <span
            key={option.value}
            className={cn(
              "inline-flex h-full items-center rounded-md transition-colors duration-fast",
              active && "bg-seg-active"
            )}
          >
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "press flex h-full items-center gap-2xs rounded-md px-xs2 text-caption font-semibold transition-colors duration-fast",
                active
                  ? "text-text-primary"
                  : "text-text-secondary hover-supported:text-text-primary"
              )}
            >
              {option.swatchClassName && (
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", option.swatchClassName)}
                  aria-hidden
                />
              )}
              {option.label}
            </button>
            {active && withFilter && (
              <button
                type="button"
                aria-label="Filters"
                onClick={onFilter}
                className="press flex h-full items-center rounded-r-md border-l border-border pl-2xs pr-xs2 text-text-primary"
              >
                <Icon icon={ListFilter} size={14} />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
