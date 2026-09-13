"use client";

import { useState } from "react";
import type { InboxData } from "@/lib/vault/inbox";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { Sparkles, Inbox, ExternalLink, Bot, CheckCircle2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

interface InboxViewProps {
  data: InboxData;
}

export function InboxView({ data }: InboxViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState<string | null>(null);

  const handleTriggerAgent = () => {
    setIsProcessing(true);
    setProcessMessage("Processing request sent to the agent.");
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary pb-20">
      <DetailHeader
        eyebrow="AIOS"
        titre="Inbox"
        actions={
          <span className="px-xs2 py-1 rounded-full text-caption font-bold bg-brand/15 text-brand-text border border-brand/30">
            {data.unprocessedCount} unprocessed
          </span>
        }
      >
        <main className="px-container space-y-md pt-sm">
          {/* Titre & Description */}
          <div>
            <h1 className="text-h2 font-display font-bold text-text-primary">
              Capture inbox
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              All raw notes captured, waiting to be classified by the agent.
            </p>
          </div>

          {/* Bouton de déclenchement du traitement par l'agent */}
          <div className="p-md rounded-xl bg-surface border border-border space-y-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-xs text-caption font-semibold text-text-secondary">
                <Icon icon={Bot} size={16} className="text-brand-text" />
                <span>Autonomous processing by the agent</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.2 rounded bg-surface-2">
                Delegation
              </span>
            </div>

            <p className="text-caption text-text-secondary">
              The app never edits a capture itself. Processing extracts tasks, projects and content per the vault rules.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleTriggerAgent}
                disabled={isProcessing || data.unprocessedCount === 0}
                className="press w-full py-2 px-md rounded-lg bg-brand text-fg-on-fill text-body-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon icon={Sparkles} size={15} />
                <span>
                  {isProcessing
                    ? "Sending to the agent..."
                    : "⚡ Trigger agent processing"}
                </span>
              </button>
            </div>

            {processMessage && (
              <div className="flex items-center gap-1.5 text-caption font-semibold text-positive pt-1">
                <Icon icon={CheckCircle2} size={14} />
                <span>{processMessage}</span>
              </div>
            )}
          </div>

          {/* Liste des captures */}
          <section className="space-y-xs">
            <div className="flex items-center justify-between pb-2xs">
              <span className="text-eyebrow text-text-secondary">Pending captures</span>
              <span className="text-caption text-text-tertiary">
                Sorted by most recent
              </span>
            </div>

            {data.captures.length === 0 ? (
              <div className="p-lg rounded-xl border border-dashed border-border-strong bg-surface text-center space-y-xs">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-positive/10 text-positive mx-auto">
                  <Icon icon={Inbox} size={20} />
                </div>
                <h3 className="text-body font-bold text-text-primary">
                  Inbox empty
                </h3>
                <p className="text-caption text-text-secondary max-w-xs mx-auto">
                  All captures have been processed, or none are pending in the vault.
                </p>
              </div>
            ) : (
              <div className="space-y-sm">
                {data.captures.map((capture) => (
                  <div
                    key={capture.slug}
                    className="p-md rounded-lg bg-surface border border-border space-y-xs"
                  >
                    <div className="flex items-start justify-between gap-xs">
                      <h3 className="text-body-sm font-bold text-text-primary">
                        {capture.title}
                      </h3>
                      <div className="flex items-center gap-xs shrink-0">
                        <span className="text-caption font-mono text-text-tertiary">
                          {capture.created}
                        </span>
                        <a
                          href={capture.obsidianUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press text-text-tertiary hover-supported:text-text-primary p-1"
                          title="Open in Obsidian"
                        >
                          <Icon icon={ExternalLink} size={13} />
                        </a>
                      </div>
                    </div>

                    <p className="text-body-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                      {capture.content}
                    </p>

                    {capture.agentNotes && (
                      <div className="p-xs2 rounded bg-surface-2/70 border border-border text-caption text-text-tertiary space-y-1">
                        <span className="font-semibold text-brand-text block">
                          Agent notes:
                        </span>
                        <p className="italic">{capture.agentNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </DetailHeader>
    </div>
  );
}
