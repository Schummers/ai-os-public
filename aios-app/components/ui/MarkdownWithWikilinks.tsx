"use client";

import Link from "next/link";
import type { WikilinkReference } from "@/lib/vault/details";

interface MarkdownWithWikilinksProps {
  content: string | null;
  linkedWikilinks?: WikilinkReference[];
  className?: string;
}

export function MarkdownWithWikilinks({
  content,
  linkedWikilinks = [],
  className,
}: MarkdownWithWikilinksProps) {
  if (!content) return <p className="text-caption text-text-tertiary italic">Not set.</p>;

  // Indexer l'existence des wikilinks
  const existenceMap = new Map<string, boolean>();
  for (const ref of linkedWikilinks) {
    existenceMap.set(ref.slug, ref.exists);
  }

  // Diviser par lignes pour respecter les paragraphes et listes
  const lines = content.split("\n");

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIndex} className="h-2" />;
        }

        // Checkbox markdown list
        if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- [x]")) {
          const isChecked = trimmed.startsWith("- [x]");
          const textAfter = trimmed.slice(5).trim();
          return (
            <div key={lineIndex} className="flex items-start gap-xs py-0.5 text-body-sm">
              <span className={`w-3.5 h-3.5 mt-1 rounded border flex items-center justify-center text-[9px] ${isChecked ? "bg-positive border-positive text-white font-bold" : "border-border-strong bg-surface"}`}>
                {isChecked ? "✓" : ""}
              </span>
              <span className={isChecked ? "line-through text-text-tertiary" : "text-text-primary"}>
                {renderInlineWikilinks(textAfter, existenceMap)}
              </span>
            </div>
          );
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const textAfter = trimmed.slice(2).trim();
          return (
            <div key={lineIndex} className="flex items-start gap-xs py-0.5 text-body-sm text-text-secondary">
              <span className="text-text-tertiary">•</span>
              <span className="text-text-primary">
                {renderInlineWikilinks(textAfter, existenceMap)}
              </span>
            </div>
          );
        }

        return (
          <p key={lineIndex} className="text-body-sm text-text-secondary leading-relaxed py-0.5">
            {renderInlineWikilinks(line, existenceMap)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineWikilinks(text: string, existenceMap: Map<string, boolean>) {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[([a-zA-Z0-9_\-\.\s/|]+)\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const rawTarget = match[1];
    const [slug, alias] = rawTarget.split("|").map((s) => s.trim());
    const displayLabel = alias || slug;
    const exists = existenceMap.get(slug) ?? true;

    if (!exists) {
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[11px] font-medium bg-danger/15 text-danger border border-danger/30 underline decoration-wavy"
          title={`Lien mort : le fichier [[${slug}]] n'existe pas dans le vault`}
        >
          {displayLabel} ⚠️ (lien mort)
        </span>
      );
    } else {
      parts.push(
        <Link
          key={match.index}
          href={`/projects/${slug}`}
          className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-medium bg-brand/10 text-brand-text border border-brand/20 hover-supported:bg-brand/20 transition-colors"
        >
          {displayLabel}
        </Link>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
