"use client";

import { useState } from "react";
import type { ProjectStatus, Priority, Autonomy } from "@/lib/vault/types";
import type { DueFilter, FilterState } from "@/lib/vault/filters";
import { countActiveSecondaryFilters } from "@/lib/vault/filters";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { FilterPill } from "@/components/ui/FilterPill";
import { FilterButton } from "@/components/ui/FilterButton";
import { X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface GlobalFilterBarProps {
  tab: "projects" | "content";
  onTabChange: (tab: "projects" | "content") => void;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

export function GlobalFilterBar({
  tab,
  onTabChange,
  filterState,
  onFilterChange,
}: GlobalFilterBarProps) {
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);

  const secondaryCount = tab === "projects" ? countActiveSecondaryFilters(filterState) : 0;

  const handleToggleStatus = (status: ProjectStatus) => {
    const next = filterState.status === status ? "all" : status;
    onFilterChange({ ...filterState, status: next });
  };

  const handleTogglePriority = (priority: Priority) => {
    const next = filterState.priority === priority ? "all" : priority;
    onFilterChange({ ...filterState, priority: next });
  };

  const handleToggleDue = (due: DueFilter) => {
    const next = filterState.due === due ? "all" : due;
    onFilterChange({ ...filterState, due: next });
  };

  const handleToggleAutonomy = (autonomy: Autonomy) => {
    const next = filterState.autonomy === autonomy ? "all" : autonomy;
    onFilterChange({ ...filterState, autonomy: next });
  };

  const handleClearAll = () => {
    onFilterChange({ goal: filterState.goal });
  };

  const hasActiveFilters = tab === "projects"
    ? (filterState.status && filterState.status !== "all") ||
      (filterState.priority && filterState.priority !== "all") ||
      (filterState.due && filterState.due !== "all") ||
      (filterState.autonomy && filterState.autonomy !== "all") ||
      !!filterState.goal
    : !!filterState.goal;

  return (
    <>
      <div className="chrome-overlay top-topbar scrollbar-none sticky z-10 flex items-center gap-2xs overflow-x-auto border-b border-border px-container py-xs">
        {/* Bascule Projets / Contenus */}
        <SegmentedControl
          options={[
            { value: "projects", label: "Projects" },
            { value: "content", label: "Content" },
          ]}
          value={tab}
          onChange={(val) => onTabChange(val as "projects" | "content")}
          className="shrink-0"
        />

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Filtres visibles : Statut */}
        <FilterPill
          label="Active (on)"
          active={tab === "projects" && filterState.status === "on"}
          onClick={() => handleToggleStatus("on")}
        />

        {/* Filtres visibles : Priorité High */}
        <FilterPill
          label="High pri"
          active={tab === "projects" && filterState.priority === "high"}
          onClick={() => handleTogglePriority("high")}
        />

        {/* Filtres visibles : Échéance Aujourd'hui */}
        <FilterPill
          label="Today"
          active={tab === "projects" && filterState.due === "today"}
          onClick={() => handleToggleDue("today")}
        />

        {/* Bouton filtres secondaires avec compteur */}
        <FilterButton
          count={secondaryCount}
          onClick={() => setIsSecondaryModalOpen(true)}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            // Même géométrie que FilterPill/FilterButton (bordure sur `surface`,
            // pill pleine hauteur) : avant, du texte nu au milieu d'une rangée
            // de pills ne se lisait pas comme un contrôle cliquable (ticket 32).
            className="press flex shrink-0 items-center gap-2xs rounded-full border border-border bg-surface px-xs2 py-2xs2 text-caption font-medium text-text-secondary transition-colors duration-fast hover-supported:border-border-strong hover-supported:text-text-primary"
          >
            <Icon icon={X} size={12} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Modal / Sheet des filtres secondaires */}
      {isSecondaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-container bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-surface border border-border p-md shadow-2xl space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-bold text-text-primary">
                Advanced filters
              </h3>
              <button
                type="button"
                onClick={() => setIsSecondaryModalOpen(false)}
                className="press p-2xs2 rounded-full text-text-tertiary hover-supported:text-text-primary"
                aria-label="Close"
              >
                <Icon icon={X} size={16} />
              </button>
            </div>

            {/* Filtre Autonomie (Délégables) */}
            <div className="space-y-2xs">
              <label className="text-caption font-semibold text-text-secondary">
                Task autonomy (delegable work queue)
              </label>
              <div className="flex flex-wrap gap-2xs">
                <FilterPill
                  label="⚡ assist (delegable)"
                  active={filterState.autonomy === "assist"}
                  onClick={() => handleToggleAutonomy("assist")}
                />
                <FilterPill
                  label="ask"
                  active={filterState.autonomy === "ask"}
                  onClick={() => handleToggleAutonomy("ask")}
                />
              </div>
            </div>

            {/* Statuts supplémentaires */}
            <div className="space-y-2xs">
              <label className="text-caption font-semibold text-text-secondary">
                Project status
              </label>
              <div className="flex flex-wrap gap-2xs">
                <FilterPill
                  label="ongoing"
                  active={filterState.status === "ongoing"}
                  onClick={() => handleToggleStatus("ongoing")}
                />
                <FilterPill
                  label="simmering"
                  active={filterState.status === "simmering"}
                  onClick={() => handleToggleStatus("simmering")}
                />
                <FilterPill
                  label="sleeping"
                  active={filterState.status === "sleeping"}
                  onClick={() => handleToggleStatus("sleeping")}
                />
              </div>
            </div>

            {/* Échéances supplémentaires */}
            <div className="space-y-2xs">
              <label className="text-caption font-semibold text-text-secondary">
                Task due date
              </label>
              <div className="flex flex-wrap gap-2xs">
                <FilterPill
                  label="Overdue"
                  active={filterState.due === "overdue"}
                  onClick={() => handleToggleDue("overdue")}
                />
                <FilterPill
                  label="This week"
                  active={filterState.due === "week"}
                  onClick={() => handleToggleDue("week")}
                />
              </div>
            </div>

            <div className="flex justify-end gap-xs pt-xs border-t border-border">
              <button
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filterState,
                    autonomy: "all",
                  });
                }}
                className="press px-sm py-xs rounded-md text-caption text-text-secondary border border-border"
              >
                Reset secondary filters
              </button>
              <button
                type="button"
                onClick={() => setIsSecondaryModalOpen(false)}
                className="press px-md py-xs rounded-md bg-brand text-fg-on-fill text-caption font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
