"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";

export type RowStatus = "todo" | "backlog" | "progress" | "done" | "canceled";

/**
 * Cercle d'état façon Linear (contenu, pas chrome): anneau gris (todo),
 * pointillé (backlog), demi-disque bleu (en cours), disque + coche
 * (terminé), disque gris + croix (annulé). Couleurs via les tokens --status-*.
 */
export function StatusCircle({ status = "todo", size = 20 }: { status?: RowStatus; size?: number }) {
  const r = size / 2 - 1.5;
  const c = size / 2;
  if (status === "done" || status === "canceled") {
    const IconGlyph = status === "done" ? Check : X;
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: status === "done" ? "var(--status-done)" : "var(--status-neutral)",
          color: "var(--avatar-fg)",
        }}
        aria-hidden
      >
        <IconGlyph size={size * 0.6} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        strokeWidth="1.75"
        stroke={status === "progress" ? "var(--status-progress)" : "var(--status-neutral)"}
        strokeDasharray={status === "backlog" ? "2.5 3" : undefined}
        opacity={status === "todo" ? 0.75 : 1}
      />
      {status === "progress" && (
        <path
          d={`M ${c} ${c - r + 3} A ${r - 3} ${r - 3} 0 0 1 ${c} ${c + r - 3} Z`}
          fill="var(--status-progress)"
        />
      )}
    </svg>
  );
}

/** Pastille avatar (initiales) à droite des rangées, façon Linear. */
export function Avatar({ initials, size = 26 }: { initials: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--avatar)",
        color: "var(--avatar-fg)",
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

interface ListRowProps {
  status?: RowStatus;
  title: string;
  /** Élément de droite (Avatar, montant, chevron...). */
  trailing?: ReactNode;
  onClick?: () => void;
  /** Drill-down vers une route : rendu en `<Link>` (prefetch) au lieu d'un `<button onClick>`. */
  href?: string;
  className?: string;
}

/**
 * Rangée de liste Linear: plate, SANS filet, hauteur ~52px, titre tronqué sur
 * une ligne. Le rythme vient du spacing seul.
 */
export function ListRow({ status, title, trailing, onClick, href, className }: ListRowProps) {
  const rowClassName = cn(
    "flex h-13 w-full items-center gap-sm px-container text-left",
    "hover-supported:bg-glass-active",
    className
  );
  const content = (
    <>
      {status && <StatusCircle status={status} />}
      <span className="flex-1 truncate text-body text-text-primary">{title}</span>
      {trailing}
    </>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={rowClassName}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={rowClassName}>
      {content}
    </button>
  );
}
