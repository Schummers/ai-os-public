"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface SectionHeaderProps {
  label: string;
  onAdd?: () => void;
  className?: string;
}

/** En-tête de section de liste ("Todo", "Done"): label gris 13px + "+" discret à droite. */
export function SectionHeader({ label, onAdd, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-container pb-2xs pt-sm", className)}>
      <span className="text-eyebrow">{label}</span>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add to ${label}`}
          className="press rounded-md p-2xs text-text-secondary hover-supported:text-text-primary"
        >
          <Icon icon={Plus} size={14} />
        </button>
      )}
    </div>
  );
}
