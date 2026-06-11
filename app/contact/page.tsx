export default function ContactPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 560 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Contact</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 36 }}>We'd love to hear from you.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          ["General questions", "hello@findanauthor.org"],
          ["Author support", "authors@findanauthor.org"],
          ["School / educator support", "schools@findanauthor.org"],
          ["Child safety concerns", "safety@findanauthor.org"],
          ["Privacy questions", "privacy@findanauthor.org"],
        ].map(([label, email]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
            <span style={{ fontWeight: 700 }}>{label}</span>
            <a href={`mailto:${email}`} style={{ color: "var(--orange)", fontWeight: 600 }}>{email}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
