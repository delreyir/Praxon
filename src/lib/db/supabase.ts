/**
 * Supabase clients.
 * - `getSupabasePublic()`  : anon key, public reads (browser + server safe).
 * - `getSupabaseAdmin()`   : service_role, server-only writes.
 *
 * Returns `null` when env vars are missing so callers can fall back to mocks.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

let publicClient: SupabaseClient | null | undefined;
let adminClient: SupabaseClient | null | undefined;

export function getSupabasePublic(): SupabaseClient | null {
  if (publicClient !== undefined) return publicClient;
  if (!URL || !ANON) {
    publicClient = null;
    return null;
  }
  publicClient = createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return publicClient;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient;
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() must only be called on the server");
  }
  if (!URL || !SERVICE) {
    adminClient = null;
    return null;
  }
  adminClient = createClient(URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(URL && ANON);
}
