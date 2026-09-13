import Link from "next/link";
import type { DailyProposal } from "@/lib/vault/daily";
import { Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ProposalsSectionProps {
  proposals: DailyProposal[];
  hasDailyNote: boolean;
}

/**
 * Les propositions du rituel du matin, en LECTURE SEULE.
 *
 * Volontairement sans bouton « je prends celle-là » : la validation passe par
 * la conversation avec le rituel, qui pose alors `due: aujourd'hui` sur la
 * tâche. Elle remonte au refresh suivant dans « Today », et disparaît d'ici.
 * Un bouton ici dupliquerait ce chemin et diviserait la décision en deux
 * endroits.
 */
export function ProposalsSection({ proposals, hasDailyNote }: ProposalsSectionProps) {
  if (proposals.length === 0) {
    return (
      <section className="px-container">
        <SectionLabel label="Suggested focus" icon={Sparkles} />
        <p className="rounded-lg border border-dashed border-border-strong bg-surface p-md text-center text-caption text-text-tertiary">
          {hasDailyNote
            ? "Today's note has no suggestions yet."
            : "Run the morning ritual to get suggestions."}
        </p>
      </section>
    );
  }

  return (
    <section className="px-container">
      <SectionLabel
        label="Suggested focus"
        icon={Sparkles}
        meta={String(proposals.length)}
      />

      <div className="space-y-xs">
        {proposals.map((proposal) => {
          const body = (
            <>
              <span className="block truncate text-body-sm font-medium text-text-primary">
                {proposal.task?.name ?? proposal.taskSlug}
              </span>
              {proposal.why && (
                <span className="mt-2xs block text-caption text-text-tertiary">
                  {proposal.why}
                </span>
              )}
              {/* Un wikilink qui ne résout pas est affiché tel quel plutôt que
                  masqué : c'est le seul endroit où l'on verra que le rituel a
                  proposé une tâche qui n'existe pas. */}
              {!proposal.task && (
                <span className="mt-2xs block text-caption font-medium text-warning">
                  unknown task
                </span>
              )}
            </>
          );

          const className =
            "block rounded-lg border border-border border-l-2 border-l-brand bg-surface p-xs2";

          return proposal.task ? (
            <Link
              key={proposal.taskSlug}
              href={`/tasks/${proposal.taskSlug}`}
              className={`${className} transition-colors hover-supported:border-border-strong`}
            >
              {body}
            </Link>
          ) : (
            <div key={proposal.taskSlug} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
