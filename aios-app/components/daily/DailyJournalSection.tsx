import type { DailyJournalSection as JournalSection } from "@/lib/vault/daily";
import type { WikilinkReference } from "@/lib/vault/details";
import { BookText, ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MarkdownWithWikilinks } from "@/components/ui/MarkdownWithWikilinks";

interface DailyJournalProps {
  sections: JournalSection[];
  wikilinks: WikilinkReference[];
  obsidianUrl: string | null;
  hasDailyNote: boolean;
}

/**
 * Le corps de la daily note : recap de session, décisions, follow-ups,
 * journaling du matin. En LECTURE SEULE, comme le reste de la vue.
 *
 * Toutes les sous-sections sont dépliées : cette section est la dernière de
 * la page, la longueur ne gêne personne, et une section « journal » qui
 * masque des morceaux du journal ne dit pas ce qu'elle cache.
 *
 * Aucune liste de titres n'est codée en dur : le rituel du matin et
 * `/update-brain` en ajoutent au fil du temps, on affiche ce qui est là.
 */
export function DailyJournalSection({
  sections,
  wikilinks,
  obsidianUrl,
  hasDailyNote,
}: DailyJournalProps) {
  if (sections.length === 0) {
    return (
      <section className="px-container">
        <SectionLabel label="Journal" icon={BookText} />
        <p className="rounded-lg border border-dashed border-border-strong bg-surface p-md text-center text-caption text-text-tertiary">
          {hasDailyNote ? "Today's note has no content yet." : "No note for today yet."}
        </p>
      </section>
    );
  }

  return (
    <section className="px-container">
      <SectionLabel
        label="Journal"
        icon={BookText}
        meta={
          obsidianUrl ? (
            <a
              href={obsidianUrl}
              className="press inline-flex items-center gap-2xs rounded-md text-caption text-text-tertiary hover-supported:text-text-primary"
            >
              Obsidian
              <Icon icon={ArrowUpRight} size={12} />
            </a>
          ) : null
        }
      />

      <div className="space-y-xs">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-border bg-surface p-xs2">
            <h3 className="text-eyebrow mb-xs text-text-secondary">{section.title}</h3>
            <MarkdownWithWikilinks
              content={section.body}
              linkedWikilinks={wikilinks}
              className="text-body-sm text-text-secondary"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
