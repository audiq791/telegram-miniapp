import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type AuthProvider = "email" | "telegram";

export type StoredUser = {
  id: string;
  email: string | null;
  passwordHash: string | null;
  phone: string | null;
  age: number | null;
  gender: string | null;
  region: string | null;
  telegramId: number | null;
  telegramUsername: string | null;
  telegramUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  vkUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
  photoUrl: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  passwordReady: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VerificationCodeRecord = {
  id: string;
  email: string;
  codeHash: string;
  expiresAt: string;
  consumedAt: string | null;
  attempts: number;
  createdAt: string;
};

export type RegistrationTicketRecord = {
  id: string;
  email: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
};

export type SessionRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
};

export type LocalAuthDb = {
  users: StoredUser[];
  verificationCodes: VerificationCodeRecord[];
  registrationTickets: RegistrationTicketRecord[];
  sessions: SessionRecord[];
};

const DB_DIRECTORY = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIRECTORY, "auth-db.json");

const EMPTY_DB: LocalAuthDb = {
  users: [],
  verificationCodes: [],
  registrationTickets: [],
  sessions: [],
};

let dbQueue = Promise.resolve();

async function ensureDbFile() {
  await fs.mkdir(DB_DIRECTORY, { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf8");
  }
}

async function readDb(): Promise<LocalAuthDb> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw) as Partial<LocalAuthDb>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      verificationCodes: Array.isArray(parsed.verificationCodes) ? parsed.verificationCodes : [],
      registrationTickets: Array.isArray(parsed.registrationTickets) ? parsed.registrationTickets : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    await writeDb(EMPTY_DB);
    return {
      users: [],
      verificationCodes: [],
      registrationTickets: [],
      sessions: [],
    };
  }
}

async function writeDb(db: LocalAuthDb) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function getDbSnapshot() {
  return readDb();
}

export async function updateDb<T>(mutate: (db: LocalAuthDb) => Promise<T> | T): Promise<T> {
  const task = dbQueue.then(async () => {
    const db = await readDb();
    const result = await mutate(db);
    await writeDb(db);
    return result;
  });

  dbQueue = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
}

export function createTimestamp() {
  return new Date().toISOString();
}

export function createId() {
  return randomUUID();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function pruneExpiredRecords(db: LocalAuthDb) {
  const now = Date.now();
  db.verificationCodes = db.verificationCodes.filter((record) => Date.parse(record.expiresAt) > now);
  db.registrationTickets = db.registrationTickets.filter((record) => Date.parse(record.expiresAt) > now);
  db.sessions = db.sessions.filter((record) => Date.parse(record.expiresAt) > now);
}
