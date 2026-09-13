"use client";

import { ChevronLeft } from "lucide-react";
import { useState, type ReactNode, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

/**
 * Latence du fondu : les 44 premiers px de défilement pendant lesquels le
 * bloc titre du hero est encore visible sous le voile, donc le titre compact
 * reste totalement transparent.
 */
const TITRE_COMPACT_LATENCE_PX = 44;
/** Longueur de la rampe d'opacité 0 → 1, une fois la latence consommée. */
const TITRE_COMPACT_RAMPE_PX = 44;
/** Défilement à partir duquel le titre compact est pleinement opaque (entête « repliée »). */
export const DETAIL_HEADER_REPLIE_PX = TITRE_COMPACT_LATENCE_PX + TITRE_COMPACT_RAMPE_PX;

interface DetailHeaderProps {
  /** Eyebrow du titre compact (« Projet », « Tâche »…). */
  eyebrow: string;
  /** Libellé du titre compact, tronqué sur une ligne. */
  titre: string;
  /**
   * Emplacement à droite de la barre : capsule d'actions ou bouton d'options.
   * Absent quand l'écran n'a rien d'actionnable dans cet état, la barre garde
   * alors le seul chevron de retour.
   */
  actions?: ReactNode;
  /**
   * Classes ajoutées au conteneur défilant, en plus de son socle
   * (`scroll-fade pt-detail-header flex flex-1 flex-col overflow-y-auto`).
   * Sert au padding bas, qui varie selon le chrome bas de l'écran.
   */
  contentClassName?: string;
  /**
   * Ref imposée sur le conteneur défilant, en plus de son `onScroll` interne.
   * Sert aux appelants qui doivent piloter le scroll de l'extérieur.
   */
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  /** Notifie la position de scroll à chaque défilement, en plus du fondu interne. */
  onScrollTop?: (scrollTop: number) => void;
  children: ReactNode;
}

/**
 * Entête des écrans de détail : barre superposée (chevron de retour + titre
 * compact fondu au défilement + emplacement d'actions), voile haut, et
 * conteneur défilant qui porte l'état de défilement alimentant le fondu.
 *
 * Rendu en fragment, sans conteneur englobant : la barre est en `absolute`
 * dans le `relative` du parent, et le conteneur défilant reste un enfant
 * flex direct de l'écran. Un écran qui a besoin de peindre du chrome bas hors
 * du scroll (sticky, voile bas) monte son noeud frère APRÈS ce composant, pas
 * dedans : un ancêtre `overflow` non-`visible` clippe tout descendant, y
 * compris un `position: absolute` dont le containing block est plus haut.
 */
export function DetailHeader({
  eyebrow,
  titre,
  actions,
  contentClassName,
  scrollContainerRef,
  onScrollTop,
  children,
}: DetailHeaderProps) {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const titreCompactOpacity = Math.min(
    1,
    Math.max(0, (scrollY - TITRE_COMPACT_LATENCE_PX) / TITRE_COMPACT_RAMPE_PX)
  );

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-sm px-container pb-xs pt-safe-sm">
          <IconButton label="Back" onClick={() => router.back()}>
            <Icon icon={ChevronLeft} size={14} />
          </IconButton>
          <div
            className="flex min-w-0 flex-1 flex-col justify-center"
            style={{ opacity: titreCompactOpacity }}
            aria-hidden={titreCompactOpacity === 0}
          >
            {titreCompactOpacity > 0 && (
              <>
                <span className="text-eyebrow">{eyebrow}</span>
                <span className="truncate text-sm font-semibold text-text-primary">{titre}</span>
              </>
            )}
          </div>
          {actions}
        </div>
      </div>
      <div className="top-veil" />

      <div
        ref={scrollContainerRef}
        className={cn("scroll-fade pt-detail-header flex flex-1 flex-col overflow-y-auto", contentClassName)}
        onScroll={(e) => {
          setScrollY(e.currentTarget.scrollTop);
          onScrollTop?.(e.currentTarget.scrollTop);
        }}
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}

