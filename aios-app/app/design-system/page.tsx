"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import type { TaskStatus } from "@/lib/vault/types";
import { cn } from "@/lib/cn";
import { TaskCheckbox } from "@/components/ui/TaskCheckbox";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CountBadge } from "@/components/ui/CountBadge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { FilterPill } from "@/components/ui/FilterPill";
import { FilterButton } from "@/components/ui/FilterButton";
import { ActiveFilterRow } from "@/components/ui/ActiveFilterRow";
import { SearchPill } from "@/components/ui/SearchPill";
import { ListRow } from "@/components/ui/ListRow";
import { GroupRow } from "@/components/ui/GroupRow";
import { SectionGroupee } from "@/components/ui/SectionGroupee";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MiniStatus } from "@/components/ui/MiniStatus";
import { Card } from "@/components/ui/Card";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { ContextMenu, MenuRow } from "@/components/ui/ContextMenu";
import { Icon } from "@/components/ui/Icon";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2xl">
      <h2 className="mb-sm text-h4">{title}</h2>
      <div className="flex flex-col gap-sm">{children}</div>
    </section>
  );
}

/**
 * Nuancier. Chaque pastille lit le token VIF depuis le CSS calculé, plutôt
 * que de réciter une valeur en dur : la page ne peut donc pas mentir sur ce
 * que l'app applique réellement, et elle suit la bascule sombre/clair.
 */
function Swatch({ token, note }: { token: string; note: string }) {
  const [value, setValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  // `token` en dépendance, et non un effet sans tableau : sans lui l'effet
  // se rejouait à chaque rendu et son `setValue` provoquait le rendu suivant.
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).backgroundColor);
  }, [token]);

  return (
    <div className="flex items-center gap-xs">
      <div
        ref={ref}
        style={{ backgroundColor: `var(--${token})` }}
        className="h-lg w-lg shrink-0 rounded-md border border-border"
      />
      <div className="min-w-0">
        <div className="truncate text-body-sm font-medium text-text-primary">--{token}</div>
        <div className="truncate text-caption text-text-tertiary">
          {value} · {note}
        </div>
      </div>
    </div>
  );
}

const PALETTE: Array<{ token: string; note: string }> = [
  { token: "bg", note: "page — bg-100 / bg-200" },
  { token: "surface", note: "card — bg-000 / bg-100" },
  { token: "surface-2", note: "rail, hover — bg-300 / bg-000" },
  { token: "border", note: "ink at 15%" },
  { token: "border-strong", note: "ink at 30%" },
  { token: "text-primary", note: "text-100" },
  { token: "text-secondary", note: "text-300" },
  { token: "text-tertiary", note: "text-500" },
  { token: "brand", note: "terracotta — brand-100" },
  { token: "brand-text", note: "brand on page background" },
  { token: "danger", note: "danger-100" },
  { token: "positive", note: "success" },
  { token: "warning", note: "outside the Claude palette" },
];

