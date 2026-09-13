import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseDateString, getLocalDateString } from "./dates";
import { extractMarkdownSection } from "./details";

export interface CaptureItem {
  slug: string;
  title: string;
  created: string;
  content: string;
  agentNotes: string | null;
  filePath: string;
  obsidianUrl: string;
}

export interface InboxData {
  unprocessedCount: number;
  captures: CaptureItem[];
}

export function readInboxData(vaultPath: string): InboxData {
  const inboxDir = path.join(vaultPath, "inbox");
  if (!fs.existsSync(inboxDir)) {
    return { unprocessedCount: 0, captures: [] };
  }

  const files = fs.readdirSync(inboxDir).filter((f) => f.endsWith(".md"));
  const captures: CaptureItem[] = [];

  for (const file of files) {
    const filePath = path.join(inboxDir, file);
    try {
      const raw = fs.readFileSync(filePath, "utf-8");

      const { data, content } = matter(raw);

      // Ignorer les captures déjà traitées
      if (raw.includes("<!-- PROCESSED") || data.status === "processed") {
        continue;
      }
      const slug = path.basename(file, ".md");

      // Extraire le titre du corps (# Titre) ou du frontmatter
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title =
        typeof data.name === "string"
          ? data.name
          : typeof data.title === "string"
            ? data.title
            : titleMatch && titleMatch[1]
              ? titleMatch[1].trim()
              : formatSlugToTitle(slug);

      // Date de création
      let created = parseDateString(data.created);
      if (!created) {
        const stats = fs.statSync(filePath);
        created = getLocalDateString(stats.mtime);
      }

      // Notes d'agent
      const agentNotes = extractMarkdownSection(content, "Agent Notes");

      // Contenu propre : enlever le titre # et la section ## Agent Notes
      let cleanContent = content
        .replace(/^#\s+.*$/m, "")
        .replace(/##\s+Agent Notes[\s\S]*$/m, "")
        .trim();

      if (!cleanContent) {
        cleanContent = "Capture sans description.";
      }

      const relativePath = path.relative(vaultPath, filePath);
      const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(relativePath)}`;

      captures.push({
        slug,
        title,
        created,
        content: cleanContent,
        agentNotes,
        filePath: relativePath,
        obsidianUrl,
      });
    } catch {
      // ignorer fichier illisible
    }
  }

  // Trier de la plus récente à la plus ancienne
  captures.sort((a, b) => b.created.localeCompare(a.created));

  return {
    unprocessedCount: captures.length,
    captures,
  };
}

function formatSlugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
