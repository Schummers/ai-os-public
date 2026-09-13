import { NextRequest, NextResponse } from "next/server";
import { resolveVaultPath } from "@/lib/vault/config";
import { updateTaskFrontmatter } from "@/lib/vault/tasks";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const vaultPath = resolveVaultPath();

  try {
    const body = await request.json();
    const { status, priority, due, autonomy, expectedHash } = body;

    const result = updateTaskFrontmatter(
      vaultPath,
      slug,
      { status, priority, due, autonomy },
      expectedHash
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          conflict: result.conflict || false,
          freshData: result.freshData || null,
        },
        { status: result.conflict ? 409 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
