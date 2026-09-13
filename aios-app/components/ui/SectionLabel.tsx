import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface SectionLabelProps {
  label: string;
  /** Glyphe optionnel devant le libellé. */
  icon?: LucideIcon;
  /** Contenu aligné à droite (compteur, total…). */
  meta?: ReactNode;
  className?: string;
}

/**
 * En-tête d'une section de la vue Daily.
 *
 * Existe pour tenir le rythme vertical : chaque section répétait sa propre
 * combinaison de `py-xs`, `pb-2xs` et `mt-1`, ce qui donnait des écarts
 * différents d'une section à l'autre. L'écart en-tête → contenu est fixé ici,
 * une seule fois (`mb-xs`, 8px) ; l'écart entre sections est porté par le
 * `space-y-*` du conteneur, jamais par les sections elles-mêmes.
 */
export function SectionLabel({ label, icon, meta, className }: SectionLabelProps) {
  return (
    <div className={cn("mb-xs flex items-center justify-between gap-xs", className)}>
      <span className="text-eyebrow flex items-center gap-2xs text-text-secondary">
        {icon && <Icon icon={icon} size={12} />}
        {label}
      </span>
      {meta && <span className="text-caption text-text-tertiary shrink-0">{meta}</span>}
    </div>
  );
}
