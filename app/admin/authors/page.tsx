"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

type AdminAuthor = {
  id: string;
  slug: string;
  name: string;
  email?: string;
  status: "active" | "inactive" | "pending";
  founding_author?: boolean;
  location_city?: string;
  location_state?: string;
  created_at?: string;
};

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/authors")
      .then((r) => r.json())
      .then((d) => { setAuthors(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setError("Could not load authors."); setLoading(false); });
  }, []);

  async function patch(id: string, changes: Partial<AdminAuthor>) {
    setSaving(id);
    setError("");
    // Optimistic update
    const prev = authors;
    setAuthors((list) => list.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    try {
      const res = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Update failed");
      }
    } catch (e: unknown) {
      setAuthors(prev); // roll back
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading…</div>;

  const foundingCount = authors.filter((a) => a.founding_author).length;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Authors</h1>
        <p style={{ color: "var(--ink-soft)" }}>
          {authors.length} total · {foundingCount} founding author{foundingCount !== 1 ? "s" : ""}
        </p>
        <p style={{ color: "var(--ink-faint)", fontSize: 13.5, marginTop: 2 }}>
          Founding authors get a gold badge on their profile and rank first in directory search results.
        </p>
      </div>

      {error && (
        <div style={{ background: "var(--orange-tint)", color: "var(--orange-deep)", padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {authors.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
          <p>No authors yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {authors.map((a) => (
            <div key={a.id} className="card" style={{ padding: 18, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>{a.name}</span>
                  {a.founding_author && <span className="badge badge-founding" style={{ fontSize: 11 }}>✦ Founding</span>}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{a.email}</div>
                <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>
                  {[a.location_city, a.location_state].filter(Boolean).join(", ")}
                </div>
              </div>

              {/* Listing status */}
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--ink-faint)", fontWeight: 700 }}>
                Listing status
                <select
                  className="form-input"
                  style={{ padding: "7px 10px", width: "auto" }}
                  value={a.status}
                  disabled={saving === a.id}
                  onChange={(e) => patch(a.id, { status: e.target.value as AdminAuthor["status"] })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </label>

              {/* Founding toggle */}
              <button
                type="button"
                disabled={saving === a.id}
                onClick={() => patch(a.id, { founding_author: !a.founding_author })}
                className={a.founding_author ? "btn btn-sm" : "btn btn-ghost btn-sm"}
                style={a.founding_author
                  ? { background: "var(--gold)", color: "#4A3410", boxShadow: "0 2px 0 #B9861F", whiteSpace: "nowrap" }
                  : { whiteSpace: "nowrap" }}
              >
                {a.founding_author ? "✦ Founding author" : "Make founding author"}
              </button>

              <Link href={`/authors/${a.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
