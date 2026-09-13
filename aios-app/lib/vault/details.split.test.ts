import { describe, expect, it } from "vitest";
import { splitMarkdownSections } from "./details";

describe("splitMarkdownSections", () => {
  it("returns every level-2 section in file order", () => {
    const raw = `# 2026-08-24

## Session Recap

Un paragraphe.

Un autre.

## Decisions

- Une décision

## Links

- [[gestion-lmnp]]
`;

    expect(splitMarkdownSections(raw)).toEqual([
      { title: "Session Recap", body: "Un paragraphe.\n\nUn autre." },
      { title: "Decisions", body: "- Une décision" },
      { title: "Links", body: "- [[gestion-lmnp]]" },
    ]);
  });

  it("drops sections with no body, and ignores text before the first heading", () => {
    const raw = `Du préambule.\n\n## Vide\n\n## Pleine\n\ndu texte\n`;
    expect(splitMarkdownSections(raw)).toEqual([{ title: "Pleine", body: "du texte" }]);
  });

  it("returns nothing when the note has no level-2 heading", () => {
    expect(splitMarkdownSections("juste du texte")).toEqual([]);
  });
});
