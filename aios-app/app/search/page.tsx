import { resolveVaultPath } from "@/lib/vault/config";
import { performSearch } from "@/lib/vault/search";
import { SearchView } from "./SearchView";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; fullText?: string }>;
}) {
  const { q = "", fullText = "false" } = await searchParams;
  const vaultPath = resolveVaultPath();
  const initialResults = performSearch(vaultPath, q, { fullText: fullText === "true" });

  return <SearchView initialResults={initialResults} initialQuery={q} initialFullText={fullText === "true"} />;
}
