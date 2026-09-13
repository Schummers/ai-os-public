import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface ContextMenuProps {
  /** Fermeture au tap sur le backdrop invisible. */
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Menu contextuel flottant `.glass` `rounded-xl` `w-72`, posé PAR-DESSUS la
 * capsule d'actions top-right qu'il recouvre (pattern Linear) : top aligné sur
 * le haut de la capsule (`top-safe-sm`, même référence que les headers
 * d'écran), bord droit sur la gouttière (`right-container`). Rows `MenuRow`
 * séparées par `divide-y`. Backdrop invisible qui ferme.
 * Se positionne en `absolute` : le parent doit être `relative`.
 */
export function ContextMenu({ onClose, children, className }: ContextMenuProps) {
  return (
    <div className="absolute inset-0 z-30">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0" />
      <div
        className={cn(
          "glass right-container top-safe-sm absolute flex w-72 flex-col divide-y divide-border overflow-hidden rounded-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface MenuRowProps {
  /** Icône (slot 24px). Passer un `<Icon .../>`. */
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  /** Action destructive : texte `text-danger`. */
  danger?: boolean;
  /** Atténuée (indisponible / futur) : opacité réduite. */
  dim?: boolean;
  /** Chevron de drill-down à droite (ex. sous-menu). */
  chevron?: boolean;
  className?: string;
}

/** Row 48px d'un ContextMenu : icône + label, prop `danger` (rouge) et `dim` (atténuée). */
export function MenuRow({ icon, label, onClick, danger, dim, chevron, className }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press flex h-12 w-full items-center gap-sm px-sm text-left text-body hover-supported:bg-glass-active",
        danger ? "text-danger" : "text-text-primary",
        dim && "opacity-50",
        className
      )}
    >
      {icon && (
        <span className={cn("flex w-6 shrink-0 justify-center", danger ? "text-danger" : "text-text-secondary")}>{icon}</span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {chevron && <Icon icon={ChevronRight} size={14} className="shrink-0 text-text-tertiary" />}
    </button>
  );
}
