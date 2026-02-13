export function setupTelegramBack(onBack: () => void) {
  const tg = (window as any)?.Telegram?.WebApp;
  const BackButton = tg?.BackButton;

  if (!BackButton) return () => {};

  BackButton.onClick(onBack);

  return () => {
    BackButton.offClick(onBack);
  };
}

export function showTelegramBack(show: boolean) {
  const tg = (window as any)?.Telegram?.WebApp;
  const BackButton = tg?.BackButton;
  if (!BackButton) return;

  if (show) BackButton.show();
  else BackButton.hide();
}
