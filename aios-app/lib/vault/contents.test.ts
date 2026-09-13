import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readGlobalContentsData, readContentDetail } from "./contents";

describe("Contents Gateway (Vault)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-contents-"));
    fs.mkdirSync(path.join(vaultPath, "content", "idea"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "content", "production"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "content", "published"), { recursive: true });
    fs.mkdirSync(path.join(vaultPath, "content", "archive"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  it("reads and groups contents by status and by stage within production", () => {
    // 1. Contenu en Idée
    fs.writeFileSync(
      path.join(vaultPath, "content", "idea", "idee-aios.md"),
      `---\ntype: content\nname: Deep dive AIOS\ncontent_type: post\nstatus: idea\nintention: growth\ngoal: '[[growth]]'\n---\n\n# Deep dive\n`,
    );

    // 2. Contenus en Production (avec stages distincts)
    fs.writeFileSync(
      path.join(vaultPath, "content", "production", "reel-obsidian.md"),
      `---\ntype: content\nname: Pourquoi j'ai quitté Notion\ncontent_type: reel\nstatus: production\nstage: script\nintention: nurture\ngoal: '[[audience]]'\nfilm_date: 2026-08-20\n---\n\n# Reel\n## Hook\nArrêtez Notion.\n`,
    );
    fs.writeFileSync(
      path.join(vaultPath, "content", "production", "carousel-architecture.md"),
      `---\ntype: content\nname: 3 erreurs multi-agents\ncontent_type: carousel\nstatus: production\nstage: packaging\nintention: convert\ngoal: '[[agency]]'\npublish_date: 2026-08-25\n---\n\n# Carousel\n`,
    );

    // 3. Contenu Publié
    fs.writeFileSync(
      path.join(vaultPath, "content", "published", "post-lancement.md"),
      `---\ntype: content\nname: Lancement du second brain\ncontent_type: post\nstatus: published\npublish_date: 2026-08-10\n---\n\n# Lancement\n`,
    );

    const data = readGlobalContentsData(vaultPath);

    expect(data.ideaGroup.contents).toHaveLength(1);
    expect(data.ideaGroup.contents[0].slug).toBe("idee-aios");

    expect(data.productionGroup.stages).toHaveLength(2);
    const packagingStage = data.productionGroup.stages.find((s) => s.stage === "packaging");
    expect(packagingStage?.contents).toHaveLength(1);
    expect(packagingStage?.contents[0].name).toBe("3 erreurs multi-agents");

    const scriptStage = data.productionGroup.stages.find((s) => s.stage === "script");
    expect(scriptStage?.contents).toHaveLength(1);
    expect(scriptStage?.contents[0].name).toBe("Pourquoi j'ai quitté Notion");

    expect(data.publishedGroup.contents).toHaveLength(1);
    expect(data.publishedGroup.contents[0].slug).toBe("post-lancement");
  });

  it("handles completely empty contents directory with clean empty states", () => {
    const data = readGlobalContentsData(vaultPath);

    expect(data.totalCount).toBe(0);
    expect(data.ideaGroup.contents).toHaveLength(0);
    expect(data.productionGroup.stages).toHaveLength(0);
    expect(data.publishedGroup.contents).toHaveLength(0);
    expect(data.archiveGroup.contents).toHaveLength(0);
  });

  it("reads content detail with sections, metadata, and Obsidian URI", () => {
    fs.writeFileSync(
      path.join(vaultPath, "content", "production", "reel-obsidian.md"),
      `---\ntype: content\nname: Pourquoi j'ai quitté Notion\ncontent_type: reel\nstatus: production\nstage: script\nintention: nurture\ngoal: '[[audience]]'\nfilm_date: 2026-08-20\n---\n\n# Pourquoi j'ai quitté Notion\n\n## Hook\nArrêtez de compliquer votre organisation.\n\n## Script\nVoici mon setup en local.\n`,
    );

    const detail = readContentDetail(vaultPath, "reel-obsidian");

    expect(detail).not.toBeNull();
    expect(detail?.name).toBe("Pourquoi j'ai quitté Notion");
    expect(detail?.contentType).toBe("reel");
    expect(detail?.stage).toBe("script");
    expect(detail?.filmDate).toBe("2026-08-20");
    expect(detail?.sections.hook).toContain("Arrêtez de compliquer");
    expect(detail?.sections.script).toContain("Voici mon setup");
    expect(detail?.obsidianUrl).toContain("obsidian://open");
  });
});
