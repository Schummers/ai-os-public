import { resolveVaultPath } from "@/lib/vault/config";
import { readInboxData } from "@/lib/vault/inbox";
import { InboxView } from "./InboxView";

export const dynamic = "force-dynamic";

export default function InboxPage() {
  const vaultPath = resolveVaultPath();
  const inboxData = readInboxData(vaultPath);

  return <InboxView data={inboxData} />;
}
