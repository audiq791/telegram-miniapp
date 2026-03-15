export const LAST_AUTH_EMAIL_KEY = "bon-last-auth-email";
export const AUTH_FLASH_MESSAGE_KEY = "bon-auth-flash-message";

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
