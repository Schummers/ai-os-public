"use client";

import { useRouter } from "next/navigation";
import type { ContentDetail } from "@/lib/vault/contents";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { MarkdownWithWikilinks } from "@/components/ui/MarkdownWithWikilinks";
import { ExternalLink, Calendar, Video, FileText, Layers } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface ContentDetailViewProps {
  content: ContentDetail;
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary pb-20">
      <DetailHeader
        eyebrow="Content"
        titre={content.name}
        actions={
          <a
            href={content.obsidianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press glass flex items-center gap-1.5 px-xs2 py-1 rounded-full text-caption font-semibold text-text-primary"
            title="Open the file in Obsidian"
          >
            <span>Obsidian</span>
            <Icon icon={ExternalLink} size={12} />
          </a>
        }
      >
        <main className="px-container space-y-md pt-sm">
          {/* Titre */}
          <div>
            <h1 className="text-h2 font-display font-bold text-text-primary">
              {content.name}
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              File: <code className="text-caption text-text-tertiary">{content.filePath}</code>
            </p>
          </div>

          {/* Métadonnées (Lecture seule) */}
          <div className="p-md rounded-lg bg-surface border border-border space-y-xs text-body-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Folder status:</span>
              <div className="flex items-center gap-xs">
                <span className="font-semibold text-text-primary">{content.status}</span>
                <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.5 rounded bg-surface-2">
                  Read-only
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Content type:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-text-primary">
                {content.contentType === "reel" && <Icon icon={Video} size={13} />}
                {content.contentType === "carousel" && <Icon icon={Layers} size={13} />}
                {content.contentType === "post" && <Icon icon={FileText} size={13} />}
                <span>{content.contentType}</span>
              </span>
            </div>

            {content.stage && (
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-text-secondary">Milestone / current stage:</span>
                <span className="font-semibold text-brand-text">{content.stage}</span>
              </div>
            )}

            {content.intention && (
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-text-secondary">Intent:</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded font-semibold border text-caption",
                    content.intention === "convert"
                      ? "bg-danger/10 text-danger border-danger/20"
                      : content.intention === "nurture"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-positive/10 text-positive border-positive/20"
                  )}
                >
                  {content.intention}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-b border-border/60">
              <span className="text-text-secondary">Linked goal:</span>
              <span className="font-semibold text-brand-text">
                {content.goal ? content.goal : "None"}
              </span>
            </div>

            {content.filmDate && (
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-text-secondary">Film date:</span>
                <span className="font-semibold text-text-primary">{content.filmDate}</span>
              </div>
            )}

            {content.publishDate && (
              <div className="flex justify-between items-center py-1">
                <span className="text-text-secondary">Publish date:</span>
                <span className="font-semibold text-text-primary">{content.publishDate}</span>
              </div>
            )}
          </div>

          {/* Section Hook / Accroche */}
          {content.sections.hook && (
            <section className="space-y-xs">
              <h2 className="text-eyebrow text-text-secondary">Hook</h2>
              <div className="p-md rounded-lg bg-surface border border-border">
                <MarkdownWithWikilinks
                  content={content.sections.hook}
                  linkedWikilinks={content.linkedWikilinks}
                />
              </div>
            </section>
          )}

          {/* Section Script */}
          {content.sections.script && (
            <section className="space-y-xs">
              <h2 className="text-eyebrow text-text-secondary">Script</h2>
              <div className="p-md rounded-lg bg-surface border border-border">
                <MarkdownWithWikilinks
                  content={content.sections.script}
                  linkedWikilinks={content.linkedWikilinks}
                />
              </div>
            </section>
          )}

          {/* Section Packaging */}
          {content.sections.packaging && (
            <section className="space-y-xs">
              <h2 className="text-eyebrow text-text-secondary">Packaging & Titles</h2>
              <div className="p-md rounded-lg bg-surface border border-border">
                <MarkdownWithWikilinks
                  content={content.sections.packaging}
                  linkedWikilinks={content.linkedWikilinks}
                />
              </div>
            </section>
          )}

          {/* Section Storyboard */}
          {content.sections.storyboard && (
            <section className="space-y-xs">
              <h2 className="text-eyebrow text-text-secondary">Storyboard</h2>
              <div className="p-md rounded-lg bg-surface border border-border">
                <MarkdownWithWikilinks
                  content={content.sections.storyboard}
                  linkedWikilinks={content.linkedWikilinks}
                />
              </div>
            </section>
          )}

          {/* Section Journal */}
          {content.sections.journal && (
            <section className="space-y-xs">
              <h2 className="text-eyebrow text-text-secondary">Journal</h2>
              <div className="p-md rounded-lg bg-surface border border-border">
                <MarkdownWithWikilinks
                  content={content.sections.journal}
                  linkedWikilinks={content.linkedWikilinks}
                />
              </div>
            </section>
          )}
        </main>
      </DetailHeader>
    </div>
  );
}
