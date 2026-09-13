import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface ActiveFilterRowProps {
  /** Label du type (« Type », « Statut », …), NON cliquable, secondary. */
  label: string;
  /** Pills des valeurs actives (RemovablePill), wrappées sur plusieurs lignes. */
  children: ReactNode;
  /** Supprime toutes les valeurs de ce type (croix de groupe à droite). */
  onClearGroup: () => void;
  className?: string;
}

/**
 * Row de la zone « Filtres actifs » : `Label   [pills ✕…]   ✕groupe`. Le label
 * est non cliquable ; les pills valeurs **wrappent sur plusieurs lignes** (jamais
 * de crop ni de scroll horizontal : un filtre invisible est un piège). La croix
 * de groupe supprime tout le type.
 */
export function ActiveFilterRow({ label, children, onClearGroup, className }: ActiveFilterRowProps) {
  return (
    <div className={cn("flex items-start gap-sm px-sm py-xs", className)}>
      <span className="w-16 shrink-0 pt-2xs text-body-sm text-text-secondary">{label}</span>
      <span className="flex flex-1 flex-wrap gap-2xs">{children}</span>
      <button
        type="button"
        aria-label={`Retirer tous les filtres ${label}`}
        onClick={onClearGroup}
        className="press shrink-0 p-2xs text-text-tertiary"
      >
        <Icon icon={X} size={14} />
      </button>
    </div>
  );
}
