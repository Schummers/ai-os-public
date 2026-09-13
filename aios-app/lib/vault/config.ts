import os from "node:os";
import path from "node:path";

export function resolveVaultPath(): string {
  const envPath = process.env.VAULT_PATH;
  if (envPath && envPath.trim() !== "") return expandHome(envPath);
  return path.join(os.homedir(), "AI OS", "second-brain");
}

function expandHome(value: string): string {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}
