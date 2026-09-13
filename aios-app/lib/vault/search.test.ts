import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { performSearch } from "./search";

describe("Global Search Gateway (Vault)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-search-"));
    fs.mkdirSync(path.join(vaultPath, "knowledge", "goals"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "on"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "projects", "tasks"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "content", "production"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "notes"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "calendar", "2026-08"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "_agent", "cache"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  it("searches by title and frontmatter first, grouped by entity type, excluding calendar and _agent", () => {
    // Goal
    fs.writeFileSync(
      path.join(vaultPath, "knowledge", "goals", "growth.md"),
      `---\ntype: goal\nname: Growth & Audience\n---\n`,
    );

    // Projet
    fs.writeFileSync(
      path.join(vaultPath, "projects", "on", "projet-growth.md"),
      `---\ntype: project\nname: Développer audience B2B\ngoal: '[[growth]]'\nstatus: 'on'\n---\n`,
    );

    // Tâche
    fs.writeFileSync(
      path.join(vaultPath, "projects", "tasks", "task-growth.md"),
      `---\ntype: task\nname: Publier post growth\nproject: '[[projet-growth]]'\ngoal: '[[growth]]'\nstatus: todo\npriority: high\n---\n`,
    );

    // Contenu
    fs.writeFileSync(
      path.join(vaultPath, "content", "production", "content-growth.md"),
      `---\ntype: content\nname: Reel stratégie growth\ncontent_type: reel\nstatus: production\ngoal: '[[growth]]'\n---\n`,
    );

    // Note libre
    fs.writeFileSync(
      path.join(vaultPath, "notes", "note-growth.md"),
      `---\ntype: note\nname: Principes de growth hacking\n---\n`,
    );

    // Fichier dans calendar (doit être exclu)
    fs.writeFileSync(
      path.join(vaultPath, "calendar", "2026-08", "2026-08-15.md"),
      `---\ntype: daily\nfocus: growth\n---\n`,
    );

    // Fichier dans _agent (doit être exclu)
    fs.writeFileSync(
      path.join(vaultPath, "_agent", "cache", "growth-cache.md"),
      `---\ntype: cache\nname: growth\n---\n`,
    );

    const results = performSearch(vaultPath, "growth", { fullText: false });

    expect(results.goals).toHaveLength(1);
    expect(results.goals[0].name).toBe("Growth & Audience");

    expect(results.projects).toHaveLength(1);
    expect(results.projects[0].name).toBe("Développer audience B2B");
    expect(results.projects[0].goal).toBe("growth");

    expect(results.tasks).toHaveLength(1);
    expect(results.tasks[0].name).toBe("Publier post growth");
    expect(results.tasks[0].project).toBe("projet-growth");

    expect(results.contents).toHaveLength(1);
    expect(results.contents[0].name).toBe("Reel stratégie growth");

    expect(results.notes).toHaveLength(1);
    expect(results.notes[0].name).toBe("Principes de growth hacking");

    // Total count
    expect(results.totalMatches).toBe(5);
  });

  it("performs explicit full text search only when requested", () => {
    fs.writeFileSync(
      path.join(vaultPath, "notes", "architecture.md"),
      `---\ntype: note\nname: Architecture Système\n---\n\nCe document mentionne le terme secret-mot-cle-specifique dans le corps.\n`,
    );

    const resultsWithoutFullText = performSearch(vaultPath, "secret-mot-cle", { fullText: false });
    expect(resultsWithoutFullText.totalMatches).toBe(0);

    const resultsWithFullText = performSearch(vaultPath, "secret-mot-cle", { fullText: true });
    expect(resultsWithFullText.totalMatches).toBe(1);
    expect(resultsWithFullText.notes[0].name).toBe("Architecture Système");
  });
});
