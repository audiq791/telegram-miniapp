import { createHash, randomInt, randomUUID } from "crypto";
import {
  createTimestamp,
  normalizeEmail,
  pruneExpiredRecords,
  type LocalAuthDb,
  type RegistrationTicketRecord,
  type VerificationCodeRecord,
} from "./local-db";
import { sendEmail } from "./mailer";

const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_LENGTH = 8;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const REGISTRATION_TICKET_TTL_MS = 20 * 60 * 1000;

export function createCode() {
  const min = 10 ** (CODE_LENGTH - 1);
  const max = 10 ** CODE_LENGTH;
  return String(randomInt(min, max));
}

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function findLatestCode(db: LocalAuthDb, email: string) {
  pruneExpiredRecords(db);

  return db.verificationCodes
    .filter((record) => record.email === normalizeEmail(email) && !record.consumedAt)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))[0] ?? null;
}

export function canResendCode(record: VerificationCodeRecord | null) {
  if (!record) {
    return true;
  }

  return Date.now() - Date.parse(record.createdAt) >= RESEND_COOLDOWN_MS;
}

export async function issueEmailCode(db: LocalAuthDb, email: string) {
  const normalizedEmail = normalizeEmail(email);
  pruneExpiredRecords(db);

  const code = createCode();
  const createdAt = createTimestamp();
  const record: VerificationCodeRecord = {
    id: randomUUID(),
    email: normalizedEmail,
    codeHash: hashToken(code),
    expiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    consumedAt: null,
    attempts: 0,
    createdAt,
  };

  db.verificationCodes = db.verificationCodes.filter((item) => item.email !== normalizedEmail || item.consumedAt);
  db.verificationCodes.push(record);

  const subject = "Регистрация в Бирже Бонусов";
  const html = `
    <div style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,sans-serif;color:#18181b;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:20px;padding:32px;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;margin-bottom:12px;">
          Регистрация в Бирже Бонусов
        </div>
        <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#111827;">
          Подтверждение регистрации
        </h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;">
          Пожалуйста, введите этот код в поле для ввода кода в приложении.
        </p>
        <div style="margin:0 0 22px;padding:18px 20px;border-radius:16px;background:#f4f4f5;border:1px solid #e4e4e7;text-align:center;">
          <span style="font-size:34px;font-weight:700;letter-spacing:8px;color:#111827;">${code}</span>
        </div>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#52525b;">
          Код действует ограниченное время и может быть использован только один раз.
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#52525b;">
          Если вы не запрашивали регистрацию, просто проигнорируйте это письмо.
        </p>
      </div>
    </div>
  `;

  const text = `Регистрация в Бирже Бонусов. Пожалуйста, введите этот код в поле для ввода кода в приложении: ${code}`;

  try {
    await sendEmail({
      to: normalizedEmail,
      subject,
      html,
      text,
    });
  } catch {
    db.verificationCodes = db.verificationCodes.filter((item) => item.id !== record.id);
    throw new Error("EMAIL_SEND_FAILED");
  }
}

export function verifyEmailCode(db: LocalAuthDb, email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const record = findLatestCode(db, normalizedEmail);

  if (!record) {
    throw new Error("CODE_NOT_FOUND");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new Error("CODE_TOO_MANY_ATTEMPTS");
  }

  if (Date.parse(record.expiresAt) <= Date.now()) {
    throw new Error("CODE_EXPIRED");
  }

  if (hashToken(code) !== record.codeHash) {
    record.attempts += 1;
    throw new Error("CODE_INVALID");
  }

  record.consumedAt = createTimestamp();

  const ticketToken = randomUUID();
  const ticket: RegistrationTicketRecord = {
    id: randomUUID(),
    email: normalizedEmail,
    tokenHash: hashToken(ticketToken),
    expiresAt: new Date(Date.now() + REGISTRATION_TICKET_TTL_MS).toISOString(),
    createdAt: createTimestamp(),
  };

  db.registrationTickets = db.registrationTickets.filter((item) => item.email !== normalizedEmail);
  db.registrationTickets.push(ticket);

  return ticketToken;
}
