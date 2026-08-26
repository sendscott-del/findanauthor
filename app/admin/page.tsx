export const dynamic = "force-dynamic";
import Link from "next/link";

// Lightweight admin dashboard — in production, add Supabase auth gate
export default async function AdminPage() {
  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ color: "var(--orange-deep)", marginBottom: 10 }}>Admin</div>
        <h1 style={{ fontSize: 34 }}>Writers for Readers — Admin</h1>
        <p style={{ color: "var(--ink-soft)" }}>Manage applications, requests, and author profiles.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="admin-grid">
        {[
          {
            title: "Author Applications",
            desc: "Review pending author applications. Auto-check shows publisher verification status.",
            href: "/admin/applications",
            color: "var(--orange)",
            icon: "📝",
          },
          {
            title: "Visit Requests",
            desc: "See all school visit requests. Match requests to available authors.",
            href: "/admin/requests",
            color: "var(--blue)",
            icon: "📅",
          },
          {
            title: "Active Authors",
            desc: "Edit and manage approved author profiles in the directory.",
            href: "/admin/authors",
            color: "var(--green)",
            icon: "👤",
          },
        ].map((card) => (
          <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
            <div className="card card-hover" style={{ padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{card.icon}</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: 0 }}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, padding: 24, background: "var(--orange-tint)", borderRadius: 18 }}>
        <h3 style={{ fontSize: 18, marginBottom: 8 }}>Automated vetting pipeline</h3>
        <p style={{ color: "var(--ink-soft)", fontSize: 14.5, marginBottom: 0 }}>
          Applications are auto-checked against a traditional publisher list on submission.
          The <code style={{ background: "rgba(0,0,0,.08)", padding: "2px 6px", borderRadius: 4 }}>auto_check_passed</code> flag
          is set automatically — applications that pass still need human review before activation.
          Profile setup links are sent via email on approval.
        </p>
      </div>

      <style>{`.admin-grid { @media (max-width: 860px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
