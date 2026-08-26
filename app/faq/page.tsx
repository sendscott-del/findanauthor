import Link from "next/link";

export const metadata = {
  title: "FAQ — Writers for Readers",
  description: "Answers to common questions for educators and authors about findanauthor.org.",
};

const EDUCATOR_FAQS: [string, React.ReactNode][] = [
  [
    "Is findanauthor.org free for schools to use?",
    "Yes, absolutely. Our mission is to remove barriers between classrooms and creators. The database is entirely free for teachers, librarians, and school administrators to search and use to connect with authors.",
  ],
  [
    "Does findanauthor.org book the author for us?",
    "No. We are a direct pairing tool, not a booking agency. When you find an author you love, clicking the contact button allows you to message them (or their designated representative) directly to coordinate dates, curriculum alignment, and logistics.",
  ],
  [
    "We are a Title I school with zero budget for author visits. Can we still use this site?",
    "Yes! When searching the database, you can filter for authors who offer virtual visits (which are often more budget-friendly) or those who have indicated they offer subsidized or pro-bono visits for high-need schools. Some authors even offer free virtual Q&As for classrooms that have read at least one of their books. Long-term, our foundation is actively working to secure grants to fully fund visits for Title I schools.",
  ],
  [
    "How do we know the authors on this site are safe and appropriate for our students?",
    "Every author on our platform is traditionally published through established publishing houses, meaning their work has undergone professional editorial, legal, and educational vetting, and is verified by the Writers for Readers team before being listed. Schools are always encouraged to perform their standard district-mandated background checks and clearances with the individual author during the contract process.",
  ],
];

const AUTHOR_FAQS: [string, React.ReactNode][] = [
  [
    "Who is eligible to create an author profile on findanauthor.org?",
    <>
      <p style={{ margin: "0 0 12px" }}>
        Currently, findanauthor.org is open to authors and illustrators whose work has been published by traditional publishing houses (including major publishers, mid-sized houses, and established independent/academic presses).
      </p>
      <p style={{ margin: "0 0 12px" }}>
        Because our platform is designed to be a direct, streamlined tool for educators and school districts, we rely on the traditional publishing industry&apos;s established infrastructure to serve as an initial benchmark for curation and educational alignment. As a small, growing organization, this allows us to guarantee schools a consistent, vetted standard of material without requiring our internal team to manually review individual titles.
      </p>
      <p style={{ margin: 0 }}>
        We deeply respect the dedication and creativity of the self-publishing community. While our current launch phase focuses exclusively on traditionally published creators, we look forward to exploring how we might expand our parameters and support a wider array of indie creators as our foundation&apos;s resources grow.
      </p>
    </>,
  ],
  [
    "Does findanauthor.org take a commission or fee from my school visits?",
    "Never. We do not act as a booking agent, and we do not take a single cent from your appearance fees. 100% of the money negotiated between you and the school stays with you. We are funded by separate foundation grants and corporate sponsorships, not by taxing creators.",
  ],
  [
    "Why aren't my school visit fees listed publicly on my profile?",
    "We believe pricing flexibility is essential for authors. Factors like travel, the number of presentations, and whether a school is underfunded all impact your rate. Instead of a public price tag, your profile features a “Request Pricing & Availability” button, allowing you to have private, nuanced financial conversations with educators based on their specific needs.",
  ],
  [
    "I already have a booking agent. Can I still join?",
    "Yes! We highly encourage represented authors to sign up. On your profile setup page, you can easily route the “Request Pricing & Availability” button directly to your agent's email or agency website, ensuring your current representation workflow stays completely intact.",
  ],
  [
    "What if I only want to do virtual visits right now?",
    "Your profile is fully customizable. You can toggle your availability to show whether you do in-person visits, virtual-only visits, or both. You can also specify the geographic regions you are willing to travel to.",
  ],
  [
    "How do I get the “Founding Author” badge on my profile?",
    "The Founding Author designation is an exclusive badge awarded to creators who join us during our initial launch and beta-testing phase. Once this phase closes, new profiles will feature our standard verified creator layout.",
  ],
  [
    "How do I edit my profile after it's live?",
    <>
      <p style={{ margin: "0 0 12px" }}>
        Click <strong>Sign in</strong> in the top menu and enter the email on your author profile. We&apos;ll email you a secure one-tap sign-in link — there&apos;s no password to remember.
      </p>
      <p style={{ margin: 0 }}>
        Once you&apos;re in, your dashboard lets you update your bio, photo, location, visit formats, website and booking links, and your subsidy/Q&A offers any time. Changes go live on your public page immediately.
      </p>
    </>,
  ],
];

function Accordion({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map(([q, a], i) => (
        <details key={i} className="faq-item">
          <summary className="faq-summary">
            <span>{q}</span>
            <span className="faq-chevron" aria-hidden>+</span>
          </summary>
          <div className="faq-body">{typeof a === "string" ? <p style={{ margin: 0 }}>{a}</p> : a}</div>
        </details>
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <section style={{ background: "var(--paper-2)", borderBottom: "1.5px solid var(--line)", padding: "56px 0 44px" }}>
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 14 }}>Help center</div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: 14 }}>Frequently asked questions</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
            Everything educators and authors ask us most. Click any question to expand it.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 760, padding: "48px 20px 72px" }}>
        <h2 style={{ fontSize: 26, marginBottom: 18 }}>For Educators</h2>
        <Accordion items={EDUCATOR_FAQS} />

        <h2 style={{ fontSize: 26, margin: "44px 0 18px" }}>For Authors</h2>
        <Accordion items={AUTHOR_FAQS} />

        <div style={{ marginTop: 48, textAlign: "center", background: "var(--paper-2)", border: "1.5px solid var(--line)", borderRadius: 20, padding: "32px 24px" }}>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>Still have a question?</h3>
          <p style={{ color: "var(--ink-soft)", fontSize: 15, marginBottom: 18 }}>We're happy to help — reach out any time.</p>
          <Link href="/contact" className="btn btn-primary">Contact us →</Link>
        </div>
      </div>

      <style>{`
        .faq-item {
          background: var(--card);
          border: 1.5px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
        }
        .faq-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          font-weight: 800;
          font-size: 16.5px;
          font-family: 'Mulish', sans-serif;
          color: var(--ink);
        }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-chevron {
          flex-shrink: 0;
          font-size: 22px;
          line-height: 1;
          color: var(--orange);
          transition: transform .2s ease;
        }
        details[open] .faq-chevron { transform: rotate(45deg); }
        details[open] .faq-summary { color: var(--orange-deep); }
        .faq-body {
          padding: 0 22px 20px;
          color: var(--ink-soft);
          font-size: 15.5px;
          line-height: 1.7;
        }
      `}</style>
    </>
  );
}
