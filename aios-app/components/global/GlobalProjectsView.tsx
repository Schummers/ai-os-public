"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { GlobalViewData } from "@/lib/vault/types";
import type { GlobalContentsData } from "@/lib/vault/contents";
import { GoalRail } from "./GoalRail";
import { ProjectAccordion } from "./ProjectAccordion";
import { GlobalFilterBar } from "./GlobalFilterBar";
import { GlobalContentsView } from "./GlobalContentsView";
import { TopBar } from "@/components/shell/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  parseFilterState,
  serializeFilterState,
  filterProjectsAndTasks,
  type FilterState,
} from "@/lib/vault/filters";

interface GlobalProjectsViewProps {
  data: GlobalViewData;
  contentsData?: GlobalContentsData;
  unprocessedInboxCount?: number;
  /** Remonte la bascule Daily/Global à AppShell, seul propriétaire de la vue. */
  onNavigateToDaily: () => void;
}

export function GlobalProjectsView({
  data,
  contentsData,
  unprocessedInboxCount = 0,
  onNavigateToDaily,
}: GlobalProjectsViewProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [subTab, setSubTab] = useState<"projects" | "content">("projects");
  const [filterState, setFilterState] = useState<FilterState>(() => parseFilterState(searchParams));

  // Sync state from searchParams on mount or popstate
  useEffect(() => {
    setFilterState(parseFilterState(searchParams));
    const tabParam = searchParams.get("tab");
    if (tabParam === "content" || tabParam === "projects") {
      setSubTab(tabParam);
    }
  }, [searchParams]);

  const updateFilters = (newState: FilterState, newSubTab: "projects" | "content" = subTab) => {
    setFilterState(newState);
    const params = serializeFilterState(newState);
    if (newSubTab !== "projects") {
      params.set("tab", newSubTab);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleToggleGoal = (slug: string) => {
    const nextGoal = filterState.goal === slug ? null : slug;
    updateFilters({ ...filterState, goal: nextGoal });
  };

  const handleSubTabChange = (nextTab: "projects" | "content") => {
    setSubTab(nextTab);
    updateFilters(filterState, nextTab);
  };

  const handleMainTabChange = (nextMainTab: "daily" | "global") => {
    if (nextMainTab !== "daily") return;
    // Les filtres se réinitialisent quand on passe de Global à Daily (exigence spec)
    setFilterState({});
    // La vue appartient à AppShell : cette vue-ci ne fait que demander la
    // bascule. Elle tenait auparavant son propre `mainTab`, si bien que
    // cliquer « Daily » n'allumait que l'onglet — le contenu Global restait
    // affiché sous un onglet Daily actif.
    onNavigateToDaily();
  };

  // 1. Filtrer les projets et leurs tâches selon les filtres actifs
  const allProjects = data.groups.flatMap((g) => g.projects);
  const filteredProjects = filterProjectsAndTasks(allProjects, filterState);

  // 2. Regrouper les projets filtrés dans l'ordre canonique des groupes
  const filteredGroups = data.groups.map((group) => {
    const projects = filteredProjects.filter((p) => p.status === group.status);
    return {
      ...group,
      projects,
    };
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-16">
      <TopBar
        activeView="global"
        onChangeView={(view) => handleMainTabChange(view)}
        unprocessedInboxCount={unprocessedInboxCount}
      />

      <div className="max-w-4xl mx-auto w-full">
        {/* Rail des Goals */}
        <GoalRail
          goals={data.goals}
          selectedGoalSlug={filterState.goal || null}
          onToggleGoal={handleToggleGoal}
        />

        {/* Barre de filtres visible + bouton filtres secondaires */}
        <GlobalFilterBar
          tab={subTab}
          onTabChange={handleSubTabChange}
          filterState={filterState}
          onFilterChange={updateFilters}
        />

        {/* Vue Contenus ou Vue Projets */}
        {subTab === "content" && contentsData ? (
          <GlobalContentsView contentsData={contentsData} filterState={filterState} />
        ) : (
          /* Groupes de projets par statut canonique */
          <main className="space-y-lg px-container py-md">
          {filteredGroups.map((group) => {
            if (group.projects.length === 0) {
              return (
                <section key={group.status}>
                  <SectionLabel label={`${group.label} (${group.status})`} />
                  <p className="text-caption italic text-text-tertiary">
                    No {group.label.toLowerCase()} project matches the filters.
                  </p>
                </section>
              );
            }

            return (
              <section key={group.status}>
                <SectionLabel
                  label={`${group.label} (${group.status})`}
                  meta={`${group.projects.length} project${group.projects.length > 1 ? "s" : ""}`}
                />

                <div className="space-y-xs">
                  {group.projects.map((project) => (
                    <ProjectAccordion key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      )}
      </div>
    </div>
  );
}

