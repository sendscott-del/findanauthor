export default function PrivacyPage() {
  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "var(--ink-faint)", marginBottom: 36 }}>Last updated: June 2025</p>
      {[
        ["What we collect", "We collect information you provide directly — your name, email, school information, and request details. We do not sell your data."],
        ["How we use it", "We use your information to match schools with authors and to communicate about visit requests. Author profiles are publicly visible once approved."],
        ["Children's data", "This site is not directed at children under 13. We do not knowingly collect data from children. Schools submitting requests are responsible for ensuring appropriate use."],
        ["Contact", "Questions about your data? Email us at privacy@findanauthor.org."],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h2>
          <p style={{ color: "var(--ink-soft)" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
