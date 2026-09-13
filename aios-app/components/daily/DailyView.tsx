"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DailyViewData } from "@/lib/vault/daily";
import { ActiveProjectsRail } from "./ActiveProjectsRail";
import { TaskListSection } from "./TaskListSection";
import { ProposalsSection } from "./ProposalsSection";
import { DayPlanSection } from "./DayPlanSection";
import { DailyJournalSection } from "./DailyJournalSection";
import { HabitsBar } from "@/components/ui/HabitsBar";
import { TopBar } from "@/components/shell/TopBar";

interface DailyViewProps {
  data: DailyViewData;
  onNavigateToGlobal: () => void;
}

export function DailyView({ data, onNavigateToGlobal }: DailyViewProps) {
  const router = useRouter();

  // Relire le vault au retour de focus de la fenêtre/onglet
  useEffect(() => {
    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  return (
    <div className="min-h-screen bg-bg pb-20 text-text-primary">
      <TopBar
        activeView="daily"
        onChangeView={(view) => {
          if (view === "global") onNavigateToGlobal();
        }}
        unprocessedInboxCount={data.unprocessedInboxCount}
      />

      {/* Ordre arrêté en cadrage (voir wireframes/daily-v2.html) : ce qui est
          déjà engagé, puis ce qui traîne, puis ce que le rituel propose, puis
          où tout ça se pose dans le temps. La journée est en dernier parce
          qu'elle est la conséquence des sections au-dessus, pas leur point de
          départ.

          Les deux listes de tâches ne dépendent PAS du rituel : elles lisent
          `projects/tasks`. Seules « Suggested focus » et « Day » viennent de
          la daily note et restent vides tant que le rituel n'a pas tourné.

          L'écart entre sections est porté ICI (space-y-lg) et nulle part
          ailleurs, sinon les écarts s'additionnent inégalement. */}
      <main className="mx-auto max-w-4xl space-y-lg py-md">
        <ActiveProjectsRail projects={data.activeProjects} />

        <TaskListSection
          label="Today"
          tasks={data.todayTasks}
          todayStr={data.dateStr}
          focusSlug={data.focusSlug}
          emptyMessage="Nothing scheduled for today."
        />

        {/* Un bloc unique, retards d'abord : deux sections de deux lignes
            chacune sous un « Today » qui en fait souvent une, ce serait trois
            titres pour cinq lignes. Les pills distinguent les deux cas. */}
        <TaskListSection
          label="Late & in progress"
          tasks={data.lateAndDoingTasks}
          todayStr={data.dateStr}
          focusSlug={data.focusSlug}
          initialVisible={5}
        />

        <ProposalsSection proposals={data.proposals} hasDailyNote={data.hasDailyNote} />

        <DayPlanSection plan={data.dayPlan} />

        {/* Le journal ferme la page : c'est de la lecture, pas de l'action, et
            c'est la seule section qu'on consulte après coup et non le matin. */}
        <DailyJournalSection
          sections={data.journal}
          wikilinks={data.journalWikilinks}
          obsidianUrl={data.obsidianUrl}
          hasDailyNote={data.hasDailyNote}
        />
      </main>

      {/* Barre d'habitudes collée en bas (≤ 40px, sans bordure supérieure) */}
      <HabitsBar />
    </div>
  );
}
