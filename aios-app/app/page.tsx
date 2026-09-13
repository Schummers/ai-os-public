import { resolveVaultPath } from "@/lib/vault/config";
import { readGlobalViewData } from "@/lib/vault/global";
import { readDailyViewData } from "@/lib/vault/daily";
import { readGlobalContentsData } from "@/lib/vault/contents";
import { AppShell } from "@/components/shell/AppShell";

export const dynamic = "force-dynamic";

export default function Home() {
  const vaultPath = resolveVaultPath();
  const globalData = readGlobalViewData(vaultPath);
  const dailyData = readDailyViewData(vaultPath);
  const contentsData = readGlobalContentsData(vaultPath);

  return (
    <AppShell
      dailyData={dailyData}
      globalData={globalData}
      contentsData={contentsData}
    />
  );
}
