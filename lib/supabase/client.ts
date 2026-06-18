import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://jgoivwfejtfpbngsusgq.supabase.co";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Browser Supabase client for client components (login form, sign-out).
export function createSupabaseBrowserClient() {
  return createBrowserClient(url, anon);
}
