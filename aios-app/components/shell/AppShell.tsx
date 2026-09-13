"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { DailyViewData } from "@/lib/vault/daily";
import type { GlobalViewData } from "@/lib/vault/types";
import type { GlobalContentsData } from "@/lib/vault/contents";
import { DailyView } from "@/components/daily/DailyView";
import { GlobalProjectsView } from "@/components/global/GlobalProjectsView";

interface AppShellProps {
  dailyData: DailyViewData;
  globalData: GlobalViewData;
  contentsData: GlobalContentsData;
}

export function AppShell({ dailyData, globalData, contentsData }: AppShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const viewParam = searchParams.get("view");
  const [view, setView] = useState<"daily" | "global">(
    viewParam === "daily" || viewParam === "global" ? viewParam : "daily"
  );

  useEffect(() => {
    const p = searchParams.get("view");
    if (p === "daily" || p === "global") {
      setView(p);
    }
  }, [searchParams]);

  const handleNavigateToGlobal = () => {
    setView("global");
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "global");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleNavigateToDaily = () => {
    setView("daily");
    router.replace(pathname);
  };

  if (view === "daily") {
    return (
      <DailyView
        data={dailyData}
        onNavigateToGlobal={handleNavigateToGlobal}
      />
    );
  }

  return (
    <GlobalProjectsView
      data={globalData}
      contentsData={contentsData}
      unprocessedInboxCount={dailyData.unprocessedInboxCount}
      onNavigateToDaily={handleNavigateToDaily}
    />
  );

}
