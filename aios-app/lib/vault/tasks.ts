import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import type { TaskItem, TaskStatus, Priority, Autonomy } from "./types";
import { extractWikilinkSlug, extractWikilinkSlugs } from "./wikilinks";
import { parseDateString } from "./dates";

export interface TaskRecord extends TaskItem {
  fileHash: string;
}

export interface TaskUpdates {
  status?: TaskStatus;
  priority?: Priority | null;
  due?: string | null;
  autonomy?: Autonomy | null;
}

export interface UpdateTaskResult {
  success: boolean;
  error?: string;
  conflict?: boolean;
  freshData?: TaskRecord | null;
}

const VALID_STATUSES: TaskStatus[] = ["todo", "doing", "done", "dropped"];
const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];
const VALID_AUTONOMIES: Autonomy[] = ["assist", "ask"];

export function computeFileHash(content: string): string {
  return crypto.createHash("sha256").update(content, "utf-8").digest("hex");
}

export function readTask(vaultPath: string, slug: string): TaskRecord | null {
  const filePath = path.join(vaultPath, "projects", "tasks", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const fileHash = computeFileHash(raw);
    const { data } = matter(raw);

    const name = typeof data.name === "string" ? data.name : slug;
    const status: TaskStatus = VALID_STATUSES.includes(data.status) ? data.status : "todo";
    const priority: Priority | null = VALID_PRIORITIES.includes(data.priority) ? data.priority : null;
    const autonomy: Autonomy | null = VALID_AUTONOMIES.includes(data.autonomy) ? data.autonomy : null;

    return {
      slug,
      name,
      project: extractWikilinkSlug(data.project),
      goal: extractWikilinkSlug(data.goal),
      content: extractWikilinkSlug(data.content),
      status,
      priority,
      assignee: typeof data.assignee === "string" ? data.assignee : null,
      autonomy,
      blockedBySlugs: extractWikilinkSlugs(data.blocked_by),
      isBlocked: false,
      created: parseDateString(data.created),
      due: parseDateString(data.due),
      fileHash,
    };
  } catch {
    return null;
  }
}

export function updateTaskFrontmatter(
  vaultPath: string,
  slug: string,
  updates: TaskUpdates,
  expectedHash?: string,
): UpdateTaskResult {
  const filePath = path.join(vaultPath, "projects", "tasks", `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `Task not found: ${slug}` };
  }

  // 1. Validation des énumérations
  if (updates.status !== undefined && !VALID_STATUSES.includes(updates.status)) {
    return { success: false, error: `Invalid status: ${updates.status}` };
  }
  if (updates.priority !== undefined && updates.priority !== null && !VALID_PRIORITIES.includes(updates.priority)) {
    return { success: false, error: `Invalid priority: ${updates.priority}` };
  }
  if (updates.autonomy !== undefined && updates.autonomy !== null && !VALID_AUTONOMIES.includes(updates.autonomy)) {
    return { success: false, error: `Invalid autonomy: ${updates.autonomy}` };
  }
  if (updates.due !== undefined && updates.due !== null) {
    if (typeof updates.due !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(updates.due)) {
      return { success: false, error: `Invalid date format for due (expected: YYYY-MM-DD): ${updates.due}` };
    }
  }

  // 2. Relecture immédiate pour contrôle de concurrence
  const currentRaw = fs.readFileSync(filePath, "utf-8");
  const currentHash = computeFileHash(currentRaw);

  if (expectedHash && currentHash !== expectedHash) {
    const freshData = readTask(vaultPath, slug);
    return {
      success: false,
      conflict: true,
      error: "The file was modified on disk since it was displayed.",
      freshData,
    };
  }

  // 3. Découpage strict : frontmatter vs body (préservation octet par octet du body)
  if (!currentRaw.startsWith("---")) {
    return { success: false, error: "Markdown file without canonical YAML frontmatter" };
  }

  const secondDelimIndex = currentRaw.indexOf("\n---", 3);
  if (secondDelimIndex === -1) {
    return { success: false, error: "Frontmatter not closed by '---'" };
  }

  const rawFrontmatter = currentRaw.slice(4, secondDelimIndex); // entre premier ---\n et \n---
  const rawBody = currentRaw.slice(secondDelimIndex + 4); // après \n---

  // 4. Mise à jour chirurgicale du frontmatter
  const lines = rawFrontmatter.split("\n");
  const updatedKeys = new Set<string>();

  const newLines = lines.map((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return line;

    const key = line.slice(0, colonIndex).trim();

    if (key === "status" && updates.status !== undefined) {
      updatedKeys.add("status");
      return `status: ${updates.status}`;
    }
    if (key === "priority" && updates.priority !== undefined) {
      updatedKeys.add("priority");
      return updates.priority === null ? "priority: null" : `priority: ${updates.priority}`;
    }
    if (key === "due" && updates.due !== undefined) {
      updatedKeys.add("due");
      return updates.due === null ? "due: null" : `due: ${updates.due}`;
    }
    if (key === "autonomy" && updates.autonomy !== undefined) {
      updatedKeys.add("autonomy");
      return updates.autonomy === null ? "autonomy: null" : `autonomy: ${updates.autonomy}`;
    }

    return line;
  });

  // Si des clés à mettre à jour n'étaient pas présentes dans le frontmatter d'origine, on les ajoute
  if (updates.status !== undefined && !updatedKeys.has("status")) {
    newLines.push(`status: ${updates.status}`);
  }
  if (updates.priority !== undefined && !updatedKeys.has("priority") && updates.priority !== null) {
    newLines.push(`priority: ${updates.priority}`);
  }
  if (updates.due !== undefined && !updatedKeys.has("due") && updates.due !== null) {
    newLines.push(`due: ${updates.due}`);
  }
  if (updates.autonomy !== undefined && !updatedKeys.has("autonomy") && updates.autonomy !== null) {
    newLines.push(`autonomy: ${updates.autonomy}`);
  }

  // 5. Reconstitution du fichier : frontmatter mis à jour + body strictement identique
  const newContent = `---\n${newLines.join("\n")}\n---${rawBody}`;

  fs.writeFileSync(filePath, newContent, "utf-8");

  return { success: true };
}
