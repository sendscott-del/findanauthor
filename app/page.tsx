import Link from "next/link";
import AuthorCard from "@/components/author-card";
import BookCover from "@/components/book-cover";
import { SEED_AUTHORS, COVER_COLORS } from "@/lib/seed-data";

export default function Home() {
  const featured = SEED_AUTHORS.slice(0, 4);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Soft blobs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "var(--orange-tint)", opacity: .35, filter: "blur(80px)", top: -100, left: "10%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "var(--green-tint)", opacity: .4, filter: "blur(80px)", top: 0, right: "12%", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 20 }}>
            Free · No cost to schools, ever
          </div>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 66px)", margin: "0 auto 22px", maxWidth: 700 }}>
            Bring a <span className="squiggle">real author</span> to your classroom.
          </h1>
          <p style={{ fontSize: 19, color: "var(--ink-soft)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.65 }}>
            We match schools with published children's book authors for unforgettable visits — including free volunteer visits for schools that need them most.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/authors" className="btn btn-primary btn-lg">Find an author →</Link>
            <Link href="/apply" className="btn btn-ghost btn-lg">I'm an author →</Link>
          </div>

          {/* Tilted book row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 56, alignItems: "flex-end" }}>
            {[
              { color: "#C7522A", rot: -8, title: "My Big World" },
              { color: "#2E8B6F", rot: -3, title: "Storm Riders" },
              { color: "#3A5A8C", rot: 2, title: "The Bee Why" },
              { color: "#E2A93B", rot: 7, title: "Iron Compass" },
            ].map((b, i) => (
              <div key={i} style={{ transform: `rotate(${b.rot}deg)`, width: 80, transition: "transform .2s" }}
                className="book-tilt"
              >
                <BookCover color={b.color} title={b.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section" id="how" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 16 }}>
              Simple process
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>How it works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="how-grid">
            {[
              { n: "1", color: "var(--orange)", title: "Tell us what you need", body: "Share your grade level, format preference, dates, and budget — including whether you're hoping for a volunteer visit." },
              { n: "2", color: "var(--green)", title: "Get matched with authors", body: "We surface authors who fit your school's needs, location, and budget. Filter by grade, format, and more." },
              { n: "3", color: "var(--blue)", title: "Book the big day", body: "Connect directly with your match, confirm details, and get ready for a day your students will remember for years." },
            ].map((s) => (
              <div key={s.n} className="card" style={{ padding: 32 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Young Serif', Georgia, serif", fontSize: 22, color: "white",
                  marginBottom: 20,
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "var(--ink-soft)", fontSize: 15.5, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`.how-grid { @media (max-width: 860px) { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Two paths ── */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="paths-grid">
            <div style={{ background: "var(--orange-tint)", borderRadius: 24, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(232,116,59,.15)" }} />
              <div className="eyebrow" style={{ color: "var(--orange-deep)", marginBottom: 14 }}>For Educators</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 14 }}>Find the perfect author for your class</h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: 28, fontSize: 15.5 }}>
                Browse vetted, published authors by grade level, format, and budget. Submit a request in minutes — free for your school, always.
              </p>
              <Link href="/request" className="btn btn-primary">Request a visit →</Link>
            </div>
            <div style={{ background: "var(--blue-tint)", borderRadius: 24, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(58,90,140,.12)" }} />
              <div className="eyebrow" style={{ color: "var(--blue-deep)", marginBottom: 14 }}>For Authors</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 14 }}>Share your story with the next generation</h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: 28, fontSize: 15.5 }}>
                Set your visit formats, pricing, and availability. Offer a few free visits per year to schools that need you most. We handle the matching.
              </p>
              <Link href="/apply" className="btn btn-white">Apply to join →</Link>
            </div>
          </div>
        </div>
        <style>{`.paths-grid { @media (max-width: 860px) { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Featured authors ── */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--orange-deep)", marginBottom: 12 }}>Featured</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", margin: 0 }}>Authors ready to visit</h2>
            </div>
            <Link href="/authors" className="btn btn-ghost btn-sm">Browse all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="author-grid">
            {featured.map((a) => (
              <AuthorCard key={a.slug} author={a as any} />
            ))}
          </div>
        </div>
        <style>{`
          .author-grid { @media (max-width: 980px) { grid-template-columns: repeat(2, 1fr) !important; } }
          .author-grid { @media (max-width: 540px) { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── Grant explainer ── */}
      <section className="section" id="grant" style={{ background: "var(--green-tint)", borderTop: "1.5px solid #BBDDD0", borderBottom: "1.5px solid #BBDDD0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "start" }} className="grant-grid">
            <div>
              <div className="eyebrow" style={{ color: "var(--green-deep)", marginBottom: 16 }}>Volunteer visits</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", marginBottom: 20 }}>Free visits, earned — not just handed out.</h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: 28, fontSize: 15.5, maxWidth: 520 }}>
                Our volunteer visit program connects Title I schools and under-resourced classrooms with authors who believe every kid deserves this experience. Both sides earn the match.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {[
                  ["Show the need", "Title I schools, stretched budgets, limited arts programming — demonstrate why this visit matters."],
                  ["Show the commitment", "Name a staff lead, describe how you'll prepare students, and plan to sustain the excitement."],
                  ["Make the day count", "Authors give their best; schools give the infrastructure to make it land."],
                ].map(([title, body], i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: "var(--green)",
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Mulish', sans-serif", fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 2,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{title}</div>
                      <div style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>{body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/request" className="btn btn-green">Apply for a volunteer visit →</Link>
            </div>

            {/* Grant card */}
            <div className="card" style={{ padding: 28, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span className="badge badge-grant">★ Grant visits</span>
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Marisol Vega</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                  <span>3 of 5 grant visits remaining</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--line)", overflow: "hidden" }}>
                  <div style={{ width: "60%", height: "100%", background: "var(--green)", borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["✓ Published", "3 Scholastic titles"],
                  ["✓ Visit experience", "80+ schools visited"],
                  ["✓ Background checked", "Cleared 2024"],
                ].map(([label, sub]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--line-soft)" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--green-deep)" }}>{label}</span>
                    <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`.grant-grid { @media (max-width: 860px) { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Quote + stats ── */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <blockquote style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.35, margin: "0 0 12px" }}>
            "An author visit is one of the few things that can open <span className="squiggle">doors</span> to reading that nothing else can."
          </blockquote>
          <cite style={{ fontStyle: "normal", fontSize: 14, color: "var(--ink-faint)", fontWeight: 600 }}>— School Library Journal</cite>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 56 }} className="stats-grid">
            {[
              { n: "73%", label: "of students read more after an author visit", color: "var(--orange)" },
              { n: "9 in 10", label: "teachers say visits spark lasting excitement", color: "var(--green)" },
              { n: "1,900+", label: "visits matched through our network", color: "var(--blue)" },
            ].map((s) => (
              <div key={s.n}>
                <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", color: s.color, lineHeight: 1 }}>{s.n}</div>
                <div style={{ color: "var(--ink-soft)", fontSize: 14.5, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`.stats-grid { @media (max-width: 640px) { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Closing CTA ── */}
      <section style={{ padding: "0 0 76px" }}>
        <div className="container">
          <div style={{
            background: "var(--ink)", borderRadius: 28, padding: "56px 48px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            {/* Accent dots */}
            {[["-30px", "-30px", "var(--orange-tint)"], ["right:-30px", "top:-30px", "var(--green-tint)"]].map((_, i) => (
              <div key={i} style={{
                position: "absolute", width: 120, height: 120, borderRadius: "50%",
                background: i === 0 ? "rgba(232,116,59,.15)" : "rgba(46,139,111,.15)",
                [i === 0 ? "left" : "right"]: -30, [i === 0 ? "bottom" : "top"]: -30,
              }} />
            ))}
            <h2 style={{ color: "white", fontSize: "clamp(26px, 3.5vw, 40px)", marginBottom: 14, position: "relative" }}>
              Ready to bring a story to life?
            </h2>
            <p style={{ color: "rgba(255,255,255,.65)", maxWidth: 480, margin: "0 auto 32px", fontSize: 16 }}>
              Whether you're a teacher looking for the perfect author or an author ready to inspire the next generation, this is where it starts.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/authors" className="btn btn-primary btn-lg">Find an author</Link>
              <Link href="/apply" className="btn btn-white btn-lg">Join as an author</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
