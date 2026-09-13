"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectDetail } from "@/lib/vault/details";
import type { TaskItem } from "@/lib/vault/types";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { MarkdownWithWikilinks } from "@/components/ui/MarkdownWithWikilinks";
import { TaskQuickEditModal } from "@/components/tasks/TaskQuickEditModal";
import { cn } from "@/lib/cn";
import { Edit2, ExternalLink } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface ProjectDetailViewProps {
  project: ProjectDetail;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const handleTaskSaved = () => {
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary pb-20">
      <DetailHeader
        eyebrow="Project"
        titre={project.name}
        actions={
          <a
            href={project.obsidianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press glass flex items-center gap-1.5 px-xs2 py-1 rounded-full text-caption font-semibold text-text-primary"
            title="Open the file in Obsidian"
          >
            <span>Obsidian</span>
            <Icon icon={ExternalLink} size={12} />
          </a>
        }
      >
        <main className="px-container space-y-md pt-sm">
          {/* Titre & Description de tête */}
          <div>
            <h1 className="text-h2 font-display font-bold text-text-primary">
              {project.name}
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Folder: <code className="text-caption text-text-tertiary">{project.filePath}</code>
            </p>
          </div>

          {/* Métadonnées du projet */}
          <div className="p-md rounded-lg bg-surface border border-border space-y-xs text-body-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Folder status:</span>
              <div className="flex items-center gap-xs">
                <span className="font-semibold text-text-primary">{project.status}</span>
                <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.5 rounded bg-surface-2">
                  Read-only
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Linked goal:</span>
              <span className="font-semibold text-brand-text">
                {project.goal ? project.goal : "None"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Priority:</span>
              <span className="font-semibold text-text-primary">
                {project.priority || "Not set"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Target date:</span>
              <span className="font-semibold text-text-primary">
                {project.targetDate || "No target date"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-text-secondary">Temporal signal:</span>
              <span
                className={cn(
                  "font-semibold",
                  project.temporalSignal.isWarning ? "text-warning" : "text-text-secondary"
                )}
              >
                {project.temporalSignal.isWarning ? "⚠️ " : ""}
                {project.temporalSignal.label}
              </span>
            </div>
          </div>

          {/* Section Objectif */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Objective</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={project.sections.objectif}
                linkedWikilinks={project.linkedWikilinks}
              />
            </div>
          </section>

          {/* Section Tâches ouvertes */}
          <section className="space-y-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-eyebrow text-text-secondary">Project tasks</h2>
              <span className="text-caption text-text-tertiary">
                {project.taskCounts.totalOpen} open · {project.taskCounts.totalClosed} done
              </span>
            </div>

            <div className="space-y-xs">
              {project.openTasks.length === 0 ? (
                <p className="text-caption text-text-tertiary italic p-md bg-surface rounded-lg border border-border">
                  No open task in this project.
                </p>
              ) : (
                project.openTasks.map((task) => (
                  <div
                    key={task.slug}
                    onClick={() => setSelectedTask(task)}
                    className="press p-xs2 rounded-md bg-surface border border-border hover-supported:border-border-strong flex items-center justify-between gap-xs cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-body-sm font-semibold text-text-primary block truncate">
                        {task.name}
                      </span>
                      <div className="flex items-center gap-xs mt-1 text-caption text-text-tertiary">
                        <span className="text-brand-text font-medium">{task.status}</span>
                        {task.priority && <span>• {task.priority}</span>}
                        {task.due && <span>• {task.due}</span>}
                        {task.autonomy === "assist" && <span className="text-positive">• ⚡ assist</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 text-text-tertiary hover-supported:text-text-primary"
                      aria-label="Edit"
                    >
                      <Icon icon={Edit2} size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Section Notes liées */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Related notes</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={project.sections.notesLiees}
                linkedWikilinks={project.linkedWikilinks}
              />
            </div>
          </section>

          {/* Section Journal */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Journal</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={project.sections.journal}
                linkedWikilinks={project.linkedWikilinks}
              />
            </div>
          </section>
        </main>
      </DetailHeader>

      {/* Modal d'édition de tâche */}
      {selectedTask && (
        <TaskQuickEditModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSaved={handleTaskSaved}
        />
      )}
    </div>
  );
}
