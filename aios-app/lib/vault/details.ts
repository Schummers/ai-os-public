import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ProjectItem, ProjectStatus, TaskItem, Priority, Autonomy } from "./types";
import { extractWikilinkSlug, extractWikilinkSlugs } from "./wikilinks";
import { parseDateString } from "./dates";
import { computeTemporalSignal } from "./global";
import { readTask, type TaskRecord } from "./tasks";

export interface WikilinkReference {
  raw: string;
  slug: string;
  exists: boolean;
}

export interface ProjectDetail extends ProjectItem {
  filePath: string;
  obsidianUrl: string;
  sections: {
    objectif: string | null;
    notesLiees: string | null;
    journal: string | null;
    rawBody: string;
  };
  linkedWikilinks: WikilinkReference[];
}

export interface TaskDetail extends TaskRecord {
  filePath: string;
  obsidianUrl: string;
  sections: {
    contexte: string | null;
    solution: string | null;
    criteres: string | null;
    journal: string | null;
    rawBody: string;
  };
  linkedWikilinks: WikilinkReference[];
}

const PROJECT_STATUSES: ProjectStatus[] = ["on", "ongoing", "simmering", "sleeping", "archive"];

export function readProjectDetail(vaultPath: string, slug: string, now: Date = new Date()): ProjectDetail | null {
  // Trouver le fichier projet dans l'un des sous-dossiers de statut
  let foundFilePath: string | null = null;
  let projectStatus: ProjectStatus = "on";

  for (const status of PROJECT_STATUSES) {
    const candidate = path.join(vaultPath, "projects", status, `${slug}.md`);
    if (fs.existsSync(candidate)) {
      foundFilePath = candidate;
      projectStatus = status;
      break;
    }
  }

  if (!foundFilePath) return null;

  try {
    const rawContent = fs.readFileSync(foundFilePath, "utf-8");
    const { data, content } = matter(rawContent);

    const name = typeof data.name === "string" ? data.name : slug;
    const priority: Priority | null = data.priority === "high" || data.priority === "medium" || data.priority === "low" ? data.priority : null;
    const goal = extractWikilinkSlug(data.goal);
    const targetDate = parseDateString(data.target_date);
    const lastActivated = parseDateString(data.last_activated);
    const created = parseDateString(data.created);
    const responsible = typeof data.responsible === "string" ? data.responsible : null;

    // Lire les tâches rattachées
    const allTasks = readProjectTasks(vaultPath, slug);
    const unblockedOpen = allTasks.filter((t) => (t.status === "doing" || t.status === "todo") && !t.isBlocked);
    const blockedOpen = allTasks.filter((t) => (t.status === "doing" || t.status === "todo") && t.isBlocked);
    const openTasks = [...unblockedOpen, ...blockedOpen];
    const closedTasks = allTasks.filter((t) => t.status === "done" || t.status === "dropped");

    const taskCounts = {
      doing: allTasks.filter((t) => t.status === "doing").length,
      todo: allTasks.filter((t) => t.status === "todo").length,
      done: allTasks.filter((t) => t.status === "done").length,
      dropped: allTasks.filter((t) => t.status === "dropped").length,
      totalOpen: openTasks.length,
      totalClosed: closedTasks.length,
    };

    const temporalSignal = computeTemporalSignal(targetDate, lastActivated, now);

    // Extraction des sections du corps
    const sections = {
      objectif: extractMarkdownSection(content, "Objectif"),
      notesLiees: extractMarkdownSection(content, "Notes liées"),
      journal: extractMarkdownSection(content, "Journal"),
      rawBody: content,
    };

    // Analyse des wikilinks
    const linkedWikilinks = extractWikilinksWithExistence(content, vaultPath);

    const relativePath = path.relative(vaultPath, foundFilePath);
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(relativePath)}`;

    return {
      slug,
      name,
      goal,
      status: projectStatus,
      priority,
      responsible,
      created,
      lastActivated,
      targetDate,
      temporalSignal,
      taskCounts,
      openTasks,
      closedTasks,
      filePath: relativePath,
      obsidianUrl,
      sections,
      linkedWikilinks,
    };
  } catch {
    return null;
  }
}

export function readTaskDetail(vaultPath: string, slug: string): TaskDetail | null {
  const taskRecord = readTask(vaultPath, slug);
  if (!taskRecord) return null;

  const filePath = path.join(vaultPath, "projects", "tasks", `${slug}.md`);
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(rawContent);

    const sections = {
      contexte: extractMarkdownSection(content, "Contexte"),
      solution: extractMarkdownSection(content, "Solution proposée") || extractMarkdownSection(content, "Solution"),
      criteres: extractMarkdownSection(content, "Critères de succès") || extractMarkdownSection(content, "Critères"),
      journal: extractMarkdownSection(content, "Journal"),
      rawBody: content,
    };

    const linkedWikilinks = extractWikilinksWithExistence(content, vaultPath);
    const relativePath = path.relative(vaultPath, filePath);
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(relativePath)}`;

    return {
      ...taskRecord,
      filePath: relativePath,
      obsidianUrl,
      sections,
      linkedWikilinks,
    };
  } catch {
    return null;
  }
}

