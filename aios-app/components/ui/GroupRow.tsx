import { cn } from "@/lib/cn";
import { Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

interface GroupRowProps {
  /** Icône optionnelle (slot 24px, `text-secondary`). Passer un `<Icon .../>`. */
  icon?: ReactNode;
  label: string;
  /** Drill-down : valeur affichée à droite + chevron. Exclusif avec `children`/`checked`. */
  value?: string;
  /** Badge secondaire à droite de la valeur. */
  badge?: string;
  /** Multi-select : coche à droite si sélectionné. */
  checked?: boolean;
  /** Chips inline (ChipToggle) rendues à droite dans la row. Exclusif avec `value`. */
  children?: ReactNode;
  /** Contenu de droite libre (remplace value/checked/children). */
  trailing?: ReactNode;
  /** Verrouillée : plus de chevron, opacité réduite, non cliquable. */
  locked?: boolean;
  /** Filtre actif : label semibold + valeur en primary (sélection monochrome). */
  active?: boolean;
  /**
   * Hiérarchie visuelle label/valeur. `"label"` (défaut) : label primary,
   * valeur secondary — comportement historique. `"value"` : inversion façon
   * Linear — label `text-label` 13px/500/secondary, valeur `text-body-sm`
   * 13px/600, colorée selon éditabilité : `text-primary` si la row est
   * éditable, `text-secondary` si `locked`. `"toggle"` : row dont le label
   * EST le contenu (pas de valeur, juste un Switch) — label 13px
   * (`text-body-sm`) medium secondary.
   */
  hierarchy?: "label" | "value" | "toggle";
  onClick?: () => void;
  /** Drill-down vers une route : rendu en `<Link>` au lieu d'un `<button onClick>`. Exclusif avec `onClick`. */
  href?: string;
  className?: string;
}

/**
 * Row de carte groupée (min 48px) : icône · label · puis au choix value+chevron
 * (drill-down), checked (multi-select), children (chips inline) ou trailing libre.
 * `locked` retire l'affordance ; `active` passe le label en semibold (filtre actif).
 */
export function GroupRow({
  icon,
  label,
  value,
  badge,
  checked,
  children,
  trailing,
  locked,
  active,
  hierarchy = "label",
  onClick,
  href,
  className,
}: GroupRowProps) {
  const detailTypo = hierarchy === "value";
  const toggleTypo = hierarchy === "toggle";

  const body = (
    <>
      {icon && <span className="flex w-6 shrink-0 justify-center text-text-secondary">{icon}</span>}
      <span
        className={cn(
          // Un libellé trop long ne doit jamais faire scroller la Feuille
          // horizontalement. `min-w-0 truncate` laisse le label prendre sa
          // taille naturelle quand la place suffit, et tronquer sinon.
          "min-w-0 truncate",
          toggleTypo
            ? "text-body-sm font-medium text-text-secondary"
            : detailTypo
              ? "text-label text-text-secondary"
              : "text-body text-text-primary",
          active && "font-semibold"
        )}
      >
        {label}
      </span>
      {trailing ? (
        <span className="ml-auto flex min-w-0 items-center gap-2xs">{trailing}</span>
      ) : children ? (
        <span className="ml-auto flex items-center gap-2xs">{children}</span>
      ) : (
        <span className="ml-auto flex min-w-0 items-center gap-2xs">
          {value !== undefined && (
            <span
              className={cn(
                "truncate text-body-sm",
                active
                  ? "font-semibold text-text-primary"
                  : detailTypo
                    ? cn("font-semibold", locked ? "text-text-secondary" : "text-text-primary")
                    : "text-text-secondary"
              )}
            >
              {value}
            </span>
          )}
          {badge && (
            <span className="shrink-0 rounded-full bg-glass-active px-xs py-2xs text-caption text-text-secondary">{badge}</span>
          )}
          {checked && <Icon icon={Check} size={14} className="shrink-0 text-text-primary" />}
          {!locked && !checked && value !== undefined && (
            <Icon icon={ChevronRight} size={11} className="shrink-0 text-text-tertiary" />
          )}
        </span>
      )}
    </>
  );

  const base = cn("flex min-h-12 w-full items-center px-sm text-left", detailTypo ? "gap-2xs" : "gap-sm");

  if (locked) return <div className={cn(base, "opacity-80", className)}>{body}</div>;
  // Une row sans gestionnaire n'est pas un bouton. La rendre en `<button>`
  // produisait un bouton inerte, et surtout un `<button>` DANS un `<button>`
  // dès que le contenu de droite est lui-même interactif (un `ChipToggle`
  // passé en `trailing`) : imbrication invalide en HTML, qui fait échouer
  // l'hydratation React. Le cas `children` était déjà traité, le cas
  // `trailing` ne l'était pas.
  if (!onClick && !href) {
    return (
      <div className={cn(base, (children || trailing) && "py-xs", className)}>{body}</div>
    );
  }
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn(base, className)}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn(base, className)}>
      {body}
    </button>
  );
}
