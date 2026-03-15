import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type ProfilePayload = {
  email?: string;
  phone?: string;
  age?: number | null;
  gender?: string | null;
};

function getAccessToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export async function POST(request: Request) {
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token." }, { status: 401 });
    }

    const body = (await request.json()) as ProfilePayload;
    const supabase = getSupabaseAdminClient();
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: userError?.message ?? "Supabase session is invalid." },
        { status: 401 },
      );
    }

    const user = userData.user;
    const { data, error } = await supabase
      .from("app_users")
      .upsert(
        {
          auth_user_id: user.id,
          email: body.email ?? user.email ?? null,
          phone: body.phone ?? null,
          age: body.age ?? null,
          gender: body.gender ?? null,
          first_name: (user.user_metadata.first_name as string | undefined) ?? null,
          last_name: (user.user_metadata.last_name as string | undefined) ?? null,
          auth_provider: "email",
          email_verified: Boolean(user.email_confirmed_at),
          password_ready: true,
        },
        {
          onConflict: "auth_user_id",
        },
      )
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to save profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, appUserId: data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save profile." },
      { status: 500 },
    );
  }
}
