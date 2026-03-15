import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createId,
  createTimestamp,
  pruneExpiredRecords,
  type LocalAuthDb,
  type SessionRecord,
  type StoredUser,
} from "./local-db";

export const AUTH_SESSION_COOKIE = "bon-auth-session";
export const REGISTRATION_COOKIE = "bon-registration-ticket";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getSessionCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + maxAgeMs),
  };
}

export function createAuthSession(db: LocalAuthDb, userId: string) {
  pruneExpiredRecords(db);

  const token = randomUUID();
  const record: SessionRecord = {
    id: createId(),
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    createdAt: createTimestamp(),
  };

  db.sessions.push(record);
  return token;
}

export function attachAuthSessionCookie(response: NextResponse, sessionToken: string) {
  response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, getSessionCookieOptions(SESSION_TTL_MS));
}

export function clearAuthSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function attachRegistrationCookie(response: NextResponse, ticketToken: string) {
  response.cookies.set(REGISTRATION_COOKIE, ticketToken, getSessionCookieOptions(20 * 60 * 1000));
}

export function clearRegistrationCookie(response: NextResponse) {
  response.cookies.set(REGISTRATION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export function getSessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const target = parts.find((part) => part.startsWith(`${AUTH_SESSION_COOKIE}=`));
  return target ? decodeURIComponent(target.slice(`${AUTH_SESSION_COOKIE}=`.length)) : null;
}

export function getRegistrationTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const target = parts.find((part) => part.startsWith(`${REGISTRATION_COOKIE}=`));
  return target ? decodeURIComponent(target.slice(`${REGISTRATION_COOKIE}=`.length)) : null;
}

export function findUserBySession(db: LocalAuthDb, sessionToken: string | null): StoredUser | null {
  if (!sessionToken) {
    return null;
  }

  pruneExpiredRecords(db);

  const session = db.sessions.find((item) => item.tokenHash === hashToken(sessionToken));
  if (!session) {
    return null;
  }

  return db.users.find((user) => user.id === session.userId) ?? null;
}

export function revokeSession(db: LocalAuthDb, sessionToken: string | null) {
  if (!sessionToken) {
    return;
  }

  const tokenHash = hashToken(sessionToken);
  db.sessions = db.sessions.filter((item) => item.tokenHash !== tokenHash);
}

export function findEmailByRegistrationToken(db: LocalAuthDb, ticketToken: string | null) {
  if (!ticketToken) {
    return null;
  }

  pruneExpiredRecords(db);
  const tokenHash = hashToken(ticketToken);
  const ticket = db.registrationTickets.find((item) => item.tokenHash === tokenHash) ?? null;
  return ticket?.email ?? null;
}

export function revokeRegistrationTicket(db: LocalAuthDb, ticketToken: string | null) {
  if (!ticketToken) {
    return;
  }

  const tokenHash = hashToken(ticketToken);
  db.registrationTickets = db.registrationTickets.filter((item) => item.tokenHash !== tokenHash);
}
