export const dynamic = "force-dynamic";
import Link from "next/link";

async function getApplications() {
  try {
    const { serverClient } = await import("@/lib/supabase");
    const supabase = serverClient();
    const { data } = await supabase
      .from("wfr_applications")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminApplications() {
  const apps = await getApplications();

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Author Applications</h1>
        <p style={{ color: "var(--ink-soft)" }}>{apps.length} total · {apps.filter((a: any) => a.status === "pending").length} pending review</p>
      </div>

      {apps.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <p>No applications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {apps.map((app: any) => (
            <div key={app.id} className="card" style={{ padding: 22, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
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
          ))}
        </div>
      )}
    </div>
  );
}
