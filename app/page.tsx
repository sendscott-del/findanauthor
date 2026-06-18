import Link from "next/link";
import AuthorCard from "@/components/author-card";
import BookCarousel, { CarouselBook } from "@/components/book-carousel";
import { SEED_AUTHORS } from "@/lib/seed-data";
import { serverClient } from "@/lib/supabase";
import { Author } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getFeatured(): Promise<Partial<Author>[]> {
  try {
    const supabase = serverClient();
    const { data, error } = await supabase
      .from("wfr_authors")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    if (data && data.length) return data;
  } catch {
    /* fall through to seed */
  }
  return SEED_AUTHORS;
}

export default async function Home() {
  const all = await getFeatured();
  const featured = all.slice(0, 4);

  // Build the carousel from real book covers (fall back to seed colours).
  const books: CarouselBook[] = all
    .flatMap((a) => (a.books ?? []).map((b) => ({ color: b.cover_color, title: b.title })))
    .filter((b) => b.color);
  const carouselBooks: CarouselBook[] = (books.length >= 6 ? books : [
    { color: "#C7522A", title: "My Big World" },
    { color: "#2E8B6F", title: "Storm Riders" },
    { color: "#3A5A8C", title: "The Bee Why" },
    { color: "#E2A93B", title: "Iron Compass" },
    { color: "#7C6A9C", title: "Words That Break Walls" },
    { color: "#C7522A", title: "The Color of Home" },
    { color: "#2E8B6F", title: "Every Poem Is a Fist" },
    { color: "#3A5A8C", title: "The Last Cartographer" },
  ]).slice(0, 12);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ paddingTop: 80, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Soft blobs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "var(--orange-tint)", opacity: .35, filter: "blur(80px)", top: -100, left: "10%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "var(--green-tint)", opacity: .4, filter: "blur(80px)", top: 0, right: "12%", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 20 }}>
            Ignite a love of reading in every child
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

          {/* Rotating book shelf */}
          <BookCarousel books={carouselBooks} />
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
              { n: "1", color: "var(--orange)", title: "Find authors near you", body: "Search by your ZIP, grade level, and format. Local authors mean no travel costs — especially important for grant-funded visits." },
              { n: "2", color: "var(--green)", title: "Compare and shortlist", body: "Browse vetted, published authors who fit your school's needs. Filter for Title I rates, free virtual Q&As, and volunteer visits." },
              { n: "3", color: "var(--blue)", title: "Reach out directly", body: "Click “Request Pricing & Availability” to connect with the author or their agent, confirm details, and book the big day." },
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
                Browse vetted, published authors by location, grade level, and format. Searching the directory is free for your school, always.
              </p>
              <Link href="/authors" className="btn btn-primary">Browse authors →</Link>
            </div>
            <div style={{ background: "var(--blue-tint)", borderRadius: 24, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(58,90,140,.12)" }} />
              <div className="eyebrow" style={{ color: "var(--blue-deep)", marginBottom: 14 }}>For Authors</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 14 }}>Share your story with the next generation</h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: 28, fontSize: 15.5 }}>
                Set your visit formats and availability — your fees stay private. Offer a few free visits per year to schools that need you most. We never take a commission.
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
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>How it works</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                  <span>Grants cover the author's honorarium</span>
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  Travel isn't covered — so a <strong>local author</strong> stretches a grant furthest. Use the ZIP search to find authors near you.
                </div>
              </div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["✓ Published", "Traditional houses"],
                  ["✓ Visit experience", "Vetted for schools"],
                  ["✓ Background checked", "Before listing"],
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

      {/* ── Why it matters (cited data) ── */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 16 }}>Why it matters</div>
          <h2 style={{ fontSize: "clamp(24px, 3.2vw, 36px)", lineHeight: 1.2, margin: "0 auto 14px", maxWidth: 640 }}>
            Kids read more when reading feels like an <span className="squiggle">event</span> — and when someone they trust sparks it.
          </h2>
          <p style={{ color: "var(--ink-soft)", maxWidth: 560, margin: "0 auto", fontSize: 15.5 }}>
            Reading for fun drops sharply after age 9. A real author in the room turns reading into something kids want to do.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 48 }} className="stats-grid">
            {[
              { n: "52%", label: "of kids say they enjoy going to community events that involve reading", color: "var(--orange)" },
              { n: "70%", label: "of kids name a teacher or school librarian as someone who encourages them to read for fun", color: "var(--green)" },
              { n: "63%", label: "of kids get most of their books from a public, school, or classroom library", color: "var(--blue)" },
            ].map((s) => (
              <div key={s.n}>
                <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", color: s.color, lineHeight: 1 }}>{s.n}</div>
                <div style={{ color: "var(--ink-soft)", fontSize: 14.5, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 28 }}>
            Source: <a href="https://www.scholastic.com/content/corp-home/kids-and-family-reading-report/key-findings.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink-faint)", textDecoration: "underline" }}>Scholastic Kids &amp; Family Reading Report</a>, 8th edition (2023).
          </p>
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
            {[0, 1].map((i) => (
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
