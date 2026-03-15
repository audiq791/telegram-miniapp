import { type StoredUser } from "./local-db";

export function toClientUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    age: user.age,
    gender: user.gender,
    region: user.region,
    telegramId: user.telegramId,
    telegramUsername: user.telegramUsername,
    telegramUrl: user.telegramUrl,
    vkUrl: user.vkUrl,
    instagramUrl: user.instagramUrl,
    xUrl: user.xUrl,
    photoUrl: user.photoUrl,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
    passwordReady: user.passwordReady,
  };
}
