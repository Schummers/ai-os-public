// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { GroupRow } from "./GroupRow";

afterEach(cleanup);

describe("GroupRow — hiérarchie label/valeur", () => {
  it("défaut : label en primary, valeur en secondary (comportement historique inchangé)", () => {
    render(<GroupRow label="Fournisseur" value="ACME Toiture" />);
    const label = screen.getByText("Fournisseur");
    const valeur = screen.getByText("ACME Toiture");
    expect(label.className).toContain("text-text-primary");
    expect(label.className).not.toContain("text-text-secondary");
    expect(valeur.className).toContain("text-text-secondary");
    expect(valeur.className).not.toContain("text-text-primary");
  });

  it("hierarchy=\"value\" : label en secondary, valeur en primary (pattern Linear, hero)", () => {
    render(<GroupRow label="Fournisseur" value="ACME Toiture" hierarchy="value" />);
    const label = screen.getByText("Fournisseur");
    const valeur = screen.getByText("ACME Toiture");
    expect(label.className).toContain("text-text-secondary");
    expect(label.className).not.toContain("text-text-primary");
    expect(valeur.className).toContain("text-text-primary");
    expect(valeur.className).not.toContain("text-text-secondary");
  });
});

describe("GroupRow — typo/spacing détail", () => {
  it("hierarchy=\"value\" (écrans détail) : label text-label 13/500, valeur text-body-sm 600, gap icône 8px", () => {
    render(
      <GroupRow icon={<span data-testid="icon" />} label="Fournisseur" value="ACME Toiture" hierarchy="value" />
    );
    const label = screen.getByText("Fournisseur");
    const valeur = screen.getByText("ACME Toiture");
    expect(label.className).toContain("text-label");
    expect(label.className).not.toContain("text-caption");
    expect(label.className).not.toContain("text-body ");
    expect(valeur.className).toContain("text-body-sm");
    expect(valeur.className).toContain("font-semibold");

    const row = screen.getByTestId("icon").closest("button, div")!;
    expect(row.className).toContain("gap-2xs");
    expect(row.className).not.toContain("gap-sm");
  });

  it("hierarchy=\"value\" + locked : valeur read-only en secondary (fiscalité dérivée)", () => {
    render(<GroupRow label="Devise" value="EUR" locked hierarchy="value" />);
    const valeur = screen.getByText("EUR");
    expect(valeur.className).toContain("text-text-secondary");
    expect(valeur.className).not.toContain("text-text-primary");
  });

  it("hierarchy=\"label\" (défaut, écrans non-détail) : gap icône historique inchangé", () => {
    render(<GroupRow icon={<span data-testid="icon" />} label="Fournisseur" value="ACME Toiture" />);
    const row = screen.getByTestId("icon").closest("button, div")!;
    expect(row.className).toContain("gap-sm");
    expect(row.className).not.toContain("gap-2xs");
  });
});

describe("GroupRow — libellé long ne fait jamais déborder la row", () => {
  it("le label tronque (min-w-0 + truncate) au lieu de forcer un débordement (shrink-0 banni)", () => {
    const long = "Compte courant Schummers-Hellers (13 rue Bechel)";
    render(<GroupRow label={long} />);
    const label = screen.getByText(long);
    expect(label.className).toContain("truncate");
    expect(label.className).toContain("min-w-0");
    expect(label.className).not.toContain("shrink-0");
  });
});
