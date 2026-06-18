"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const linkError = params.get("error") === "link";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="container section" style={{ maxWidth: 480 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 32, color: "var(--ink)", marginBottom: 8 }}>
          Author sign in
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6 }}>
          Enter the email on your author profile and we&apos;ll send you a secure sign-in link — no password needed.
        </p>
      </div>

      {linkError && status === "idle" && (
        <div style={{ background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 14, color: "#8a1c12" }}>
          That sign-in link was invalid or expired. Enter your email below to get a fresh one.
        </div>
      )}

      {status === "sent" ? (
        <div style={{ background: "#eaf7ee", border: "1px solid #bfe3ca", borderRadius: 12, padding: "20px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 19, color: "var(--ink)", marginBottom: 6 }}>
            Check your email
          </div>
          <p style={{ color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
            We sent a sign-in link to <strong>{email}</strong>. Open it on this device to reach your profile.
          </p>
        </div>
      ) : (
        <form onSubmit={sendLink}>
          <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--ink)", marginBottom: 8 }}>
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%", padding: "12px 14px", fontSize: 15.5, borderRadius: 10,
              border: "1.5px solid var(--line)", background: "#fff", marginBottom: 16,
              fontFamily: "'Mulish', sans-serif",
            }}
          />
          {status === "error" && (
            <p style={{ color: "#8a1c12", fontSize: 14, marginBottom: 14 }}>{message}</p>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      )}

      <p style={{ textAlign: "center", color: "var(--ink-faint)", fontSize: 13.5, marginTop: 22, lineHeight: 1.6 }}>
        Don&apos;t have a profile yet?{" "}
        <a href="/apply" style={{ color: "var(--orange)", fontWeight: 700 }}>Apply to join</a>.
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
