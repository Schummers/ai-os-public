import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface IconProps {
  icon: LucideIcon;
  /** Taille en px. Défaut 14 (contenu). */
  size?: number;
  /** Épaisseur du trait. Défaut 2.1, surchargeable au cas par cas. */
  strokeWidth?: number;
  className?: string;
}

/**
 * Wrapper Lucide unique du design system : verrouille le trait à 2.1 par
 * défaut, surchargeable via la prop `strokeWidth`. Toujours passer par ce
 * composant, jamais par une icône lucide-react nue.
 */
export function Icon({ icon: LucideGlyph, size = 14, strokeWidth = 2.1, className }: IconProps) {
  return <LucideGlyph size={size} strokeWidth={strokeWidth} className={cn("shrink-0", className)} aria-hidden />;
}
