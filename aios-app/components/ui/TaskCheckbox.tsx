"use client";

import { Check, Minus, X } from "lucide-react";
import type { TaskStatus } from "@/lib/vault/types";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface TaskCheckboxProps {
  status: TaskStatus;
  onToggle: (e: React.MouseEvent) => void;
  /** Libellé accessible — le nom de la tâche. */
  taskName: string;
  className?: string;
}

/**
 * Case à cocher d'une tâche, à trois états (`todo` → `doing` → `done`).
 *
 * Les glyphes texte `✓` et `●` de la version précédente rendaient mal : taille
 * héritée de la police, centrage optique faux, poids incohérent. On passe sur
 * les icônes du jeu déjà utilisé partout ailleurs (lucide), dessinées à la
 * bonne taille et centrées géométriquement.
 *
 * `doing` porte un tiret plutôt qu'un point : c'est la convention
 * « indéterminé » d'une case à cocher, mais elle ne se lisait pas sans
 * légende (l'utilisateur a dû déduire la convention à l'usage — ticket 32).
 * `dropped` partageait la coche de `done` : même correctif, une croix la
 * distingue maintenant. Le `title` natif donne le mot en toutes lettres au
 * survol, sans redessiner la case pour les quatre états à la fois. */
const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  doing: "In progress",
  done: "Done",
  dropped: "Dropped",
};

export function TaskCheckbox({ status, onToggle, taskName, className }: TaskCheckboxProps) {
  const isDone = status === "done";
  const isDropped = status === "dropped";
  const isDoing = status === "doing";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isDone || isDropped ? true : isDoing ? "mixed" : false}
      aria-label={`Change status of ${taskName}`}
      title={STATUS_LABEL[status]}
      onClick={onToggle}
      className={cn(
        // `rounded-xs` (5px) et non `rounded-md` : sur une boîte de 18px, un
        // rayon de 8px produit un cercle, qui se lit comme un bouton radio
        // (choix exclusif) et non comme une case à cocher.
        "press flex h-control-sm w-control-sm shrink-0 items-center justify-center rounded-xs border transition-colors duration-fast",
        isDone && "border-status-done bg-status-done text-bg",
        isDropped && "border-text-tertiary bg-text-tertiary text-bg",
        isDoing && "border-brand bg-brand/15 text-brand-text",
        !isDone &&
          !isDropped &&
          !isDoing &&
          "border-border-strong bg-transparent text-transparent hover-supported:border-brand",
        className
      )}
    >
      {isDone && <Icon icon={Check} size={12} strokeWidth={3} />}
      {isDropped && <Icon icon={X} size={12} strokeWidth={3} />}
      {isDoing && <Icon icon={Minus} size={12} strokeWidth={3} />}
    </button>
  );
}
