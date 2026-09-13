import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    // Environnement Node par défaut (logique pure de `lib/`). Les tests de
    // rendu (RTL) déclarent `// @vitest-environment jsdom` en tête de
    // fichier ; c'est le commentaire qui bascule l'environnement, pas la
    // config globale, pour garder les tests logiques rapides en Node.
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
