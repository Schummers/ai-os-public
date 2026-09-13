import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractWikilinkSlug } from "./wikilinks";

export type EntityType = "task" | "project" | "content" | "goal" | "note" | "source";

export interface SearchResultItem {
  slug: string;
  name: string;
  type: EntityType;
  goal: string | null;
  project: string | null;
  status: string | null;
  url: string;
  obsidianUrl: string;
  snippet?: string;
}

export interface SearchResults {
  query: string;
  fullText: boolean;
  totalMatches: number;
  tasks: SearchResultItem[];
  projects: SearchResultItem[];
  contents: SearchResultItem[];
  goals: SearchResultItem[];
  notes: SearchResultItem[];
  sources: SearchResultItem[];
}

export interface SearchOptions {
  fullText?: boolean;
}

const EXCLUDED_DIRS = new Set(["calendar", "_agent", ".obsidian", ".git", ".trash", "templates"]);

export function performSearch(
  vaultPath: string,
  query: string,
  options: SearchOptions = {},
): SearchResults {
  const normalizedQuery = query.trim().toLowerCase();
  const fullText = options.fullText === true;

  const results: SearchResults = {
    query,
    fullText,
    totalMatches: 0,
    tasks: [],
    projects: [],
    contents: [],
    goals: [],
    notes: [],
    sources: [],
  };

  if (!normalizedQuery) {
    return results;
  }

  // Scanner récursivement le vault en évitant les dossiers exclus
  scanDirectory(vaultPath, vaultPath, (filePath, relativePath) => {
    if (!filePath.endsWith(".md")) return;

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const slug = path.basename(filePath, ".md");

      const rawType = typeof data.type === "string" ? data.type : inferTypeFromPath(relativePath);
      const entityType = normalizeEntityType(rawType, relativePath);
      if (!entityType) return;

      const titleMatch = content.match(/^#\s+(.+)$/m);
      const name =
        typeof data.name === "string"
          ? data.name
          : typeof data.title === "string"
            ? data.title
            : titleMatch && titleMatch[1]
              ? titleMatch[1].trim()
              : formatSlug(slug);

      const goal = extractWikilinkSlug(data.goal);
      const project = extractWikilinkSlug(data.project);
      const status = typeof data.status === "string" ? data.status : null;

      // 1. Recherche primaire : dans le nom, le slug, et les champs du frontmatter
      const nameMatch = name.toLowerCase().includes(normalizedQuery);
      const slugMatch = slug.toLowerCase().includes(normalizedQuery);
      const goalMatch = goal ? goal.toLowerCase().includes(normalizedQuery) : false;
      const projectMatch = project ? project.toLowerCase().includes(normalizedQuery) : false;
      const statusMatch = status ? status.toLowerCase().includes(normalizedQuery) : false;

      let isMatch = nameMatch || slugMatch || goalMatch || projectMatch || statusMatch;
      let matchSnippet: string | undefined;

      // 2. Recherche plein texte explicite dans le corps
      if (!isMatch && fullText) {
        const bodyLower = content.toLowerCase();
        const foundIndex = bodyLower.indexOf(normalizedQuery);
        if (foundIndex !== -1) {
          isMatch = true;
          const start = Math.max(0, foundIndex - 30);
          const end = Math.min(content.length, foundIndex + normalizedQuery.length + 30);
          matchSnippet = `…${content.slice(start, end).replace(/\n/g, " ")}…`;
        }
      }

      if (isMatch) {
        const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(relativePath)}`;
        const url = getAppUrl(entityType, slug, obsidianUrl);

        const item: SearchResultItem = {
          slug,
          name,
          type: entityType,
          goal,
          project,
          status,
          url,
          obsidianUrl,
          snippet: matchSnippet,
        };

        if (entityType === "task") results.tasks.push(item);
        else if (entityType === "project") results.projects.push(item);
        else if (entityType === "content") results.contents.push(item);
        else if (entityType === "goal") results.goals.push(item);
        else if (entityType === "note") results.notes.push(item);
        else if (entityType === "source") results.sources.push(item);

        results.totalMatches++;
      }
    } catch {
      // ignorer fichier illisible
    }
  });

  return results;
}

function scanDirectory(
  rootDir: string,
  currentDir: string,
  onFile: (filePath: string, relativePath: string) => void,
) {
  if (!fs.existsSync(currentDir)) return;

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, fullPath);
    const topFolder = relativePath.split(path.sep)[0];

    if (EXCLUDED_DIRS.has(topFolder)) continue;

    if (entry.isDirectory()) {
      scanDirectory(rootDir, fullPath, onFile);
    } else if (entry.isFile()) {
      onFile(fullPath, relativePath);
    }
  }
}

function inferTypeFromPath(relativePath: string): string {
  const parts = relativePath.split(path.sep);
  if (parts[0] === "projects" && parts[1] === "tasks") return "task";
  if (parts[0] === "projects") return "project";
  if (parts[0] === "content") return "content";
  if (parts[0] === "knowledge" && parts[1] === "goals") return "goal";
  if (parts[0] === "knowledge" && parts[1] === "sources") return "source";
  if (parts[0] === "knowledge" && parts[1] === "notes") return "note";
  return "note";
}

function normalizeEntityType(rawType: string, relativePath: string): EntityType | null {
  const t = rawType.toLowerCase();
  if (t === "task") return "task";
  if (t === "project") return "project";
  if (t === "content") return "content";
  if (t === "goal") return "goal";
  if (t === "source") return "source";
  if (t === "note" || relativePath.startsWith(`knowledge${path.sep}notes`)) return "note";
  return null;
}

function getAppUrl(type: EntityType, slug: string, obsidianUrl: string): string {
  if (type === "task") return `/tasks/${slug}`;
  if (type === "project") return `/projects/${slug}`;
  if (type === "content") return `/contents/${slug}`;
  if (type === "goal") return `/?view=global&goal=${slug}`;
  return obsidianUrl;
}

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
