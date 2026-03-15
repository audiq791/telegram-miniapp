import { NextResponse } from "next/server";
import { getDbSnapshot, normalizeEmail } from "@/lib/auth/local-db";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const normalizedEmail = email ? normalizeEmail(email) : "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const db = await getDbSnapshot();
    const user = db.users.find((item) => item.email === normalizedEmail) ?? null;

    return NextResponse.json({
      exists: Boolean(user),
      passwordReady: Boolean(user?.passwordReady),
      emailVerified: Boolean(user?.emailVerified),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check email status." },
      { status: 500 },
    );
  }
}
