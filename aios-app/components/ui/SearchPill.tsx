"use client";

import { cn } from "@/lib/cn";
import { Search, X } from "lucide-react";
import type { KeyboardEvent, Ref } from "react";
import { useRef } from "react";
import { Icon } from "./Icon";

interface SearchPillProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder (tertiary). Défaut « Search… ». */
  placeholder?: string;
  className?: string;
  /**
   * `"sheet"` (défaut) : pill `bg-surface-2` posée sur une Sheet plate (page
   * recherche, ancien usage). `"glass"` : matériau `.glass` — picker-recherche
   * sticky en haut d'une Feuille : un seul composant de search dans l'app, la
   * variante porte la seule différence visuelle.
   */
  variant?: "sheet" | "glass";
  /** Focus auto au montage (écran de recherche globale). */
  autoFocus?: boolean;
  /** Ref sur l'input (blur au scroll, etc.). */
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Libellé de la touche entrée du clavier virtuel (`"search"` sur l'écran recherche). */
  enterKeyHint?: "search" | "enter" | "done" | "go";
  /** Affiche une croix d'effacement à droite quand le champ n'est pas vide (efface le texte, garde le focus). */
  clearable?: boolean;
}

/**
 * Input search contrôlé façon Linear : icône `Search` tertiary, placeholder
 * tertiary. `variant="sheet"` = pill `bg-surface-2` (un cran au-dessus de la
 * carte) ; `variant="glass"` = matériau `.glass` (picker-recherche sticky).
 */
export function SearchPill({
  value,
  onChange,
  placeholder = "Search…",
  className,
  variant = "sheet",
  autoFocus,
  inputRef,
  onKeyDown,
  enterKeyHint,
  clearable,
}: SearchPillProps) {
  // Ref interne (focus après clear) fusionnée avec `inputRef` transmis.
  const localRef = useRef<HTMLInputElement>(null);
  const setRef = (el: HTMLInputElement | null) => {
    localRef.current = el;
    if (typeof inputRef === "function") inputRef(el);
    else if (inputRef) (inputRef as { current: HTMLInputElement | null }).current = el;
  };

  return (
    <div className={cn("flex items-center gap-xs rounded-full px-sm py-xs", variant === "glass" ? "glass" : "bg-surface-2", className)}>
      <Icon icon={Search} size={14} className="text-text-tertiary" />
      <input
        ref={setRef}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        enterKeyHint={enterKeyHint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-tertiary"
      />
      {clearable && value.length > 0 && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            onChange("");
            localRef.current?.focus();
          }}
          className="press shrink-0 text-text-tertiary hover-supported:text-text-primary"
        >
          <Icon icon={X} size={14} />
        </button>
      )}
    </div>
  );
}
