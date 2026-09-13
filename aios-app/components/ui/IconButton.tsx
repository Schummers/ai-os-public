import { cn } from "@/lib/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Libellé accessible (obligatoire : bouton icône sans texte). */
  label: string;
}

/**
 * Bouton icône rond du chrome (retour, rafraîchir, inbox, recherche).
 *
 * Matériau plein (`surface` + bordure) et non plus `.glass` : sur le fond
 * chaud et peu contrasté de l'app, le verre ne se détachait pas du fond et les
 * boutons de la barre supérieure se lisaient comme de simples icônes posées,
 * sans cible cliquable perceptible. La bordure EST l'affordance.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "press inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border bg-surface text-text-secondary",
        "transition-colors duration-fast",
        "hover-supported:border-border-strong hover-supported:bg-surface-2 hover-supported:text-text-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = "IconButton";
