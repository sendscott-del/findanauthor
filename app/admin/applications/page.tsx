"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { setApps(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function approve(id: string) {
    setApproving(id);
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_id: id }),
    });
    const json = await res.json();
    if (res.ok) {
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
      setResults((prev) => ({ ...prev, [id]: "Approved! Setup link sent." }));
    } else {
      setResults((prev) => ({ ...prev, [id]: `Error: ${json.error}` }));
    }
    setApproving(null);
  }

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading…</div>;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Author Applications</h1>
        <p style={{ color: "var(--ink-soft)" }}>
          {apps.length} total · {apps.filter((a) => a.status === "pending").length} pending review
        </p>
      </div>

      {apps.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <p>No applications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {apps.map((app) => (
            <div key={app.id} className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{app.name}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{app.email}</div>
                  <div style={{ fontSize: 13.5, marginTop: 4 }}>
                    <em>{app.book_title}</em> · {app.publisher}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
                  <span style={{
                    padding: "4px 11px", borderRadius: 999, fontSize: 12.5, fontWeight: 800,
                    background: app.auto_check_passed ? "var(--green-tint)" : "var(--orange-tint)",
                    color: app.auto_check_passed ? "var(--green-deep)" : "var(--orange-deep)",
                  }}>
                    {app.auto_check_passed ? "✓ Publisher verified" : "⚠ Publisher unverified"}
                  </span>
                  <span style={{
                    padding: "4px 11px", borderRadius: 999, fontSize: 12.5, fontWeight: 800,
                    background: app.status === "pending" ? "#f0f0f0" : app.status === "approved" ? "var(--green-tint)" : "var(--orange-tint)",
                    color: app.status === "pending" ? "var(--ink-soft)" : app.status === "approved" ? "var(--green-deep)" : "var(--orange-deep)",
                  }}>
                    {app.status}
                  </span>
                  {app.offers_grant && <span className="badge badge-grant" style={{ fontSize: 11 }}>★ Grant</span>}
                </div>

                <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Approve action */}
              {app.status === "pending" && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: 13, padding: "8px 18px" }}
                    disabled={approving === app.id}
                    onClick={() => approve(app.id)}
                  >
                    {approving === app.id ? "Approving…" : "Approve & Send Setup Link"}
                  </button>
                  {results[app.id] && (
                    <span style={{ fontSize: 13, color: results[app.id].startsWith("Error") ? "var(--orange-deep)" : "var(--green-deep)", fontWeight: 600 }}>
                      {results[app.id]}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
