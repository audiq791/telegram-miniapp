export const LAST_AUTH_EMAIL_KEY = "bon-last-auth-email";

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
