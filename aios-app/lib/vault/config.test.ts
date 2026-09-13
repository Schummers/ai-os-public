import { afterEach, describe, expect, it } from "vitest";
import os from "node:os";
import path from "node:path";
import { resolveVaultPath } from "./config";

describe("resolveVaultPath", () => {
  const originalEnv = process.env.VAULT_PATH;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.VAULT_PATH;
    else process.env.VAULT_PATH = originalEnv;
  });

  it("defaults to ~/AI OS/second-brain when VAULT_PATH is unset", () => {
    delete process.env.VAULT_PATH;
    expect(resolveVaultPath()).toBe(path.join(os.homedir(), "AI OS", "second-brain"));
  });

  it("uses VAULT_PATH when set", () => {
    process.env.VAULT_PATH = "/tmp/some-vault";
    expect(resolveVaultPath()).toBe("/tmp/some-vault");
  });

  it("expands a leading ~ in VAULT_PATH", () => {
    process.env.VAULT_PATH = "~/custom-vault";
    expect(resolveVaultPath()).toBe(path.join(os.homedir(), "custom-vault"));
  });
});
