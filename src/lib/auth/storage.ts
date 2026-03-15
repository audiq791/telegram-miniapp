export const LAST_AUTH_EMAIL_KEY = "bon-last-auth-email";
export const AUTH_FLASH_MESSAGE_KEY = "bon-auth-flash-message";
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

export function readLastAuthEmail() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(LAST_AUTH_EMAIL_KEY) ?? "";
}

export function writeLastAuthEmail(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LAST_AUTH_EMAIL_KEY, email);
}

export function clearLastAuthEmail() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LAST_AUTH_EMAIL_KEY);
}

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

export function writeAuthFlashMessage(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(AUTH_FLASH_MESSAGE_KEY, message);
}

export function readAuthFlashMessage() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.sessionStorage.getItem(AUTH_FLASH_MESSAGE_KEY) ?? "";
}

export function clearAuthFlashMessage() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_FLASH_MESSAGE_KEY);
}
