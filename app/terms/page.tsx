export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Terms of Use</h1>
      <p style={{ color: "var(--ink-faint)", marginBottom: 36 }}>Last updated: June 2025</p>
      {[
        ["Use of the service", "Writers for Readers is a free matching service. Schools may browse and submit visit requests at no charge. Authors apply for listing and keep 100% of their visit fees."],
        ["Author listings", "All listed authors have been verified as traditionally published and reviewed by the Writers for Readers team. We reserve the right to remove listings that receive negative feedback or violate our standards."],
        ["Accuracy", "Authors are responsible for keeping their profiles accurate and availability current. Schools are responsible for the accuracy of their request information."],
        ["Limitation of liability", "Writers for Readers facilitates introductions but is not a party to visit agreements. We are not responsible for the conduct of authors or schools during visits."],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h2>
          <p style={{ color: "var(--ink-soft)" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
