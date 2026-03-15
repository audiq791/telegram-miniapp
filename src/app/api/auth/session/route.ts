import { NextResponse } from "next/server";
import { getDbSnapshot } from "@/lib/auth/local-db";
import { findUserBySession, getSessionTokenFromRequest } from "@/lib/auth/server-session";
import { toClientUser } from "@/lib/auth/user-profile";

export async function GET(request: Request) {
  const db = await getDbSnapshot();
  const sessionToken = getSessionTokenFromRequest(request);
  const user = findUserBySession(db, sessionToken);

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: toClientUser(user),
  });
}
