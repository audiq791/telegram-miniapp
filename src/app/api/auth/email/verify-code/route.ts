import { NextResponse } from "next/server";
import { verifyEmailCode } from "@/lib/auth/email-otp";
import { normalizeEmail, updateDb } from "@/lib/auth/local-db";
import { attachRegistrationCookie, clearAuthSessionCookie, clearRegistrationCookie } from "@/lib/auth/server-session";

export async function POST(request: Request) {
  try {
    const { email, code } = (await request.json()) as { email?: string; code?: string };
    const normalizedEmail = email ? normalizeEmail(email) : "";
    const normalizedCode = code?.trim() ?? "";

    if (!normalizedEmail || !normalizedCode) {
      return NextResponse.json({ error: "Введите E-Mail и код из письма." }, { status: 400 });
    }

    const ticketToken = await updateDb((db) => verifyEmailCode(db, normalizedEmail, normalizedCode));
    const response = NextResponse.json({ ok: true });
    clearAuthSessionCookie(response);
    clearRegistrationCookie(response);
    attachRegistrationCookie(response, ticketToken);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Код не верный.";

    if (message === "CODE_NOT_FOUND") {
      return NextResponse.json({ error: "Сначала запросите код на почту." }, { status: 404 });
    }

    if (message === "CODE_TOO_MANY_ATTEMPTS") {
      return NextResponse.json({ error: "Слишком много неверных попыток. Запросите новый код." }, { status: 429 });
    }

    if (message === "CODE_EXPIRED") {
      return NextResponse.json({ error: "Срок действия кода истёк. Запросите новый код." }, { status: 410 });
    }

    if (message === "CODE_INVALID") {
      return NextResponse.json({ error: "Код не верный." }, { status: 400 });
    }

    return NextResponse.json({ error: "Не удалось подтвердить код." }, { status: 500 });
  }
}
