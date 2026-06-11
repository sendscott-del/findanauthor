import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://isogetmvnpimcmouakeg.supabase.co";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(url, anon);

export function serverClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anon;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
