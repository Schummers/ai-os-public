export function extractWikilinkSlug(val: unknown): string | null {
  if (!val) return null;
  if (typeof val !== "string") return null;

  const trimmed = val.trim();
  if (trimmed.startsWith("[[") && trimmed.endsWith("]]")) {
    const inner = trimmed.slice(2, -2).trim();
    // Gérer [[slug|alias]]
    const parts = inner.split("|");
    const target = parts[0]?.trim();
    return target && target.length > 0 ? target : null;
  }

  return trimmed.length > 0 ? trimmed : null;
}

export function extractWikilinkSlugs(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => extractWikilinkSlug(item))
      .filter((slug): slug is string => slug !== null);
  }
  const single = extractWikilinkSlug(val);
  return single ? [single] : [];
}
