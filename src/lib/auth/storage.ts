export const TELEGRAM_SESSION_KEY = "bon-telegram-session";

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
