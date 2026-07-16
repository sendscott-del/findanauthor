import Link from "next/link";
import { notFound } from "next/navigation";
import BookCover from "@/components/book-cover";
import { serverClient } from "@/lib/supabase";
import { Author } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getAuthor(slug: string): Promise<Author | null> {
  const supabase = serverClient();
  const { data } = await supabase
    .from("wfr_authors")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return data ?? null;
}

/** Normalize a booking link: allow mailto: and bare domains. */
function bookingHref(url?: string): string | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("mailto:") || u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.includes("@") && !u.includes("/")) return `mailto:${u}`;
  return `https://${u}`;
}

export default async function AuthorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const offerings = author.visit_offerings ?? [];
  const inPersonOfferings = offerings.filter((o) => o.kind !== "virtual" && (o.kind as string) !== "free_virtual_qa");
  const hasInPerson = inPersonOfferings.length > 0;
  const virtualOffering = offerings.find((o) => o.kind === "virtual");
  const freeQa = author.offers_free_virtual_qa || offerings.some((o) => (o.kind as string) === "free_virtual_qa");

  const booking = bookingHref(author.booking_url || author.website_url);

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: "var(--paper-2)", borderBottom: "1.5px solid var(--line)", padding: "12px 0" }}>
        <div className="container">
          <Link href="/authors" style={{ fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", fontWeight: 600 }}>
            ← Back to directory
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 36, marginBottom: 52, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Headshot */}
          <div style={{ width: 260, aspectRatio: "4/5", borderRadius: 22, flexShrink: 0, position: "relative", overflow: "hidden", background: "var(--paper-2)", border: "1.5px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {author.photo_url ? (
              <img src={author.photo_url} alt={author.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", padding: "4px 8px" }}>
                Author headshot
              </span>
            )}
            {author.founding_author && (
              <div className="badge badge-founding" style={{ position: "absolute", top: 12, left: 12 }}>
                ✦ Founding Author
              </div>
            )}
            {author.offers_grant_visits && (
              <div className="badge badge-grant" style={{ position: "absolute", bottom: 12, left: 12 }}>
                ★ Grant visits open
              </div>
            )}
          </div>

          {/* Meta */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="eyebrow" style={{ color: "var(--ink-faint)", marginBottom: 12 }}>
              {author.genres?.join(" · ")}
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 8 }}>{author.name}</h1>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 18 }}>{author.tagline}</p>

            {/* Badge row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
              {author.founding_author && <span className="badge badge-founding">✦ Founding Author</span>}
              {author.grade_range?.map((g) => (
                <span key={g} className="badge badge-grade">{g}</span>
              ))}
              {hasInPerson && <span className="badge badge-in-person">📍 In-person</span>}
              {virtualOffering && <span className="badge badge-virtual">💻 Virtual</span>}
              {author.offers_title1_subsidy && (
                <span className="badge" style={{ background: "var(--blue-tint)", color: "var(--blue-deep)" }}>Title I rates</span>
              )}
              {freeQa && (
                <span className="badge" style={{ background: "var(--green-tint)", color: "var(--green-deep)" }}>Free virtual Q&amp;A</span>
              )}
              <span className="badge badge-verified">✓ Published &amp; vetted</span>
            </div>

            {/* Quickfacts */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
              {[
                ["Based in", `${author.location_city}, ${author.location_state}`],
                ["Local zone", `${author.local_radius_miles} mi · no travel fee`],
                ["Books published", `${author.books?.length ?? 0} titles`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content + sticky sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "flex-start" }} className="profile-layout">
          {/* Content column */}
          <div>
            {/* About */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 24, marginBottom: 14 }}>About {author.name?.split(" ")[0]}</h2>
              <p style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>{author.bio}</p>
            </section>

            <hr className="dotted-divider" style={{ marginBottom: 40, color: "var(--ink-faint)" }} />

            {/* Books */}
            {author.books?.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>Books</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="books-grid">
                  {author.books?.map((b, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <BookCover color={b.cover_color} title={b.title} />
                      <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 8, color: "var(--ink-soft)" }}>{b.title}</div>
                      {b.publisher && <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{b.publisher}{b.year ? `, ${b.year}` : ""}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <hr className="dotted-divider" style={{ marginBottom: 40, color: "var(--ink-faint)" }} />

            {/* Visit formats (no prices — pricing is requested directly) */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>Visit formats</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="formats-grid">
                {hasInPerson && (
                  <div className="card" style={{ padding: 22 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>📍</div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--orange-deep)", marginBottom: 5 }}>In-person</div>
                    <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 20, marginBottom: 10 }}>School visit</div>
                    <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--green-deep)", fontWeight: 600 }}>
                      ✓ No travel fee within {author.local_radius_miles} mi of {author.location_city}, {author.location_state}. Beyond that, travel is arranged together.
                    </div>
                  </div>
                )}

                {virtualOffering && (
                  <div className="card" style={{ padding: 22 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>💻</div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--blue-deep)", marginBottom: 5 }}>Virtual</div>
                    <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 20, marginBottom: 10 }}>Virtual visit</div>
                    <div style={{ background: "var(--blue-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--blue-deep)", fontWeight: 600 }}>
                      ✓ No travel — connect from anywhere. Often the most budget-friendly option.
                    </div>
                  </div>
                )}

                {freeQa && (
                  <div className="card" style={{ padding: 22, borderColor: "#BBDDD0" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>🎁</div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--green-deep)", marginBottom: 5 }}>Free</div>
                    <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 20, marginBottom: 10 }}>Virtual Q&amp;A</div>
                    <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--green-deep)", fontWeight: 600 }}>
                      ✓ Free for classrooms that have read at least one of {author.name?.split(" ")[0]}&apos;s books.
                    </div>
                  </div>
                )}
              </div>
            </section>

            <hr className="dotted-divider" style={{ marginBottom: 40, color: "var(--ink-faint)" }} />

            {/* What's included */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 24, marginBottom: 18 }}>What a visit includes</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="includes-grid">
                {["Pre-visit planning call", "Customized for your grade", "Q&A with students", "Live reading or demo",
                  "Signed book for library", "Optional writing activity", "Post-visit reflection guide", "Parent follow-up note"].map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14.5 }}>
                    <span style={{ color: "var(--green)", fontWeight: 800 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </section>

            {/* Grant section */}
            {author.offers_grant_visits && (
              <>
                <hr className="dotted-divider" style={{ marginBottom: 40, color: "var(--ink-faint)" }} />
                <section style={{ marginBottom: 40 }}>
                  <div style={{ background: "var(--green-tint)", border: "1.5px solid #BBDDD0", borderRadius: 22, padding: 28 }}>
                    <div className="eyebrow" style={{ color: "var(--green-deep)", marginBottom: 12 }}>Volunteer visits</div>
                    <h2 style={{ fontSize: 22, marginBottom: 6 }}>
                      {author.name?.split(" ")[0]} offers {author.grant_visits_per_year ?? author.grant_visits_remaining} free visits a year
                    </h2>
                    <p style={{ color: "var(--ink-soft)", marginBottom: 20, fontSize: 15 }}>
                      {author.grant_visits_remaining} remaining this year. Qualifying schools receive a fully-funded in-person or virtual visit.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        "Show the need — Title I, under-resourced, or stretched budget.",
                        "Name a staff lead who will own the day.",
                        "Put books in hands first — students read at least one book beforehand.",
                        "Keep it going — share a plan for sustaining reading excitement.",
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14.5 }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
                          <span style={{ color: "var(--ink-soft)" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/request?author=${author.slug}&grant=1`} className="btn btn-green" style={{ marginTop: 22 }}>
                      Apply for a grant visit →
                    </Link>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sticky request card */}
          <div className="card" style={{ padding: 28, position: "sticky", top: 80 }}>
            <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 22, marginBottom: 6 }}>
              Pricing &amp; availability
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>
              Fees vary by format, travel, and your school&apos;s needs. Reach out directly for a quote and open dates.
            </p>

            {author.offers_title1_subsidy && (
              <div style={{ background: "var(--blue-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--blue-deep)", fontWeight: 600, marginBottom: 10 }}>
                ✦ Subsidized rates available for Title I schools
              </div>
            )}
            {author.offers_grant_visits && (
              <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13.5, color: "var(--green-deep)", fontWeight: 600, marginBottom: 10 }}>
                ★ {author.grant_visits_remaining} free grant visit{(author.grant_visits_remaining ?? 0) !== 1 ? "s" : ""} remaining
              </div>
            )}
            {freeQa && (
              <div style={{ background: "var(--green-tint)", borderRadius: 10, padding: "10px 13px", fontSize: 13, color: "var(--green-deep)", fontWeight: 600, marginBottom: 16 }}>
                🎁 Free virtual Q&amp;A for classes that have read a book
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20, fontSize: 13.5 }}>
              {[
                ["Grade levels", author.grade_range?.join(", ") ?? ""],
                ["Local zone", `Free within ${author.local_radius_miles} mi`],
                ["Languages", author.languages?.join(", ") ?? ""],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line-soft)", paddingBottom: 9 }}>
                  <span style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</span>
                  <span style={{ fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>

            {booking ? (
              <a href={booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block btn-lg" style={{ marginBottom: 10 }}>
                Request Pricing &amp; Availability →
              </a>
            ) : (
              <a href={`mailto:hello@findanauthor.org?subject=Visit%20inquiry%20for%20${encodeURIComponent(author.name)}`} className="btn btn-primary btn-block btn-lg" style={{ marginBottom: 10 }}>
                Request Pricing &amp; Availability →
              </a>
            )}
            <button className="btn btn-ghost btn-block" style={{ marginBottom: 16 }}>♡ Save to shortlist</button>

            <div style={{ textAlign: "center", fontSize: 12.5, color: "var(--green-deep)", fontWeight: 700 }}>
              ✓ Background-checked &amp; publisher-verified
            </div>
          </div>
        </div>
      </div>

      {/* Author CTA band */}
      <section style={{ background: "var(--paper-2)", borderTop: "1.5px solid var(--line)", padding: "40px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)", marginBottom: 14, fontSize: 15.5 }}>Are you a published children's book author?</p>
          <Link href="/apply" className="btn btn-ghost">Create your author profile →</Link>
        </div>
      </section>

      <style>{`
        .profile-layout { @media (max-width: 940px) { grid-template-columns: 1fr !important; } }
        .books-grid { @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr) !important; } }
        .formats-grid { @media (max-width: 1040px) { grid-template-columns: 1fr !important; } }
        .includes-grid { @media (max-width: 640px) { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