function ComponentsGallery() {
  const [segment, setSegment] = useState<"projects" | "content">("projects");
  const [checkboxStatus, setCheckboxStatus] = useState<TaskStatus>("todo");
  const [filterActive, setFilterActive] = useState(true);
  const [filterCount, setFilterCount] = useState(2);
  const [search, setSearch] = useState("");
  const [chipOn, setChipOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-container py-xl">
      <Section title="Palette — official Claude values">
        <p className="text-body-sm text-text-secondary">
          Extracted from the Claude desktop app bundle ({" "}
          <code>:root</code> and <code>.darkTheme</code> blocks). The
          original token name is shown under each swatch. Toggle the mode
          above to compare.
        </p>
        <div className="grid grid-cols-1 gap-xs sm:grid-cols-2">
          {PALETTE.map((entry) => (
            <Swatch key={entry.token} token={entry.token} note={entry.note} />
          ))}
        </div>
      </Section>

      <Section title="SegmentedControl">
        <SegmentedControl
          aria-label="View"
          value={segment}
          onChange={setSegment}
          withFilter
          onFilter={() => {}}
          options={[
            { value: "projects", label: "Projects" },
            { value: "content", label: "Content" },
          ]}
        />
      </Section>

      <Section title="FilterPill / FilterButton">
        <div className="flex items-center gap-xs">
          <FilterPill label="All" active={!filterActive} onClick={() => setFilterActive(false)} />
          <FilterPill label="Active" active={filterActive} onClick={() => setFilterActive(true)} chevron />
          <FilterButton count={filterCount} onClick={() => setFilterCount((c) => (c > 0 ? 0 : 2))} />
        </div>
      </Section>

      <Section title="ActiveFilterRow">
        <Card className="p-none">
          <ActiveFilterRow label="Status" onClearGroup={() => {}}>
            <ChipToggle label="On" on={chipOn} onToggle={() => setChipOn((v) => !v)} />
            <ChipToggle label="Ongoing" on={!chipOn} onToggle={() => setChipOn((v) => !v)} />
          </ActiveFilterRow>
        </Card>
      </Section>

      <Section title="SearchPill">
        <SearchPill value={search} onChange={setSearch} variant="sheet" clearable />
        <SearchPill value="" onChange={() => {}} variant="glass" placeholder="Search (glass)…" />
      </Section>

      <Section title="ListRow">
        <Card className="p-none">
          <ListRow status="progress" title="Write the agency goal note" trailing={<MiniStatus status="progress" />} />
          <ListRow status="done" title="LinkedIn positioning published" />
          <ListRow status="backlog" title="Audit the Totalenergies pipeline" />
        </Card>
      </Section>

      <Section title="GroupRow">
        <Card className="p-none">
          <GroupRow label="Goal" value="Full-time role Q3 2026" />
          <GroupRow label="Priority" value="P1" hierarchy="value" />
          <GroupRow label="Due" value="June 30, 2026" locked hierarchy="value" />
          <GroupRow label="Assist" hierarchy="toggle" trailing={<ChipToggle label="Active" on={chipOn} onToggle={() => setChipOn((v) => !v)} />} />
        </Card>
      </Section>

      <Section title="SectionGroupee / SectionHeader">
        <Card className="p-none">
          <SectionGroupee label="August 2026" premier>
            <ListRow status="todo" title="Follow up with DS-source on the CV" />
          </SectionGroupee>
        </Card>
        <Card className="p-none">
          <SectionHeader label="Today's focus" onAdd={() => {}} />
          <ListRow status="progress" title="Apply the positioning on LinkedIn" />
        </Card>
      </Section>

      <Section title="MiniStatus">
        <div className="flex items-center gap-md">
          <span className="flex items-center gap-2xs text-body-sm text-text-secondary">
            <MiniStatus status="neutral" /> neutral
          </span>
          <span className="flex items-center gap-2xs text-body-sm text-text-secondary">
            <MiniStatus status="progress" /> progress
          </span>
          <span className="flex items-center gap-2xs text-body-sm text-text-secondary">
            <MiniStatus status="done" /> done
          </span>
          <span className="flex items-center gap-2xs text-body-sm text-text-secondary">
            <MiniStatus status="blocked" /> blocked
          </span>
          <span className="flex items-center gap-2xs text-body-sm text-text-secondary">
            <MiniStatus status="locked" /> locked
          </span>
        </div>
      </Section>

      <Section title="Card">
        <Card>
          <p className="text-body text-text-primary">Card content, structural border, never a shadow.</p>
        </Card>
      </Section>

      <Section title="ChipToggle">
        <div className="flex items-center gap-xs">
          <ChipToggle label="On" on={chipOn} onToggle={() => setChipOn((v) => !v)} />
          <ChipToggle label="Off" on={!chipOn} onToggle={() => setChipOn((v) => !v)} />
        </div>
      </Section>

      <Section title="DetailHeader">
        <div className="relative h-64 overflow-hidden rounded-lg border border-border">
          <DetailHeader eyebrow="Project" titre="Product Designer repositioning" contentClassName="pb-lg">
            <div className="px-container pt-3xl">
              <p className="text-body text-text-primary">Scroll to see the compact title appear.</p>
              <div className="h-96" />
            </div>
          </DetailHeader>
        </div>
      </Section>

      <Section title="TaskCheckbox">
        <div className="flex items-center gap-sm">
          <TaskCheckbox
            status={checkboxStatus}
            taskName="Example"
            onToggle={() =>
              setCheckboxStatus((s) =>
                s === "todo" ? "doing" : s === "doing" ? "done" : "todo"
              )
            }
          />
          <span className="text-body-sm text-text-secondary">
            current state: <code>{checkboxStatus}</code> — click to cycle
            through it
          </span>
        </div>
      </Section>

      <Section title="SectionLabel">
        <SectionLabel label="Today's tasks" meta="12 tasks" />
      </Section>

      <Section title="CountBadge">
        <div className="flex items-center gap-sm">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface">
            <Icon icon={Star} size={16} />
            <CountBadge count={7} />
          </span>
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface">
            <Icon icon={Star} size={16} />
            <CountBadge count={127} />
          </span>
          <span className="text-body-sm text-text-secondary">
            renders nothing at zero
          </span>
        </div>
      </Section>

      <Section title="ContextMenu">
        <div className="relative h-40 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="press absolute right-sm top-sm rounded-full bg-surface-2 px-sm py-2xs text-body-sm text-text-primary"
          >
            Open the menu
          </button>
          {menuOpen && (
            <ContextMenu onClose={() => setMenuOpen(false)}>
              <MenuRow icon={<Icon icon={Star} />} label="Mark as focus" onClick={() => setMenuOpen(false)} />
              <MenuRow icon={<Icon icon={Trash2} />} label="Delete" danger onClick={() => setMenuOpen(false)} />
            </ContextMenu>
          )}
        </div>
      </Section>
    </div>
  );
}

export default function DesignSystemPage() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  return (
    <main className="min-h-dvh bg-bg text-text-primary">
      <div className="flex items-center justify-between border-b border-border px-container py-sm">
        <h1 className="text-h4">Design system — AIOS App</h1>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
          className="press rounded-full bg-surface-2 px-sm py-2xs text-body-sm text-text-primary"
        >
          Switch to {mode === "dark" ? "light" : "dark"}
        </button>
      </div>
      <div className={cn(mode === "light" && "light", "bg-bg text-text-primary")}>
        <ComponentsGallery />
      </div>
    </main>
  );
}
