import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { OnProject } from "./types";

export function readOnProjects(vaultPath: string): OnProject[] {
  const onDir = path.join(vaultPath, "projects", "on");
  if (!fs.existsSync(onDir)) return [];

  const files = fs.readdirSync(onDir).filter((file) => file.endsWith(".md"));

  const projects: OnProject[] = [];
  for (const file of files) {
    const project = readOnProject(path.join(onDir, file));
    if (project) projects.push(project);
  }
  return projects;
}

function readOnProject(filePath: string): OnProject | null {
  let data: Record<string, unknown>;
  try {
    data = matter(fs.readFileSync(filePath, "utf-8")).data;
  } catch {
    return null;
  }

  const { name, goal, priority } = data;
  if (typeof name !== "string") return null;

  return {
    slug: path.basename(filePath, ".md"),
    name,
    goal: typeof goal === "string" ? goal : null,
    priority: typeof priority === "string" ? priority : null,
  };
}
