import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "./env";

export function getSupabaseAdminClient() {
  const env = getSupabaseServerEnv();

  if (!env) {
    throw new Error("Supabase server environment variables are missing.");
  }

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
