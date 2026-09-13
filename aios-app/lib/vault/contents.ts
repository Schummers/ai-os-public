import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractWikilinkSlug } from "./wikilinks";
import { parseDateString } from "./dates";
import { extractMarkdownSection, extractWikilinksWithExistence, type WikilinkReference } from "./details";

export type ContentStatus = "idea" | "production" | "published" | "archive";

export interface ContentItem {
  slug: string;
  name: string;
  contentType: string;
  status: ContentStatus;
  stage: string | null;
  intention: string | null;
  goal: string | null;
  series: string | null;
  filmDate: string | null;
  publishDate: string | null;
  created: string | null;
}

export interface ContentStageGroup {
  stage: string;
  label: string;
  contents: ContentItem[];
}

export interface GlobalContentsData {
  totalCount: number;
  ideaGroup: { status: "idea"; label: string; contents: ContentItem[] };
  productionGroup: { status: "production"; label: string; stages: ContentStageGroup[] };
  publishedGroup: { status: "published"; label: string; contents: ContentItem[] };
  archiveGroup: { status: "archive"; label: string; contents: ContentItem[] };
}

export interface ContentDetail extends ContentItem {
  filePath: string;
  obsidianUrl: string;
  sections: {
    packaging: string | null;
    hook: string | null;
    script: string | null;
    storyboard: string | null;
    journal: string | null;
    rawBody: string;
  };
  linkedWikilinks: WikilinkReference[];
}

const CONTENT_STATUS_DIRS: ContentStatus[] = ["idea", "production", "published", "archive"];

export function readGlobalContentsData(vaultPath: string): GlobalContentsData {
  const allContents = readAllContents(vaultPath);

  const ideaContents = allContents.filter((c) => c.status === "idea");
  const productionContents = allContents.filter((c) => c.status === "production");
  const publishedContents = allContents.filter((c) => c.status === "published");
  const archiveContents = allContents.filter((c) => c.status === "archive");

  // Regrouper la production par sous-sections de stage (présentés comme des jalons)
  const stagesMap = new Map<string, ContentItem[]>();
  for (const c of productionContents) {
    const stageKey = c.stage || "non_defini";
    if (!stagesMap.has(stageKey)) {
      stagesMap.set(stageKey, []);
    }
    stagesMap.get(stageKey)!.push(c);
  }

  const stages: ContentStageGroup[] = Array.from(stagesMap.entries()).map(([stage, contents]) => ({
    stage,
    label: formatStageLabel(stage),
    contents,
  }));

  return {
    totalCount: allContents.length,
    ideaGroup: { status: "idea", label: "Ideas & Leads", contents: ideaContents },
    productionGroup: { status: "production", label: "In Production", stages },
    publishedGroup: { status: "published", label: "Published", contents: publishedContents },
    archiveGroup: { status: "archive", label: "Archived", contents: archiveContents },
  };
}

export function readContentDetail(vaultPath: string, slug: string): ContentDetail | null {
  let foundFilePath: string | null = null;
  let contentStatus: ContentStatus = "idea";

  for (const status of CONTENT_STATUS_DIRS) {
    const candidate = path.join(vaultPath, "content", status, `${slug}.md`);
    if (fs.existsSync(candidate)) {
      foundFilePath = candidate;
      contentStatus = status;
      break;
    }
  }

  if (!foundFilePath) return null;

  try {
    const raw = fs.readFileSync(foundFilePath, "utf-8");
    const { data, content } = matter(raw);

    const name = typeof data.name === "string" ? data.name : slug;
    const contentType = typeof data.content_type === "string" ? data.content_type : "post";
    const stage = typeof data.stage === "string" ? data.stage : null;
    const intention = typeof data.intention === "string" ? data.intention : null;
    const goal = extractWikilinkSlug(data.goal);
    const series = typeof data.series === "string" ? data.series : null;
    const filmDate = parseDateString(data.film_date);
    const publishDate = parseDateString(data.publish_date);
    const created = parseDateString(data.created);

    const sections = {
      packaging: extractMarkdownSection(content, "Packaging"),
      hook: extractMarkdownSection(content, "Hook"),
      script: extractMarkdownSection(content, "Script"),
      storyboard: extractMarkdownSection(content, "Storyboard"),
      journal: extractMarkdownSection(content, "Journal"),
      rawBody: content,
    };

    const linkedWikilinks = extractWikilinksWithExistence(content, vaultPath);
    const relativePath = path.relative(vaultPath, foundFilePath);
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(relativePath)}`;

    return {
      slug,
      name,
      contentType,
      status: contentStatus,
      stage,
      intention,
      goal,
      series,
      filmDate,
      publishDate,
      created,
      filePath: relativePath,
      obsidianUrl,
      sections,
      linkedWikilinks,
    };
  } catch {
    return null;
  }
}

function readAllContents(vaultPath: string): ContentItem[] {
  const contents: ContentItem[] = [];

  for (const status of CONTENT_STATUS_DIRS) {
    const dir = path.join(vaultPath, "content", status);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        const slug = path.basename(file, ".md");

        const name = typeof data.name === "string" ? data.name : slug;
        const contentType = typeof data.content_type === "string" ? data.content_type : "post";
        const stage = typeof data.stage === "string" ? data.stage : null;
        const intention = typeof data.intention === "string" ? data.intention : null;
        const goal = extractWikilinkSlug(data.goal);
        const series = typeof data.series === "string" ? data.series : null;
        const filmDate = parseDateString(data.film_date);
        const publishDate = parseDateString(data.publish_date);
        const created = parseDateString(data.created);

        contents.push({
          slug,
          name,
          contentType,
          status,
          stage,
          intention,
          goal,
          series,
          filmDate,
          publishDate,
          created,
        });
      } catch {
        // ignorer
      }
    }
  }

  return contents;
}

function formatStageLabel(stage: string): string {
  const map: Record<string, string> = {
    packaging: "Packaging & Titles",
    hook: "Hook",
    outline: "Outline",
    script: "Script",
    storyboard: "Storyboard",
    filmed: "Filmed / Rushes",
    edited: "Edit",
    non_defini: "General",
  };
  return map[stage.toLowerCase()] || `Milestone: ${stage}`;
}
