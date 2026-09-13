import { cn } from "@/lib/cn";

interface CountBadgeProps {
  count: number;
  className?: string;
}

/**
 * Pastille de compteur superposée à un bouton icône (inbox non traitée).
 *
 * Positionnée en absolu : le parent doit porter `relative`. Ne rend rien
 * quand le compteur est à zéro — un badge « 0 » est du bruit.
 *
 * Plafonnée à `99+`. Sans plafond, un compteur à trois chiffres élargit la
 * pastille jusqu'à couvrir son bouton, et la valeur exacte n'apporte rien :
 * au-delà de cent, le message est « beaucoup », pas « cent vingt-sept ».
 *
 * Existait en double, recopiée à l'identique dans la barre supérieure des
 * vues Daily et Global, avec des valeurs de taille en dur des deux côtés.
 */
export function CountBadge({ count, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        // Pas de hauteur fixe : la pastille est dimensionnée par son padding,
        // sinon le chiffre touche la bordure dès qu'on grossit le corps.
        "absolute -right-hair -top-hair flex min-w-badge items-center justify-center",
        "rounded-full bg-brand px-2xs py-hair text-nano text-fg-on-fill",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
