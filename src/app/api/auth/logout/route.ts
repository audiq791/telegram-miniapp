import { NextResponse } from "next/server";
import { updateDb } from "@/lib/auth/local-db";
import {
  clearAuthSessionCookie,
  clearRegistrationCookie,
  getSessionTokenFromRequest,
  revokeSession,
} from "@/lib/auth/server-session";

export async function POST(request: Request) {
  const sessionToken = getSessionTokenFromRequest(request);

  await updateDb((db) => {
    revokeSession(db, sessionToken);
  });

  const response = NextResponse.json({ ok: true });
  clearAuthSessionCookie(response);
  clearRegistrationCookie(response);
  return response;
}
