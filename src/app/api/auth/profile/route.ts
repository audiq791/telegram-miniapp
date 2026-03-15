import { NextResponse } from "next/server";
import { createTimestamp, updateDb } from "@/lib/auth/local-db";
import { findUserBySession, getSessionTokenFromRequest } from "@/lib/auth/server-session";

type ProfilePayload = {
  email?: string;
  phone?: string;
  age?: number | null;
  gender?: string | null;
  region?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  telegramUrl?: string | null;
  vkUrl?: string | null;
  instagramUrl?: string | null;
  xUrl?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProfilePayload;
    const sessionToken = getSessionTokenFromRequest(request);
    const updated = await updateDb((db) => {
      const user = findUserBySession(db, sessionToken);
      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      user.email = body.email ?? user.email ?? null;
      user.phone = body.phone ?? user.phone ?? null;
      user.age = body.age ?? user.age ?? null;
      user.gender = body.gender ?? user.gender ?? null;
      user.region = body.region ?? user.region ?? null;
      user.firstName = body.firstName ?? user.firstName ?? null;
      user.lastName = body.lastName ?? user.lastName ?? null;
      user.telegramUrl = body.telegramUrl ?? user.telegramUrl ?? null;
      user.vkUrl = body.vkUrl ?? user.vkUrl ?? null;
      user.instagramUrl = body.instagramUrl ?? user.instagramUrl ?? null;
      user.xUrl = body.xUrl ?? user.xUrl ?? null;
      user.updatedAt = createTimestamp();
      return user.id;
    });

    return NextResponse.json({ ok: true, appUserId: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Необходима авторизация." }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save profile." },
      { status: 500 },
    );
  }
}
