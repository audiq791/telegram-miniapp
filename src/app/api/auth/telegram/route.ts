import { NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/auth/telegram";
import { createId, createTimestamp, updateDb, type StoredUser } from "@/lib/auth/local-db";
import { attachAuthSessionCookie, clearRegistrationCookie, createAuthSession } from "@/lib/auth/server-session";
import { toClientUser } from "@/lib/auth/user-profile";

function buildTelegramUser(params: {
  telegramId: number;
  telegramUsername: string | null;
  telegramUrl: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
}): StoredUser {
  const now = createTimestamp();
  return {
    id: createId(),
    email: null,
    passwordHash: null,
    phone: null,
    age: null,
    gender: null,
    region: null,
    telegramId: params.telegramId,
    telegramUsername: params.telegramUsername,
    telegramUrl: params.telegramUrl,
    firstName: params.firstName,
    lastName: params.lastName,
    vkUrl: null,
    instagramUrl: null,
    xUrl: null,
    photoUrl: params.photoUrl,
    authProvider: "telegram",
    emailVerified: true,
    passwordReady: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function POST(request: Request) {
  try {
    const { initData } = (await request.json()) as { initData?: string };
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();

    if (!botToken) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not configured." },
        { status: 503 },
      );
    }

    if (!initData) {
      return NextResponse.json({ error: "initData is required." }, { status: 400 });
    }

    const validated = validateTelegramInitData(initData, botToken);
    const telegramUrl = validated.user.username
      ? `https://t.me/${validated.user.username}`
      : null;

    const result = await updateDb((db) => {
      let user = db.users.find((item) => item.telegramId === validated.user.id) ?? null;

      if (!user) {
        user = buildTelegramUser({
          telegramId: validated.user.id,
          telegramUsername: validated.user.username ?? null,
          telegramUrl,
          firstName: validated.user.first_name,
          lastName: validated.user.last_name ?? null,
          photoUrl: validated.user.photo_url ?? null,
        });
        db.users.push(user);
      } else {
        user.telegramUsername = validated.user.username ?? null;
        user.telegramUrl = telegramUrl;
        user.firstName = validated.user.first_name;
        user.lastName = validated.user.last_name ?? null;
        user.photoUrl = validated.user.photo_url ?? null;
        user.authProvider = "telegram";
        user.emailVerified = true;
        user.updatedAt = createTimestamp();
      }

      const sessionToken = createAuthSession(db, user.id);

      return {
        user: toClientUser(user),
        sessionToken,
      };
    });

    const response = NextResponse.json({ ok: true, user: result.user });
    clearRegistrationCookie(response);
    attachAuthSessionCookie(response, result.sessionToken);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram login failed." },
      { status: 400 },
    );
  }
}
