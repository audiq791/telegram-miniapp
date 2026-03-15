import { NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/auth/telegram";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("app_users")
      .upsert(
        {
          telegram_id: validated.user.id,
          telegram_username: validated.user.username ?? null,
          telegram_url: telegramUrl,
          first_name: validated.user.first_name,
          last_name: validated.user.last_name ?? null,
          photo_url: validated.user.photo_url ?? null,
          auth_provider: "telegram",
          email_verified: true,
        },
        {
          onConflict: "telegram_id",
        },
      )
      .select("id, telegram_id, telegram_username, telegram_url, first_name, last_name, photo_url")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to persist Telegram user." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      session: {
        appUserId: data.id,
        telegramId: data.telegram_id,
        telegramUsername: data.telegram_username,
        telegramUrl: data.telegram_url,
        firstName: data.first_name,
        lastName: data.last_name,
        photoUrl: data.photo_url,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Telegram login failed." },
      { status: 400 },
    );
  }
}
