import { NextResponse } from "next/server";
import { canResendCode, findLatestCode, issueEmailCode } from "@/lib/auth/email-otp";
import { normalizeEmail, updateDb, createTimestamp, createId, type StoredUser } from "@/lib/auth/local-db";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildPlaceholderUser(email: string, region: string | null): StoredUser {
  const now = createTimestamp();
  return {
    id: createId(),
    email,
    passwordHash: null,
    phone: null,
    age: null,
    gender: null,
    region,
    telegramId: null,
    telegramUsername: null,
    telegramUrl: null,
    firstName: null,
    lastName: null,
    vkUrl: null,
    instagramUrl: null,
    xUrl: null,
    photoUrl: null,
    authProvider: "email",
    emailVerified: false,
    passwordReady: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function POST(request: Request) {
  try {
    const { email, region } = (await request.json()) as { email?: string; region?: string | null };
    const normalizedEmail = email ? normalizeEmail(email) : "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Введите E-Mail." }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "E-Mail введён неверно." }, { status: 400 });
    }

    await updateDb(async (db) => {
      const existingUser = db.users.find((user) => user.email === normalizedEmail) ?? null;
      if (existingUser?.passwordReady) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
      }

      const previousCode = findLatestCode(db, normalizedEmail);
      if (!canResendCode(previousCode)) {
        throw new Error("CODE_RATE_LIMIT");
      }

      if (!existingUser) {
        db.users.push(buildPlaceholderUser(normalizedEmail, region?.trim() || null));
      } else {
        existingUser.region = existingUser.region ?? (region?.trim() || null);
        existingUser.updatedAt = createTimestamp();
      }

      await issueEmailCode(db, normalizedEmail);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось отправить код.";

    if (message === "EMAIL_ALREADY_REGISTERED") {
      return NextResponse.json(
        { error: "Данный E-Mail уже зарегистрирован. Войдите через пароль." },
        { status: 409 },
      );
    }

    if (message === "CODE_RATE_LIMIT") {
      return NextResponse.json(
        { error: "Письмо уже было недавно отправлено. Попробуйте ещё раз чуть позже." },
        { status: 429 },
      );
    }

    if (message === "EMAIL_SEND_FAILED") {
      return NextResponse.json(
        { error: "Не удалось отправить письмо с кодом. Попробуйте ещё раз позже." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: message || "Не удалось отправить код." },
      { status: 500 },
    );
  }
}
