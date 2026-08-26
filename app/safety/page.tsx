export default function SafetyPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Child Safety</h1>
      <p style={{ color: "var(--ink-faint)", marginBottom: 36 }}>Our commitment to safe school visits</p>
      {[
        ["Published, verified authors", "Every author in our directory is traditionally published through an established publishing house and verified by the Writers for Readers team before being listed. Schools complete their own district-mandated background checks and clearances directly with the author during contracting."],
        ["No direct student contact", "Authors communicate only with school staff (teachers, librarians, administrators) — never directly with students or parents."],
        ["School-supervised visits", "All visits are conducted under school supervision. Authors are never alone with students. Schools are responsible for their standard supervision protocols."],
        ["Reporting concerns", "If you have concerns about any author interaction, contact us immediately at safety@findanauthor.org. We take all reports seriously and act promptly."],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h2>
          <p style={{ color: "var(--ink-soft)" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
