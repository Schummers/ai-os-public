"use client";

import Link from "next/link";
import type { GlobalContentsData, ContentItem } from "@/lib/vault/contents";
import type { FilterState } from "@/lib/vault/filters";
import { cn } from "@/lib/cn";
import { Video, FileText, Layers, Sparkles, Calendar } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface GlobalContentsViewProps {
  contentsData: GlobalContentsData;
  filterState?: FilterState;
}

export function GlobalContentsView({
  contentsData,
  filterState = {},
}: GlobalContentsViewProps) {
  // Filtrer par goal si spécifié
  const filterByGoal = (items: ContentItem[]) => {
    if (!filterState.goal) return items;
    return items.filter((c) => c.goal === filterState.goal);
  };

  const ideaContents = filterByGoal(contentsData.ideaGroup.contents);
  const publishedContents = filterByGoal(contentsData.publishedGroup.contents);
  const archiveContents = filterByGoal(contentsData.archiveGroup.contents);

  const productionStages = contentsData.productionGroup.stages
    .map((s) => ({
      ...s,
      contents: filterByGoal(s.contents),
    }))
    .filter((s) => s.contents.length > 0);

  const totalFilteredCount =
    ideaContents.length +
    publishedContents.length +
    archiveContents.length +
    productionStages.reduce((acc, s) => acc + s.contents.length, 0);

  if (contentsData.totalCount === 0) {
    return (
      <main className="px-container space-y-md mt-sm">
        <section className="p-lg rounded-xl border border-dashed border-border-strong bg-surface text-center space-y-xs">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 text-text-tertiary mx-auto">
            <Icon icon={Layers} size={20} />
          </div>
          <h2 className="text-body font-bold text-text-primary">
            No content in the vault
          </h2>
          <p className="text-caption text-text-secondary max-w-sm mx-auto">
            The <code>content/</code> folder has no content note yet. Captures and creations go through the capture skills.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="px-container space-y-md mt-sm">
      {/* Section 1 : En Production (avec sous-sections par stage présentées comme des jalons) */}
      <section className="space-y-sm">
        <div className="flex items-center justify-between pb-2xs">
          <span className="text-eyebrow text-text-secondary flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-progress" />
            In Production
          </span>
          <span className="text-caption text-text-tertiary">
            {productionStages.reduce((acc, s) => acc + s.contents.length, 0)} item(s)
          </span>
        </div>

        {productionStages.length === 0 ? (
          <p className="text-caption text-text-tertiary italic p-md bg-surface rounded-lg border border-border">
            No content in production{filterState.goal ? ` for goal "${filterState.goal}"` : ""}.
          </p>
        ) : (
          <div className="space-y-sm">
            {productionStages.map((stageGroup) => (
              <div key={stageGroup.stage} className="space-y-xs">
                <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-1">
                  Milestone · {stageGroup.label}
                </div>
                <div className="space-y-xs">
                  {stageGroup.contents.map((content) => (
                    <ContentCard key={content.slug} content={content} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2 : Idées & Pistes */}
      <section className="space-y-xs">
        <div className="flex items-center justify-between pb-2xs">
          <span className="text-eyebrow text-text-secondary flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            Ideas & Leads
          </span>
          <span className="text-caption text-text-tertiary">
            {ideaContents.length} idea(s)
          </span>
        </div>

        {ideaContents.length === 0 ? (
          <p className="text-caption text-text-tertiary italic p-md bg-surface rounded-lg border border-border">
            No idea saved.
          </p>
        ) : (
          <div className="space-y-xs">
            {ideaContents.map((content) => (
              <ContentCard key={content.slug} content={content} />
            ))}
          </div>
        )}
      </section>

      {/* Section 3 : Publiés */}
      <section className="space-y-xs">
        <div className="flex items-center justify-between pb-2xs">
          <span className="text-eyebrow text-text-secondary flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-positive" />
            Published
          </span>
          <span className="text-caption text-text-tertiary">
            {publishedContents.length}
          </span>
        </div>

        {publishedContents.length === 0 ? (
          <p className="text-caption text-text-tertiary italic p-md bg-surface rounded-lg border border-border">
            No content published yet.
          </p>
        ) : (
          <div className="space-y-xs">
            {publishedContents.map((content) => (
              <ContentCard key={content.slug} content={content} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ContentCard({ content }: { content: ContentItem }) {
  return (
    <Link
      href={`/contents/${content.slug}`}
      className="press p-sm rounded-lg bg-surface border border-border hover-supported:border-border-strong transition-colors block"
    >
      <div className="flex items-start justify-between gap-xs">
        <span className="text-body-sm font-semibold text-text-primary truncate">
          {content.name}
        </span>
        <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.2 rounded bg-surface-2 shrink-0">
          Read-only
        </span>
      </div>

      <div className="flex items-center gap-xs flex-wrap mt-xs text-caption text-text-secondary">
        {/* Type badge */}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-medium bg-surface-2 border border-border text-text-secondary">
          {content.contentType === "reel" && <Icon icon={Video} size={11} />}
          {content.contentType === "carousel" && <Icon icon={Layers} size={11} />}
          {content.contentType === "post" && <Icon icon={FileText} size={11} />}
          <span>{content.contentType}</span>
        </span>

        {/* Intention badge */}
        {content.intention && (
          <span
            className={cn(
              "px-1.5 py-0.2 rounded font-medium border",
              content.intention === "convert"
                ? "bg-danger/10 text-danger border-danger/20"
                : content.intention === "nurture"
                  ? "bg-warning/10 text-warning border-warning/20"
                  : "bg-positive/10 text-positive border-positive/20"
            )}
          >
            {content.intention}
          </span>
        )}

        {/* Goal tag */}
        {content.goal && (
          <span className="px-1.5 py-0.2 rounded bg-brand/10 text-brand-text border border-brand/20 font-medium">
            Goal: {content.goal}
          </span>
        )}

        {/* Dates tournage & publication */}
        {content.filmDate && (
          <span className="inline-flex items-center gap-1 text-text-tertiary">
            <Icon icon={Calendar} size={11} /> Film: {content.filmDate}
          </span>
        )}
        {content.publishDate && (
          <span className="inline-flex items-center gap-1 text-text-tertiary">
            <Icon icon={Calendar} size={11} /> Publish: {content.publishDate}
          </span>
        )}
      </div>
    </Link>
  );
}
