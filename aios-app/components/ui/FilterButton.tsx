import { cn } from "@/lib/cn";
import { ListFilter } from "lucide-react";
import { Icon } from "./Icon";

interface FilterButtonProps {
  /** Nombre de filtres sheet actifs : 0 = pill nue (icône) ; > 0 = pill `⚏ n`. */
  count: number;
  onClick: () => void;
  className?: string;
}

/**
 * Bouton d'ouverture de la sheet de filtres.
 *
 * Même matériau que `FilterPill` (bordure sur `surface`), pour que la rangée
 * de filtres se lise comme un seul groupe de contrôles. Le compteur passe la
 * pill en accent dès qu'un filtre secondaire est posé.
 */
export function FilterButton({ count, onClick, className }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-label="Filters"
      onClick={onClick}
      className={cn(
        // Géométrie constante repos/actif (alignée sur FilterPill) : le bouton
        // ne « saute » pas en s'activant.
        "press flex shrink-0 items-center gap-2xs rounded-full border px-xs2 py-2xs2 transition-colors duration-fast",
        count > 0
          ? "border-brand/40 bg-brand/10 font-semibold text-brand-text"
          : "border-border bg-surface text-text-secondary hover-supported:border-border-strong hover-supported:text-text-primary",
        className
      )}
    >
      <Icon icon={ListFilter} size={14} />
      {count > 0 && <span className="text-caption tabular-nums">{count}</span>}
    </button>
  );
}
