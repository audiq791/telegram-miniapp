import { NextResponse } from "next/server";
import { normalizeEmail, updateDb } from "@/lib/auth/local-db";
import { verifyPassword } from "@/lib/auth/password";
import { attachAuthSessionCookie, clearRegistrationCookie, createAuthSession } from "@/lib/auth/server-session";
import { toClientUser } from "@/lib/auth/user-profile";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    const normalizedEmail = email ? normalizeEmail(email) : "";

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: "Введите E-Mail и пароль." }, { status: 400 });
    }

    const result = await updateDb((db) => {
      const user = db.users.find((item) => item.email === normalizedEmail) ?? null;
      if (!user?.passwordReady || !verifyPassword(password, user.passwordHash)) {
        throw new Error("INVALID_CREDENTIALS");
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
    const message = error instanceof Error ? error.message : "Неверная почта или пароль.";
    if (message === "INVALID_CREDENTIALS") {
      return NextResponse.json({ error: "Неверная почта или пароль." }, { status: 401 });
    }

    return NextResponse.json({ error: "Не удалось выполнить вход." }, { status: 500 });
  }
}
