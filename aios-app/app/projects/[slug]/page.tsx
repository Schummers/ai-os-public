import { notFound } from "next/navigation";
import { resolveVaultPath } from "@/lib/vault/config";
import { readProjectDetail } from "@/lib/vault/details";
import { ProjectDetailView } from "./ProjectDetailView";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vaultPath = resolveVaultPath();
  const project = readProjectDetail(vaultPath, slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}
