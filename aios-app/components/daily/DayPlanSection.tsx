"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DayPlanResult, DaySlotKind } from "@/lib/vault/dayplan";
import { cn } from "@/lib/cn";
import { Clock, Calendar, Sparkles, Zap, Hourglass, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface DayPlanSectionProps {
  plan: DayPlanResult;
}

export function DayPlanSection({ plan }: DayPlanSectionProps) {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setCurrentTimeStr(`${h}:${m}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!plan.hasPlan || plan.timeline.length === 0) {
    return (
      <section className="px-container">
        <SectionLabel label="Day" icon={Clock} />
        <div className="p-md rounded-xl bg-surface border border-dashed border-border-strong text-center space-y-xs">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-2 text-text-tertiary">
            <Icon icon={Calendar} size={16} />
          </div>
          <h3 className="text-body-sm font-bold text-text-primary">
            No plan for today
          </h3>
          <p className="text-caption text-text-secondary max-w-xs mx-auto">
            The daily note has no <code>plan:</code> section.
          </p>
          <div className="pt-xs">
            <span className="inline-flex items-center gap-2xs rounded-md bg-brand/15 px-xs2 py-2xs2 text-caption font-semibold text-brand-text">
              <Icon icon={Zap} size={12} />
              Run morning-ritual to frame the day
            </span>
          </div>
        </div>
      </section>
    );
  }

  const hoursOccupied = Math.round((plan.totalOccupiedMinutes / 60) * 10) / 10;
  const hoursFree = Math.round((plan.totalFreeMinutes / 60) * 10) / 10;

  return (
    <section className="px-container">
      <SectionLabel
        label="Day"
        icon={Clock}
        meta={`${hoursOccupied}h busy · ${hoursFree}h free`}
      />

      <div className="p-sm rounded-xl bg-surface border border-border space-y-xs relative">
        {plan.timeline.map((item, index) => {
          if (item.type === "slot") {
            const slotContent = (
              <div
                key={`slot-${index}`}
                style={{ minHeight: `${item.heightPx}px` }}
                className={cn(
                  "p-xs2 rounded-lg border flex flex-col justify-between transition-colors",
                  getSlotStyle(item.kind),
                  item.taskSlug && "press hover-supported:ring-1 hover-supported:ring-brand"
                )}
              >
                <div className="flex items-center justify-between gap-xs">
                  <span className="text-caption font-bold">
                    {item.start} - {item.end} · {getKindLabel(item.kind)}
                  </span>
                  <span className="text-micro uppercase tracking-wider font-semibold opacity-75">
                    {item.durationMinutes} min
                  </span>
                </div>

                <div className="text-body-sm font-semibold truncate mt-0.5">
                  {item.label}
                </div>
              </div>
            );

            if (item.taskSlug) {
              return (
                <Link key={`slot-${index}`} href={`/tasks/${item.taskSlug}`} className="block">
                  {slotContent}
                </Link>
              );
            }

            return slotContent;
          }

          // Trou (Gap)
          return (
            <div
              key={`gap-${index}`}
              style={{ minHeight: `${item.heightPx}px` }}
              className="px-sm py-xs rounded-lg border border-dashed border-border-strong/70 bg-surface-2/20 flex flex-col justify-center gap-1"
            >
              <div className="flex items-center justify-between text-caption text-text-secondary">
                <span className="flex items-center gap-2xs font-semibold italic">
                  <Icon icon={Hourglass} size={11} />
                  {item.label} ({item.start} - {item.end})
                </span>
                {item.suggestedTask && (
                  <span className="text-micro text-brand-text font-semibold flex items-center gap-1">
                    <Icon icon={Sparkles} size={10} /> Suggestion
                  </span>
                )}
              </div>

              {item.suggestedTask && (
                <Link
                  href={`/tasks/${item.suggestedTask.slug}`}
                  className="flex items-center gap-2xs truncate text-caption font-medium text-brand-text hover-supported:underline"
                >
                  <Icon icon={ChevronRight} size={11} />
                  <span className="truncate">{item.suggestedTask.name}</span>
                </Link>
              )}
            </div>
          );
        })}

        {/* Ligne repère de l'heure courante */}
        {currentTimeStr && (
          <div className="flex items-center gap-xs py-1 my-1">
            <div className="h-0.5 flex-1 bg-danger/80" />
            <span className="text-micro font-bold text-danger bg-danger/10 px-2xs2 py-hair rounded border border-danger/30">
              {currentTimeStr}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function getSlotStyle(kind: DaySlotKind): string {
  switch (kind) {
    case "focus":
      return "bg-brand/15 border-brand/35 text-text-primary";
    case "meeting":
      return "bg-blue-500/15 border-blue-500/35 text-text-primary";
    case "proposal":
      return "bg-purple-500/10 border-dashed border-purple-500/35 text-text-primary";
    case "perso":
      return "bg-positive/12 border-positive/30 text-text-primary";
    default:
      return "bg-surface-2 border-border text-text-primary";
  }
}

function getKindLabel(kind: DaySlotKind): string {
  switch (kind) {
    case "focus":
      return "Focus";
    case "meeting":
      return "Meeting";
    case "proposal":
      return "Proposal";
    case "perso":
      return "Personal";
    default:
      return kind;
  }
}
