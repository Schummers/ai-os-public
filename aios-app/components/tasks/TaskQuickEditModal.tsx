"use client";

import { useState } from "react";
import type { TaskItem, TaskStatus, Priority, Autonomy } from "@/lib/vault/types";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { X, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface TaskQuickEditModalProps {
  task: TaskItem;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskQuickEditModal({
  task,
  isOpen,
  onClose,
  onSaved,
}: TaskQuickEditModalProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<Priority | "none">(task.priority || "none");
  const [due, setDue] = useState<string>(task.due || "");
  const [autonomy, setAutonomy] = useState<Autonomy | "none">(task.autonomy || "none");
  const [currentHash, setCurrentHash] = useState<string | undefined>(task.fileHash);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictData, setConflictData] = useState<TaskItem | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setConflictData(null);

    try {
      const res = await fetch(`/api/tasks/${task.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority: priority === "none" ? null : priority,
          due: due.trim() ? due.trim() : null,
          autonomy: autonomy === "none" ? null : autonomy,
          expectedHash: currentHash,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.conflict && json.freshData) {
          setErrorMessage("Edit conflict: the file changed on disk.");
          setConflictData(json.freshData);
        } else {
          setErrorMessage(json.error || "Error while saving");
        }
        setIsSubmitting(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setErrorMessage("Error communicating with the server");
      setIsSubmitting(false);
    }
  };

  const handleApplyConflictData = () => {
    if (!conflictData) return;
    setStatus(conflictData.status);
    setPriority(conflictData.priority || "none");
    setDue(conflictData.due || "");
    setAutonomy(conflictData.autonomy || "none");
    setCurrentHash(conflictData.fileHash);
    setErrorMessage(null);
    setConflictData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-container bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-surface border border-border p-md shadow-2xl space-y-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-sm">
          <div>
            <span className="text-eyebrow text-brand-text">Quick task edit</span>
            <h2 className="text-body-lg font-bold text-text-primary mt-1">
              {task.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="press p-2xs2 rounded-full text-text-tertiary hover-supported:text-text-primary"
            aria-label="Close"
          >
            <Icon icon={X} size={18} />
          </button>
        </div>

        {/* Message d'erreur ou conflit */}
        {errorMessage && (
          <div className="p-xs2 rounded-lg bg-danger/10 border border-danger/30 text-danger text-body-sm space-y-2xs">
            <div className="flex items-center gap-xs font-semibold">
              <Icon icon={AlertTriangle} size={16} />
              <span>{errorMessage}</span>
            </div>
            {conflictData && (
              <button
                type="button"
                onClick={handleApplyConflictData}
                className="press mt-2xs px-xs py-2xs rounded-md bg-danger text-white text-caption font-semibold"
              >
                Reload with the fresh state from disk
              </button>
            )}
          </div>
        )}

        {/* 4 Champs éditables */}
        <div className="space-y-sm">
          {/* 1. Statut */}
          <div className="space-y-2xs">
            <label className="text-caption font-semibold text-text-secondary">
              Status
            </label>
            <SegmentedControl
              options={[
                { value: "todo", label: "Todo" },
                { value: "doing", label: "Doing" },
                { value: "done", label: "Done" },
                { value: "dropped", label: "Dropped" },
              ]}
              value={status}
              onChange={(val) => setStatus(val as TaskStatus)}
              surface="sheet"
            />
          </div>

          {/* 2. Priorité */}
          <div className="space-y-2xs">
            <label className="text-caption font-semibold text-text-secondary">
              Priority
            </label>
            <SegmentedControl
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
                { value: "none", label: "None" },
              ]}
              value={priority}
              onChange={(val) => setPriority(val as Priority | "none")}
              surface="sheet"
            />
          </div>

          {/* 3. Échéance (due) */}
          <div className="space-y-2xs">
            <label className="text-caption font-semibold text-text-secondary">
              Due date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full px-sm py-xs rounded-md bg-surface-2 border border-border text-body-sm text-text-primary focus:outline-none focus:border-brand"
            />
          </div>

          {/* 4. Autonomie */}
          <div className="space-y-2xs">
            <label className="text-caption font-semibold text-text-secondary">
              Autonomy
            </label>
            <SegmentedControl
              options={[
                { value: "assist", label: "⚡ assist" },
                { value: "ask", label: "ask" },
                { value: "none", label: "Not set" },
              ]}
              value={autonomy}
              onChange={(val) => setAutonomy(val as Autonomy | "none")}
              surface="sheet"
            />
          </div>
        </div>

        {/* Champs en lecture seule avec marqueurs explicites */}
        <div className="pt-2xs border-t border-border space-y-xs2">
          <ReadOnlyField label="Linked project" value={task.project || "None"} />
          <ReadOnlyField label="Linked goal" value={task.goal || "None"} />
          <ReadOnlyField label="Markdown body" value="Preserved byte for byte" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-xs pt-xs border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="press px-sm py-xs rounded-md border border-border text-body-sm text-text-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="press px-md py-xs rounded-md bg-brand text-fg-on-fill text-body-sm font-semibold hover-supported:bg-brand-hover disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-xs">
      <span className="flex items-center gap-2xs text-caption text-text-tertiary">
        {label}
        <span className="rounded border border-border px-2xs py-hair text-micro text-text-tertiary">
          Read-only
        </span>
      </span>
      <span className="truncate text-caption font-medium text-text-secondary">{value}</span>
    </div>
  );
}
