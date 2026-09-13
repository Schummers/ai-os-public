import { describe, expect, it } from "vitest";
import path from "node:path";
import { getDailyNotePath } from "./dates";

describe("getDailyNotePath", () => {
  it("resolves the vault's monthly calendar layout, not a flat daily/ folder", () => {
    expect(getDailyNotePath("/vault", "2026-08-24")).toBe(
      path.join("/vault", "calendar", "2026-08", "2026-08-24.md"),
    );
  });

  it("derives the month folder from the date string itself", () => {
    expect(getDailyNotePath("/vault", "2026-01-01")).toBe(
      path.join("/vault", "calendar", "2026-01", "2026-01-01.md"),
    );
  });
});
