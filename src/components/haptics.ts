export function haptic(type: "light" | "medium" | "success" = "light") {
  const tg = (window as any)?.Telegram?.WebApp;
  const hf = tg?.HapticFeedback;
  if (!hf) return;

  if (type === "success") hf.notificationOccurred("success");
  else hf.impactOccurred(type);
}
