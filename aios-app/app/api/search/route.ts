import { NextResponse } from "next/server";
import { resolveVaultPath } from "@/lib/vault/config";
import { performSearch } from "@/lib/vault/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const fullText = searchParams.get("fullText") === "true";

  const vaultPath = resolveVaultPath();
  const results = performSearch(vaultPath, query, { fullText });

  return NextResponse.json(results);
}
