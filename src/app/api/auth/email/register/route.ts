import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createTimestamp, updateDb } from "@/lib/auth/local-db";
import {
  attachAuthSessionCookie,
  clearRegistrationCookie,
  createAuthSession,
  findEmailByRegistrationToken,
  getRegistrationTokenFromRequest,
  revokeRegistrationTicket,
} from "@/lib/auth/server-session";
import { toClientUser } from "@/lib/auth/user-profile";

export async function POST(request: Request) {
  try {
    const { password, confirmPassword, region } = (await request.json()) as {
      password?: string;
      confirmPassword?: string;
      region?: string | null;
    };

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Пароли не совпадают." }, { status: 400 });
    }

    const registrationToken = getRegistrationTokenFromRequest(request);

    const result = await updateDb((db) => {
      const email = findEmailByRegistrationToken(db, registrationToken);
      if (!email) {
        throw new Error("REGISTRATION_TICKET_INVALID");
      }

      const user = db.users.find((item) => item.email === email) ?? null;
      if (!user) {
        throw new Error("REGISTRATION_USER_NOT_FOUND");
      }

      if (user.passwordReady) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
      }

      user.passwordHash = hashPassword(password);
      user.passwordReady = true;
      user.emailVerified = true;
      user.authProvider = "email";
      user.region = user.region ?? (region?.trim() || null);
      user.updatedAt = createTimestamp();

      revokeRegistrationTicket(db, registrationToken);
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
    const message = error instanceof Error ? error.message : "Не удалось завершить регистрацию.";

    if (message === "REGISTRATION_TICKET_INVALID") {
      return NextResponse.json({ error: "Сначала подтвердите код из письма." }, { status: 401 });
    }

    if (message === "EMAIL_ALREADY_REGISTERED") {
      return NextResponse.json(
        { error: "Данный E-Mail уже зарегистрирован. Войдите через пароль." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Не удалось завершить регистрацию." }, { status: 500 });
  }
}
