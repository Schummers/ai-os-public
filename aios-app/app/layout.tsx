import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIOS App",
};

// Dark reste le DÉFAUT (contexte d'usage réel : le panneau droit de Claude
// Code, sombre), mais le choix est désormais persistable — voir ThemeToggle et
// le script d'amorçage ci-dessous.
// themeColor est un hex en dur car l'API Metadata de Next.js ne peut pas
// consommer une CSS var (elle sort en meta tag, hors du CSS) ; valeur alignée
// sur --bg du mode dark dans app/globals.css. Même exception chez DS-source.
// Une seule valeur, celle du thème par DÉFAUT (sombre). Piloter `themeColor`
// par `prefers-color-scheme` serait faux : le thème de l'app est un choix
// explicite persisté, pas une préférence système, donc un thème forcé en clair
// sous un OS sombre affichait une barre sombre. Le script d'amorçage
// ci-dessous corrige la valeur au runtime, où le choix réel est connu.
export const viewport: Viewport = {
  themeColor: "#1f1e1d",
};

// Pose la classe de thème sur <html> AVANT la première peinture, sinon la page
// s'affiche une frame dans le thème par défaut puis saute (flash). Ce script
// est volontairement inline et synchrone : un effet React s'exécuterait trop
// tard. Il ne lit que localStorage, aucune donnée sensible.
const THEME_BOOTSTRAP = `
(function () {
  try {
    var stored = localStorage.getItem('aios-theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#faf9f5' : '#1f1e1d');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="bg-bg text-text-primary font-body antialiased">{children}</body>
    </html>
  );
}
