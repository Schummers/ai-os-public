import { cn } from "@/lib/cn";
import { Check, ChevronDown } from "lucide-react";
import { Icon } from "./Icon";

interface FilterPillProps {
  label: string;
  /** Actif = pill pleine (fond inversé) ; inactif = pill bordée sur `surface`. */
  active?: boolean;
  /** Affiche un chevron ▾ (pill scope de type « Biens ▾ »). */
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Pill de filtre rapide.
 *
 * Les deux états sont des pills VISIBLES : l'inactif est bordé sur `surface`,
 * l'actif est plein et porte une coche. Auparavant l'inactif n'était que du
 * texte gris — rien n'indiquait qu'on pouvait cliquer, et la rangée de filtres
 * se lisait comme une légende. Un filtre doit annoncer qu'il est un filtre
 * avant d'annoncer qu'il est actif.
 */
export function FilterPill({ label, active, chevron, onClick, className }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press flex shrink-0 items-center gap-2xs rounded-full border px-xs2 py-2xs2 text-caption font-medium transition-colors duration-fast",
        active
          ? "border-transparent bg-invert-bg text-invert-fg"
          : "border-border bg-surface text-text-secondary hover-supported:border-border-strong hover-supported:text-text-primary",
        className
      )}
    >
      {active && <Icon icon={Check} size={12} strokeWidth={3} />}
      {label}
      {chevron && <Icon icon={ChevronDown} size={14} />}
    </button>
  );
}
