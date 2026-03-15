export const TELEGRAM_SESSION_KEY = "bon-telegram-session";
export const PENDING_PASSWORD_SETUP_KEY = "bon-pending-password-setup";

export type TelegramAppSession = {
  appUserId: string;
  telegramId: number;
  telegramUsername: string | null;
  telegramUrl: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
};

export function readTelegramSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(TELEGRAM_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TelegramAppSession;
  } catch {
    window.localStorage.removeItem(TELEGRAM_SESSION_KEY);
    return null;
  }
}

export function writeTelegramSession(session: TelegramAppSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TELEGRAM_SESSION_KEY, JSON.stringify(session));
}

export function clearTelegramSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TELEGRAM_SESSION_KEY);
}

export function readPendingPasswordSetup() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(PENDING_PASSWORD_SETUP_KEY) === "1";
}

export function markPendingPasswordSetup() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PENDING_PASSWORD_SETUP_KEY, "1");
}

export function clearPendingPasswordSetup() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_PASSWORD_SETUP_KEY);
}
