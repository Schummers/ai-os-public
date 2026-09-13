import { notFound } from "next/navigation";
import { resolveVaultPath } from "@/lib/vault/config";
import { readContentDetail } from "@/lib/vault/contents";
import { ContentDetailView } from "./ContentDetailView";

export const dynamic = "force-dynamic";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vaultPath = resolveVaultPath();
  const content = readContentDetail(vaultPath, slug);

  if (!content) {
    notFound();
  }

  return <ContentDetailView content={content} />;
}