function readProjectTasks(vaultPath: string, projectSlug: string): TaskItem[] {
  const tasksDir = path.join(vaultPath, "projects", "tasks");
  if (!fs.existsSync(tasksDir)) return [];

  const files = fs.readdirSync(tasksDir).filter((f) => f.endsWith(".md"));
  const tasks: TaskItem[] = [];

  for (const file of files) {
    const taskRecord = readTask(vaultPath, path.basename(file, ".md"));
    if (taskRecord && taskRecord.project === projectSlug) {
      tasks.push(taskRecord);
    }
  }

  return tasks;
}

export function extractMarkdownSection(content: string, sectionTitle: string): string | null {
  const regex = new RegExp(`^##\\s+${escapeRegex(sectionTitle)}\\s*\\n([\\s\\S]*?)(?=(?:\\n##\\s+)|$)`, "im");
  const match = content.match(regex);
  if (!match || !match[1]) return null;
  const trimmed = match[1].trim();
  return trimmed.length > 0 ? trimmed : null;
}


/**
 * Découpe un corps Markdown en ses sections de niveau 2, dans l'ordre du
 * fichier.
 *
 * Complète `extractMarkdownSection`, qui exige de connaître le titre à
 * l'avance. Le journal d'une daily note n'a pas de schéma fixe : `/update-brain`
 * et le rituel y ajoutent des sections au fil du temps, et une liste de titres
 * codée en dur finirait par masquer du contenu sans le dire.
 *
 * Le texte précédant le premier `##` (un titre `#` de note, typiquement) est
 * ignoré : ce n'est pas une section.
 */
export function splitMarkdownSections(content: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = [];
  const regex = /^##\s+(.+?)\s*$/gm;

  const headings: { title: string; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    headings.push({ title: match[1].trim(), end: match.index + match[0].length });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].end;
    const stop = i + 1 < headings.length ? content.lastIndexOf("##", headings[i + 1].end) : content.length;
    const body = content.slice(start, stop).trim();
    if (body.length > 0) {
      sections.push({ title: headings[i].title, body });
    }
  }

  return sections;
}


export function extractWikilinksWithExistence(text: string, vaultPath: string): WikilinkReference[] {
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  const results: WikilinkReference[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = wikilinkRegex.exec(text)) !== null) {
    const raw = match[0];
    const inner = match[1].split("|")[0].trim();
    if (!inner || seen.has(inner)) continue;
    seen.add(inner);

    const exists = checkFileExistsInVault(vaultPath, inner);
    results.push({
      raw,
      slug: inner,
      exists,
    });
  }

  return results;
}

function checkFileExistsInVault(vaultPath: string, slugOrPath: string): boolean {
  const cleanSlug = slugOrPath.endsWith(".md") ? slugOrPath.slice(0, -3) : slugOrPath;

  // 1. Vérification par chemin direct
  if (fs.existsSync(path.join(vaultPath, `${cleanSlug}.md`))) return true;

  // 2. Recherche rapide dans les sous-dossiers habituels
  const subdirs = [
    "knowledge/goals",
    "knowledge/notes",
    "knowledge/sources",
    "projects/on",
    "projects/ongoing",
    "projects/simmering",
    "projects/sleeping",
    "projects/archive",
    "projects/tasks",
    "content/production",
    "content/idea",
    "content/published",
    "content/archive",
    "inbox",
  ];

  for (const subdir of subdirs) {
    if (fs.existsSync(path.join(vaultPath, subdir, `${cleanSlug}.md`))) {
      return true;
    }
  }

  return false;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
