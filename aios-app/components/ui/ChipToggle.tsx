import { cn } from "@/lib/cn";

interface ChipToggleProps {
  label: string;
  /** État ON (sélectionné) : fond inversé + semibold ; OFF : verre discret. */
  on: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Chip toggle inline (Type/Statut d'une row de filtre) : ON = `bg-invert-bg`
 * `text-invert-fg` semibold ; OFF = `bg-glass-active text-text-secondary` medium.
 */
export function ChipToggle({ label, on, onToggle, className }: ChipToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={cn(
        "press rounded-full px-sm py-2xs text-body-sm transition-colors duration-fast",
        on ? "bg-invert-bg font-semibold text-invert-fg" : "bg-glass-active font-medium text-text-secondary",
        className
      )}
    >
      {label}
    </button>
  );
}
