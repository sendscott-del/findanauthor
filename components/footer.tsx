import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "#E9DECB", fontFamily: "'Mulish', sans-serif" }}>
      <div className="container section-sm">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "var(--orange)", display: "flex", alignItems: "flex-end",
                justifyContent: "center", gap: 2, padding: "5px 6px",
              }}>
                {[11, 17, 10].map((h, i) => (
                  <div key={i} style={{ width: 5, height: h, background: "rgba(255,255,255,.9)", borderRadius: 2 }} />
                ))}
              </div>
              <span style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 15 }}>Writers for Readers</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(233,222,203,.7)", margin: 0 }}>
              Free matching service connecting children's book authors with schools. Author visits for every classroom.
            </p>
          </div>

          {/* For Educators */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 14, color: "rgba(233,222,203,.5)" }}>For Educators</div>
            {[["Find an author", "/authors"], ["How it works", "/#how"], ["Volunteer visit grants", "/#grant"], ["Request a visit", "/request"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ display: "block", fontSize: 14, color: "#E9DECB", textDecoration: "none", marginBottom: 9, opacity: .8 }}>
                {l}
              </Link>
            ))}
          </div>

          {/* For Authors */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 14, color: "rgba(233,222,203,.5)" }}>For Authors</div>
            {[["Apply to join", "/apply"], ["Create your profile", "/join"], ["How vetting works", "/apply#vetting"], ["Author FAQ", "/apply#faq"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ display: "block", fontSize: 14, color: "#E9DECB", textDecoration: "none", marginBottom: 9, opacity: .8 }}>
                {l}
              </Link>
            ))}
          </div>

          {/* About */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 14, color: "rgba(233,222,203,.5)" }}>About</div>
            {[["Our mission", "/#mission"], ["Child safety", "/safety"], ["Privacy policy", "/privacy"], ["Terms of use", "/terms"], ["Contact", "/contact"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ display: "block", fontSize: 14, color: "#E9DECB", textDecoration: "none", marginBottom: 9, opacity: .8 }}>
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          borderTop: "1px solid rgba(233,222,203,.15)",
          marginTop: 44,
          paddingTop: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 13,
          color: "rgba(233,222,203,.5)",
        }}>
          <span>© 2025 Writers for Readers · findanauthor.org</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Child safety", "/safety"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: "rgba(233,222,203,.5)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .footer-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
