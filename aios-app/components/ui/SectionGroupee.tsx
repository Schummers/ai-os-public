import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * En-tête + wrapper d'un groupe de rows/cards (mois, source…). `premier`
 * (i === 0) : pas de séparateur, moins d'espace au-dessus du label (juste
 * sous la barre de filtres) ; sinon `mt-md`/`pt-md` (24px) de part et
 * d'autre du filet séparateur.
 */
export function SectionGroupee({
  label,
  droite,
  premier,
  children,
}: {
  label: string;
  droite?: ReactNode;
  premier?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(!premier && "mt-md border-t border-border")}>
      <div className={cn("flex items-center justify-between px-container pb-xs", premier ? "pt-sm" : "pt-md")}>
        <span className="text-eyebrow">{label}</span>
        {droite}
      </div>
      {children}
    </div>
  );
}
