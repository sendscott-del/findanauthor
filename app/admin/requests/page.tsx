export const dynamic = "force-dynamic";
import Link from "next/link";

async function getRequests() {
  try {
    const { serverClient } = await import("@/lib/supabase");
    const supabase = serverClient();
    const { data } = await supabase
      .from("wfr_requests")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminRequests() {
  const requests = await getRequests();

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", fontWeight: 600 }}>← Admin</Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Visit Requests</h1>
        <p style={{ color: "var(--ink-soft)" }}>{requests.length} total · {requests.filter((r: any) => r.status === "pending").length} pending</p>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-soft)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <p>No requests yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {requests.map((r: any) => (
            <div key={r.id} className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{r.school_name}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{r.requester_name} · {r.requester_email}</div>
                  <div style={{ fontSize: 13.5, marginTop: 4, color: "var(--ink-faint)" }}>
                    {r.school_city}{r.school_state ? `, ${r.school_state}` : ""} · {r.visit_kind} · {r.grades?.join(", ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "flex-start" }}>
                  {r.budget_type === "grant" && (
                    <span className="badge badge-grant" style={{ fontSize: 11 }}>★ Grant request</span>
                  )}
                  <span style={{
                    padding: "4px 11px", borderRadius: 999, fontSize: 12.5, fontWeight: 800,
                    background: r.status === "pending" ? "var(--orange-tint)" : "var(--green-tint)",
                    color: r.status === "pending" ? "var(--orange-deep)" : "var(--green-deep)",
                  }}>{r.status}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-faint)", padding: "4px 0" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
