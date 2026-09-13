import { Lock, Triangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Méta-état d'un objet (tâche, projet, contenu), mappé sur les tokens
 * `--status-*`. `progress` est réservé aux futurs usages : aucun statut
 * actuel ne s'y mappe forcément.
 */
export type MiniStatusKind = "neutral" | "progress" | "done" | "blocked" | "locked";

interface MiniStatusProps {
  /**
   * neutral = anneau gris (repos par design) · progress = disque bleu (en
   * cours) · done = disque gris plein (fait) · blocked = triangle arrondi
   * rouge (anomalie) · locked = cadenas gris (validée + immuable).
   */
  status: MiniStatusKind;
  className?: string;
}

/**
 * Pastille de statut façon Linear : la FORME porte le sens autant que la
 * couleur (anneau vs disque vs triangle vs cadenas — lisible sans percevoir
 * les couleurs). Disques/anneau : 6px CSS pur (inset 1.25px pour l'anneau).
 * Triangle/cadenas : glyphes lucide via `Icon` en 12px. Couleurs via les CSS
 * vars `--status-*` uniquement.
 */
export function MiniStatus({ status, className }: MiniStatusProps) {
  if (status === "blocked" || status === "locked") {
    const glyph = status === "blocked" ? Triangle : Lock;
    const color = status === "blocked" ? "var(--status-blocked)" : "var(--status-neutral)";
    return (
      <span aria-hidden className={cn("inline-flex shrink-0", className)} style={{ color }}>
        <Icon icon={glyph} size={12} className={status === "blocked" ? "fill-current" : undefined} />
      </span>
    );
  }
  const filled = status !== "neutral";
  const color = `var(--status-${status})`;
  return (
    <span
      aria-hidden
      className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", className)}
      style={filled ? { backgroundColor: color } : { boxShadow: `inset 0 0 0 1.25px ${color}` }}
    />
  );
}
