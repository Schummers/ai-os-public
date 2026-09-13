"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TaskDetail } from "@/lib/vault/details";
import type { TaskStatus, Priority, Autonomy } from "@/lib/vault/types";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MarkdownWithWikilinks } from "@/components/ui/MarkdownWithWikilinks";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

interface TaskDetailViewProps {
  task: TaskDetail;
}

export function TaskDetailView({ task }: TaskDetailViewProps) {
  const router = useRouter();

  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<Priority | "none">(task.priority || "none");
  const [due, setDue] = useState<string>(task.due || "");
  const [autonomy, setAutonomy] = useState<Autonomy | "none">(task.autonomy || "none");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error" | "conflict">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveField = async (updates: {
    status?: TaskStatus;
    priority?: Priority | null;
    due?: string | null;
    autonomy?: Autonomy | null;
  }) => {
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/tasks/${task.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.conflict) {
          setSaveStatus("conflict");
          setErrorMessage("The file was modified on disk.");
        } else {
          setSaveStatus("error");
          setErrorMessage(json.error || "Error while saving");
        }
        setIsSaving(false);
        return;
      }

      setSaveStatus("saved");
      setIsSaving(false);
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setErrorMessage("Network error");
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary pb-20">
      <DetailHeader
        eyebrow="Task"
        titre={task.name}
        actions={
          <a
            href={task.obsidianUrl}
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
          {/* Titre */}
          <div>
            <h1 className="text-h2 font-display font-bold text-text-primary">
              {task.name}
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              File: <code className="text-caption text-text-tertiary">{task.filePath}</code>
            </p>
          </div>

          {/* Feedback d'enregistrement */}
          {saveStatus === "saved" && (
            <div className="p-xs rounded bg-positive/10 border border-positive/30 text-positive text-body-sm font-semibold">
              ✓ Saved to disk (frontmatter updated, body preserved)
            </div>
          )}
          {saveStatus === "conflict" && (
            <div className="p-xs rounded bg-danger/10 border border-danger/30 text-danger text-body-sm space-y-1">
              <div className="flex items-center gap-xs font-semibold">
                <Icon icon={AlertTriangle} size={16} />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => router.refresh()}
                className="press underline text-caption font-bold"
              >
                Reload the fresh state from disk
              </button>
            </div>
          )}

          {/* Carte des 4 champs éditables */}
          <section className="p-md rounded-lg bg-surface border border-border space-y-sm">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="text-eyebrow text-brand-text">Editable fields</span>
              {isSaving && <span className="text-caption text-text-tertiary">Saving...</span>}
            </div>

            {/* 1. Statut */}
            <div className="space-y-1">
              <label className="text-caption font-semibold text-text-secondary">Status</label>
              <SegmentedControl
                options={[
                  { value: "todo", label: "Todo" },
                  { value: "doing", label: "Doing" },
                  { value: "done", label: "Done" },
                  { value: "dropped", label: "Dropped" },
                ]}
                value={status}
                onChange={(val) => {
                  const s = val as TaskStatus;
                  setStatus(s);
                  handleSaveField({ status: s });
                }}
                surface="sheet"
              />
            </div>

            {/* 2. Priorité */}
            <div className="space-y-1">
              <label className="text-caption font-semibold text-text-secondary">Priority</label>
              <SegmentedControl
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                  { value: "none", label: "None" },
                ]}
                value={priority}
                onChange={(val) => {
                  const p = val as Priority | "none";
                  setPriority(p);
                  handleSaveField({ priority: p === "none" ? null : p });
                }}
                surface="sheet"
              />
            </div>

            {/* 3. Échéance */}
            <div className="space-y-1">
              <label className="text-caption font-semibold text-text-secondary">Due date</label>
              <input
                type="date"
                value={due}
                onChange={(e) => {
                  const d = e.target.value;
                  setDue(d);
                  handleSaveField({ due: d.trim() ? d.trim() : null });
                }}
                className="w-full px-sm py-xs rounded-md bg-surface-2 border border-border text-body-sm text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            {/* 4. Autonomie */}
            <div className="space-y-1">
              <label className="text-caption font-semibold text-text-secondary">Autonomy</label>
              <SegmentedControl
                options={[
                  { value: "assist", label: "⚡ assist" },
                  { value: "ask", label: "ask" },
                  { value: "none", label: "Not set" },
                ]}
                value={autonomy}
                onChange={(val) => {
                  const a = val as Autonomy | "none";
                  setAutonomy(a);
                  handleSaveField({ autonomy: a === "none" ? null : a });
                }}
                surface="sheet"
              />
            </div>
          </section>

          {/* Métadonnées en lecture seule */}
          <section className="p-md rounded-lg bg-surface border border-border space-y-xs text-body-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Parent project:</span>
              <div className="flex items-center gap-xs">
                {task.project ? (
                  <Link
                    href={`/projects/${task.project}`}
                    className="font-semibold text-brand-text hover-supported:underline"
                  >
                    {task.project}
                  </Link>
                ) : (
                  <span className="text-text-tertiary">No project</span>
                )}
                <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.5 rounded bg-surface-2">
                  Read-only
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Linked goal:</span>
              <span className="font-semibold text-brand-text">
                {task.goal ? task.goal : "None"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Assignee:</span>
              <span className="text-text-primary">{task.assignee || "owner"}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-text-secondary">Created:</span>
              <span className="text-text-tertiary">{task.created || "Not set"}</span>
            </div>
          </section>

          {/* Section Contexte */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Context</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={task.sections.contexte}
                linkedWikilinks={task.linkedWikilinks}
              />
            </div>
          </section>

          {/* Section Solution proposée */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Proposed solution</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={task.sections.solution}
                linkedWikilinks={task.linkedWikilinks}
              />
            </div>
          </section>

          {/* Section Critères de succès */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Success criteria</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={task.sections.criteres}
                linkedWikilinks={task.linkedWikilinks}
              />
            </div>
          </section>

          {/* Section Journal */}
          <section className="space-y-xs">
            <h2 className="text-eyebrow text-text-secondary">Journal</h2>
            <div className="p-md rounded-lg bg-surface border border-border">
              <MarkdownWithWikilinks
                content={task.sections.journal}
                linkedWikilinks={task.linkedWikilinks}
              />
            </div>
          </section>
        </main>
      </DetailHeader>
    </div>
  );
}
