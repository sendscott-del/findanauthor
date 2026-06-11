"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(from);
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 420 }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 28 }}>Admin Login</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15 }}>Writers for Readers</p>
      </div>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ display: "block", fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Password</span>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </label>
        {error && <p style={{ color: "var(--orange-deep)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
