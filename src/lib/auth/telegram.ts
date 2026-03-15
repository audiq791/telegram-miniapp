import { createHmac, timingSafeEqual } from "crypto";

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type ParsedInitData = {
  authDate: number;
  user: TelegramUser;
};

const MAX_INIT_DATA_AGE_SECONDS = 60 * 15;

function buildDataCheckString(initData: URLSearchParams) {
  return [...initData.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

export function validateTelegramInitData(rawInitData: string, botToken: string): ParsedInitData {
  const params = new URLSearchParams(rawInitData);
  const hash = params.get("hash");
  const userRaw = params.get("user");
  const authDateRaw = params.get("auth_date");

  if (!hash || !userRaw || !authDateRaw) {
    throw new Error("Telegram initData is incomplete.");
  }

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const dataCheckString = buildDataCheckString(params);
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const receivedHashBuffer = Buffer.from(hash, "hex");
  const computedHashBuffer = Buffer.from(computedHash, "hex");
  if (
    receivedHashBuffer.length !== computedHashBuffer.length ||
    !timingSafeEqual(receivedHashBuffer, computedHashBuffer)
  ) {
    throw new Error("Telegram initData hash is invalid.");
  }

  const authDate = Number(authDateRaw);
  if (!Number.isFinite(authDate)) {
    throw new Error("Telegram auth_date is invalid.");
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (ageSeconds > MAX_INIT_DATA_AGE_SECONDS) {
    throw new Error("Telegram initData has expired.");
  }

  const user = JSON.parse(userRaw) as TelegramUser;
  if (!user?.id || !user?.first_name) {
    throw new Error("Telegram user payload is invalid.");
  }

  return {
    authDate,
    user,
  };
}
