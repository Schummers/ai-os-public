import path from "node:path";

export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateString(val: unknown): string | null {
  if (!val) return null;
  if (val instanceof Date) {
    return getLocalDateString(val);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

/**
 * Chemin de la daily note d'une date donnée.
 *
 * Le vault range les notes de calendrier par mois
 * (`calendar/2026-08/2026-08-24.md`), pas dans un dossier `daily/` plat. Le
 * dossier du mois se déduit du préfixe de la date, jamais d'un `Date` reparsé :
 * `dateStr` est déjà local (voir `getLocalDateString`), le reparser
 * réintroduirait le décalage UTC que cette fonction existe pour éviter.
 */
export function getDailyNotePath(vaultPath: string, dateStr: string): string {
  const month = dateStr.slice(0, 7);
  return path.join(vaultPath, "calendar", month, `${dateStr}.md`);
}
