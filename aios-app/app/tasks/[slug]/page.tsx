import { notFound } from "next/navigation";
import { resolveVaultPath } from "@/lib/vault/config";
import { readTaskDetail } from "@/lib/vault/details";
import { TaskDetailView } from "./TaskDetailView";

export const dynamic = "force-dynamic";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vaultPath = resolveVaultPath();
  const task = readTaskDetail(vaultPath, slug);

  if (!task) {
    notFound();
  }

  return <TaskDetailView task={task} />;
}
