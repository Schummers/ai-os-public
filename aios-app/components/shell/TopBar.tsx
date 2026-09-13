"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Search, RotateCw } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CountBadge } from "@/components/ui/CountBadge";
import { Icon } from "@/components/ui/Icon";

interface TopBarProps {
  activeView: "daily" | "global";
  onChangeView: (view: "daily" | "global") => void;
  unprocessedInboxCount: number;
}

/**
 * Barre supérieure du chrome, identique entre Daily et Global : bascule de
 * vue, rafraîchir, thème, inbox, recherche. Auparavant dupliquée à l'identique
 * dans `DailyView` et `GlobalProjectsView` (voir ticket 31).
 */
export function TopBar({ activeView, onChangeView, unprocessedInboxCount }: TopBarProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="chrome-overlay sticky top-0 z-20 h-topbar border-b border-border">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between gap-xs px-container">
        <SegmentedControl
          options={[
            { value: "daily", label: "Daily" },
            { value: "global", label: "Global" },
          ]}
          value={activeView}
          onChange={(val) => onChangeView(val as "daily" | "global")}
          aria-label="View"
        />

        <div className="flex items-center gap-2xs">
          <IconButton
            label="Refresh"
            onClick={handleRefresh}
            title="Reload the vault from disk"
          >
            <Icon
              icon={RotateCw}
              size={15}
              className={isRefreshing ? "animate-spin text-brand-text" : undefined}
            />
          </IconButton>

          <ThemeToggle />

          <IconButton
            label="Inbox"
            onClick={() => router.push("/inbox")}
            className="relative"
            title="Open the inbox"
          >
            <Icon icon={Inbox} size={16} />
            <CountBadge count={unprocessedInboxCount} />
          </IconButton>

          <IconButton
            label="Search"
            onClick={() => router.push("/search")}
            title="Global search"
          >
            <Icon icon={Search} size={16} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
