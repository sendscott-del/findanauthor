import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serverClient } from "@/lib/supabase";
import DashboardForm from "./dashboard-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login?next=/dashboard");

  const db = serverClient();
  const { data: author } = await db
    .from("wfr_authors")
    .select("*")
    .ilike("email", user.email)
    .maybeSingle();

  // No approved profile for this email yet — signing in doesn't create one.
  if (!author) {
    return (
      <main className="container section" style={{ maxWidth: 560 }}>
        <h1 style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 30, color: "var(--ink)", marginBottom: 12 }}>
          No profile found
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.7 }}>
          We couldn&apos;t find an author profile for <strong>{user.email}</strong>. If you&apos;ve been
          approved, use the setup link from your welcome email to create your profile first. If you
          applied with a different email, sign in with that one instead.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          <Link href="/apply" className="btn btn-primary">Apply to join</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn btn-ghost">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  // Best-effort: link the auth user to this profile for future ownership checks.
  // Wrapped so a pre-migration DB (no user_id column) still loads the dashboard.
  if (!author.user_id) {
    try {
      await db.from("wfr_authors").update({ user_id: user.id }).eq("id", author.id);
    } catch {
      /* user_id column not present yet — migration 004 adds it */
    }
  }

  return <DashboardForm author={author} email={user.email} />;
}
