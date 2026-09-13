import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readInboxData } from "./inbox";

describe("Inbox Gateway (Vault)", () => {
  let vaultPath: string;

  beforeEach(() => {
    vaultPath = fs.mkdtempSync(path.join(os.tmpdir(), "aios-app-vault-inbox-"));
    fs.mkdirSync(path.join(vaultPath, "inbox"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(vaultPath, { recursive: true, force: true });
  });

  it("reads unprocessed captures sorted from most recent to oldest, ignoring processed captures", () => {
    // 1. Capture récente
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-1.md"),
      `---\ntype: capture\ncreated: 2026-08-14\n---\n\n# Idée podcast\n\nInviter un expert DevOps.\n\n## Agent Notes\nSuggérer pour le projet contenu.\n`,
    );

    // 2. Capture plus ancienne
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-2.md"),
      `---\ntype: capture\ncreated: 2026-08-10\n---\n\n# Fix bug CSS\n\nVérifier le scrolling sur Safari mobile.\n`,
    );

    // 3. Capture déjà traitée (legacy)
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-processed.md"),
      `<!-- PROCESSED 2026-08-12 → task: fix-auth -->\n# Déjà traitée\n`,
    );

    // 4. Capture déjà traitée (frontmatter non quoté)
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-processed-2.md"),
      `---\nstatus: processed\n---\n# Traitée\n`,
    );

    // 5. Capture déjà traitée (frontmatter quoté)
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-processed-3.md"),
      `---\nstatus: "processed"\n---\n# Traitée quotée\n`,
    );

    // 6. Capture déjà traitée (frontmatter simple quote)
    fs.writeFileSync(
      path.join(vaultPath, "inbox", "capture-processed-4.md"),
      `---\nstatus: 'processed'\n---\n# Traitée simple quote\n`,
    );

    const data = readInboxData(vaultPath);

    expect(data.unprocessedCount).toBe(2);
    expect(data.captures).toHaveLength(2);
    // Plus récent en premier
    expect(data.captures[0].slug).toBe("capture-1");
    expect(data.captures[0].created).toBe("2026-08-14");
    expect(data.captures[0].content).toContain("Inviter un expert DevOps");
    expect(data.captures[0].agentNotes).toContain("Suggérer pour le projet contenu");

    expect(data.captures[1].slug).toBe("capture-2");
    expect(data.captures[1].created).toBe("2026-08-10");
  });

  it("handles empty inbox with clean empty state and zero count", () => {
    const data = readInboxData(vaultPath);

    expect(data.unprocessedCount).toBe(0);
    expect(data.captures).toHaveLength(0);
  });
});
