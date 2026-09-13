import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Les classes typo custom (text-hero, text-body-lg, ...) définies dans
// globals.css portent le préfixe `text-`. Sans config, tailwind-merge les
// range dans le même groupe que les couleurs de texte (text-text-primary,
// text-brand-text, ...) et en supprime une des deux. On les déclare comme
// groupe `font-size` : elles ne rentrent plus en conflit qu'entre elles,
// jamais avec une couleur de texte. Repris tel quel de DS-source (lib/cn.ts).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          // `micro` et `nano` manquaient à l'appel : partout où ils
          // côtoyaient une couleur (`text-fg-on-fill` sur la pastille de
          // compteur), tailwind-merge en supprimait un des deux, sans bruit.
          text: ["hero", "h1", "h2", "h3", "h4", "body-lg", "body", "body-sm", "label", "caption", "eyebrow", "micro", "nano"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
