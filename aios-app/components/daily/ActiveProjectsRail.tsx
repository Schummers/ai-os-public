"use client";

import Link from "next/link";
import type { ProjectItem } from "@/lib/vault/types";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TriangleAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface ActiveProjectsRailProps {
  projects: ProjectItem[];
}

export function ActiveProjectsRail({ projects }: ActiveProjectsRailProps) {
  if (projects.length === 0) {
    return (
      <section className="px-container">
        <SectionLabel label="Active projects" />
        <p className="text-caption italic text-text-tertiary">
          No active project (status &quot;on&quot;).
        </p>
      </section>
    );
  }

  return (
    <section className="px-container">
      <SectionLabel
        label="Active projects"
        meta={`${projects.length} active`}
      />

      {/* `-mx-container px-container` : le rail sort de la gouttière puis se
          repadde, de sorte que la première carte s'aligne sur le titre de
          section tout en laissant les suivantes défiler jusqu'au bord. */}
      <div className="-mx-container scrollbar-none flex gap-xs2 overflow-x-auto px-container pb-2xs">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="press flex w-rail-card shrink-0 flex-col justify-between rounded-lg border border-border bg-surface p-xs2 text-left transition-colors hover-supported:border-border-strong"
          >
            <div className="space-y-2xs">
              {project.goal && (
                <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-xs py-hair text-micro text-text-secondary">
                  {project.goal}
                </span>
              )}
              <span className="line-clamp-2 block text-body-sm font-semibold text-text-primary">
                {project.name}
              </span>
            </div>

            <div className="mt-xs2 space-y-2xs border-t border-border pt-xs text-caption text-text-secondary">
              {/* Pas de pastille de statut ici : ce rail ne contient que des
                  projets `on`, la couleur serait constante donc muette. Elle
                  reste dans la vue Global, où les statuts diffèrent. */}
              <div>
                {project.taskCounts.doing} doing · {project.taskCounts.todo} todo
              </div>

              {project.temporalSignal.kind !== "none" && (
                <div
                  className={cn(
                    "flex items-center gap-2xs truncate text-micro",
                    project.temporalSignal.isWarning ? "text-warning" : "text-text-tertiary"
                  )}
                >
                  {project.temporalSignal.isWarning && (
                    <Icon icon={TriangleAlert} size={10} />
                  )}
                  <span className="truncate">{project.temporalSignal.label}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
