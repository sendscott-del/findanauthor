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

function prettySlug(slug?: string | null) {
  if (!slug) return null;
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Safely join a value that may be an array, a string, or missing. */
function list(v?: unknown): string {
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  if (typeof v === "string") return v;
  return "";
}

/** Render a labeled block only when the value is present. */
function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
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
          {requests.map((r: any) => {
            const isGrant = r.budget_type === "grant";
            const author = prettySlug(r.author_slug);
            const dateRange = [r.date_earliest, r.date_latest].filter(Boolean).join(" – ");
            return (
              <div key={r.id} className="card" style={{ padding: 22 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{r.school_name}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{r.requester_name} · {r.requester_role} · {r.requester_email}</div>
                    <div style={{ fontSize: 13.5, marginTop: 4, color: "var(--ink-faint)" }}>
                      {r.school_city}{r.school_state ? `, ${r.school_state}` : ""} · {r.visit_kind}{list(r.grades) ? ` · Grades ${list(r.grades)}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "flex-start" }}>
                    {isGrant && <span className="badge badge-grant" style={{ fontSize: 11 }}>★ Grant request</span>}
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

                {/* Requested author — always visible */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)", fontSize: 14.5 }}>
                  <span style={{ fontWeight: 800 }}>Requested author: </span>
                  {author ? (
                    <Link href={`/authors/${r.author_slug}`} target="_blank" style={{ color: "var(--orange-deep)", fontWeight: 700 }}>{author}</Link>
                  ) : (
                    <span style={{ color: "var(--ink-soft)" }}>No specific author (open to any)</span>
                  )}
                </div>

                {/* Grant justification — highlighted, always visible for grant requests */}
                {isGrant && r.grant_need_reason && (
                  <div style={{ marginTop: 12, background: "var(--green-tint)", border: "1.5px solid #BBDDD0", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--green-deep)", marginBottom: 4 }}>Why they&apos;re requesting a free grant visit</div>
                    <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{r.grant_need_reason}</div>
                  </div>
                )}

                {/* Everything else — expandable */}
                <details style={{ marginTop: 12 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "var(--orange-deep)" }}>
                    View full request details
                  </summary>
                  <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
                    <Field label="What success looks like for them" value={r.success_description} />
                    {isGrant && <Field label="Staff lead who will own the day" value={r.grant_staff_lead} />}
                    {isGrant && <Field label="How they'll prepare students" value={r.grant_prep_plan} />}
                    <Field label="Budget" value={isGrant ? "Requesting a free grant visit" : r.budget_type + (r.budget_amount ? ` · $${r.budget_amount}` : "")} />
                    <Field label="Preferred dates" value={dateRange || undefined} />
                    <Field label="Approx. number of students" value={r.student_count ? String(r.student_count) : undefined} />
                    <Field label="Timing notes" value={r.timing_notes} />
                    <Field label="Themes of interest" value={list(r.themes) || undefined} />
                    <Field label="School type" value={list(r.school_type) || undefined} />
                    <Field label="School website" value={r.school_website} />
                    <Field label="Additional notes" value={r.notes} />
                    <Field label="Confirmed a staff lead will own the day" value={r.confirmed_staff_lead ? "Yes" : undefined} />
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>Reply to</div>
                      <a href={`mailto:${r.requester_email}`} style={{ fontSize: 14.5, color: "var(--orange-deep)", fontWeight: 700 }}>{r.requester_email}</a>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
