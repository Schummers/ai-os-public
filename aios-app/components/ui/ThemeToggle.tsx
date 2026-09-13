"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";

type Theme = "light" | "dark";

const STORAGE_KEY = "aios-theme";

/**
 * Bascule dark / light.
 *
 * La classe de thème est posée sur `<html>` avant la première peinture par le
 * script d'amorçage de `app/layout.tsx` ; ce composant se contente de LIRE
 * l'état déjà en place au montage, puis de l'écrire. Il ne décide jamais du
 * thème initial — sinon le rendu serveur et le client divergeraient.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(next);
    root.style.colorScheme = next;
    // Garder la couleur de la barre système alignée sur le thème choisi (le
    // `themeColor` statique ne connaît que le défaut).
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "light" ? "#faf9f5" : "#1f1e1d");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // stockage indisponible (navigation privée) : la bascule reste valable
      // pour la session en cours, elle ne survit simplement pas au rechargement
    }
    setTheme(next);
  };

  return (
    <IconButton
      label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      onClick={toggle}
      className={className}
    >
      {/* Avant l'hydratation `theme` est null : on rend l'icône du défaut
          (dark) pour que le serveur et le client produisent le même HTML. */}
      <Icon icon={theme === "light" ? Moon : Sun} size={16} />
    </IconButton>
  );
}
