import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readOnProjects } from "./projects";

describe("readOnProjects", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-"));
    fs.mkdirSync(path.join(vaultPath, "projects", "on"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  function writeProject(filename: string, frontmatter: string) {
    fs.writeFileSync(
      path.join(vaultPath, "projects", "on", filename),
      `---\n${frontmatter}\n---\n\n# Body\n`,
    );
  }

  it("lists on-projects with name, priority and goal", () => {
    writeProject(
      "pipeline.md",
      "type: project\nname: Pipeline\ngoal: '[[agency]]'\nstatus: 'on'\npriority: high",
    );
    writeProject(
      "gestion-lmnp.md",
      "type: project\nname: Refonte Atlas\ngoal: '[[admin]]'\nstatus: 'on'\npriority: medium",
    );

    const projects = readOnProjects(vaultPath);

    expect(projects).toHaveLength(2);
    expect(projects.find((project) => project.slug === "pipeline")).toMatchObject({
      name: "Pipeline",
      goal: "[[agency]]",
      priority: "high",
    });
  });

  it("skips a project with incomplete frontmatter without breaking the others", () => {
    writeProject(
      "pipeline.md",
      "type: project\nname: Pipeline\ngoal: '[[agency]]'\nstatus: 'on'\npriority: high",
    );
    writeProject(
      "broken.md",
      "type: project\ngoal: '[[admin]]'\nstatus: 'on'\npriority: medium",
    );

    const projects = readOnProjects(vaultPath);

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe("Pipeline");
  });

  it("returns an empty list when the vault has no on-projects directory", () => {
    fs.rmSync(path.join(vaultPath, "projects"), { recursive: true, force: true });

    expect(readOnProjects(vaultPath)).toEqual([]);
  });
});
