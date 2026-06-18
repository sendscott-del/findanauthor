"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, BookOpen, Shield, Star, Users } from "lucide-react";

const STEPS = ["Your books", "Visit info", "Vetting", "Review"];

export default function ApplyPage() {
  const [step, setStep] = useState<"landing" | "form" | "done">("landing");
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", email: "",
    website_url: "", amazon_url: "",
    book_title: "", publisher: "", isbn: "",
    years_visiting: "", school_visit_references: "",
    background_check_consent: false,
    why_join: "",
    // auto-fetched fields
    fetched_bio: "", fetched_genres: [] as string[],
    // visit prefs
    visit_formats: [] as string[],
    grades: [] as string[],
    local_radius: "30",
    booking_url: "",
    offers_grant: false, grant_visits_per_year: "3",
    offers_title1_subsidy: false,
    offers_free_virtual_qa: false,
    languages: [] as string[],
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArr = (key: string, val: string) => {
    const arr = (form as any)[key] as string[];
    set(key, arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);
  };

  const lookupFromURL = async (url: string) => {
    if (!url) return;
    setLookupLoading(true);
    try {
      const res = await fetch("/api/lookup-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.title) set("book_title", data.title);
      if (data.publisher) set("publisher", data.publisher);
      if (data.isbn) set("isbn", data.isbn);
      if (data.bio) set("fetched_bio", data.bio);
    } catch { /* silent */ }
    finally { setLookupLoading(false); }
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.name) e.name = "Required";
      if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
      if (!form.book_title) e.book_title = "Required";
      if (!form.publisher) e.publisher = "Publisher is required — we only list traditionally published authors";
    }
    if (s === 1) {
      if (!form.visit_formats.length) e.visit_formats = "Select at least one format";
      if (!form.grades.length) e.grades = "Select at least one grade level";
    }
    if (s === 2) {
      if (!form.years_visiting) e.years_visiting = "Required";
      if (!form.background_check_consent) e.background_check = "Required to join";
      if (!form.why_join) e.why_join = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(formStep)) setFormStep((s) => s + 1); };
  const backStep = () => { setFormStep((s) => s - 1); setErrors({}); };

  const handleSubmit = async () => {
    if (!validateStep(formStep)) return;
    setLoading(true);
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStep("done");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const fieldErr = (k: string) => errors[k] ? (
    <div style={{ color: "var(--orange-deep)", fontSize: 13, marginTop: 4, fontWeight: 600 }}>{errors[k]}</div>
  ) : null;

  if (step === "done") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={38} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 30, marginBottom: 12 }}>Application received!</h2>
        <p style={{ color: "var(--ink-soft)", marginBottom: 12, fontSize: 16 }}>
          Thanks, {form.name.split(" ")[0]}. We'll verify your publication credentials and reach out within 3–5 business days.
        </p>
        <p style={{ color: "var(--ink-soft)", marginBottom: 32, fontSize: 15 }}>
          Once approved, you'll receive a link to complete your full profile — including your author photo, all your books, availability calendar, and visit offerings.
        </p>
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    );
  }

  if (step === "landing") {
    return (
      <>
        {/* Hero */}
        <section style={{ background: "var(--paper-2)", padding: "64px 0 52px", borderBottom: "1.5px solid var(--line)" }}>
          <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center", color: "var(--blue-deep)", marginBottom: 16 }}>For authors</div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", marginBottom: 18 }}>
              Reach classrooms that need your story.
            </h1>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 36, maxWidth: 540, margin: "0 auto 36px" }}>
              Join a vetted directory of children's book authors ready to visit schools. Set your formats, pricing, and availability — we handle the matching.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setStep("form")}>Apply to join →</button>
          </div>
        </section>

        {/* How vetting works */}
        <section className="section" id="vetting">
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div className="eyebrow" style={{ justifyContent: "center", color: "var(--orange-deep)", marginBottom: 14 }}>Our standards</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}>Why vetting matters — and how it works</h2>
              <p style={{ color: "var(--ink-soft)", maxWidth: 540, margin: "16px auto 0", fontSize: 15.5 }}>
                Schools trust this directory. That trust is built on knowing every author here has cleared the same bar.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="vet-grid">
              {[
                { icon: <BookOpen size={22} />, color: "var(--blue)", title: "Traditionally published", body: "We verify your publisher against a curated list of traditional publishers. Self-published titles aren't eligible — this protects school trust." },
                { icon: <Users size={22} />, color: "var(--orange)", title: "School visit experience", body: "You'll share how many schools you've visited and optionally provide references. New authors with limited visits can still qualify." },
                { icon: <Shield size={22} />, color: "var(--green)", title: "Background check", body: "All authors complete a background check before being listed. We use a streamlined service — you'll get a link during onboarding." },
                { icon: <Star size={22} />, color: "var(--gold)", title: "Ongoing quality", body: "Schools leave feedback after visits. Authors with consistently low ratings are reviewed. The bar stays high for everyone." },
              ].map((item, i) => (
                <div key={i} className="card" style={{ padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + "22", display: "flex", alignItems: "center", justifyContent: "center", color: item.color, marginBottom: 14 }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <style>{`.vet-grid { @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr) !important; } } .vet-grid { @media (max-width: 480px) { grid-template-columns: 1fr !important; } }`}</style>
        </section>

        {/* FAQ */}
        <section className="section-sm" id="faq" style={{ background: "var(--paper-2)", borderTop: "1.5px solid var(--line)" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <h2 style={{ fontSize: 28, marginBottom: 28, textAlign: "center" }}>Common questions</h2>
            {[
              ["Is it free to be listed?", "Yes — always. We don't take a commission. Authors keep 100% of their visit fees."],
              ["What counts as traditionally published?", "A book published by a publisher that paid you an advance — major houses (Scholastic, HarperCollins, Penguin Random House, etc.) or respected independent publishers. Amazon KDP, IngramSpark self-pub, or pay-to-publish models are not eligible."],
              ["Can I set my own pricing?", "Yes. You control your rates for local, out-of-area, and virtual visits. You can also set the radius within which in-person visits are fee-free."],
              ["Do I have to offer free visits?", "No. The volunteer grant program is optional. Many authors choose to offer a few free visits per year to Title I or under-resourced schools — it's a powerful differentiator and a way to give back."],
              ["How does the background check work?", "After your application is approved, we send you a link to a third-party background check service. The cost is covered by Writers for Readers."],
            ].map(([q, a]) => (
              <div key={q} style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 6 }}>{q}</div>
                <div style={{ color: "var(--ink-soft)", fontSize: 15 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "52px 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 28, marginBottom: 14 }}>Ready to apply?</h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: 28, fontSize: 15.5 }}>It takes about 5 minutes. We'll follow up within 3–5 business days.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setStep("form")}>Apply to join →</button>
          </div>
        </section>
      </>
    );
  }

  // Form view
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Author application</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15 }}>Step {formStep + 1} of {STEPS.length} — {STEPS[formStep]}</p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div className={`step-dot${i < formStep ? " done" : i === formStep ? " active" : ""}`}>
                {i < formStep ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: i === formStep ? "var(--orange)" : i < formStep ? "var(--green)" : "var(--ink-faint)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-bar${i < formStep ? " done" : ""}`} style={{ margin: "0 4px", marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      {formStep === 0 && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 22 }}>About you and your books</h2>
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">Your full name *</label>
                <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Maria Rodriguez" />
                {fieldErr("name")}
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@yoursite.com" />
                {fieldErr("email")}
              </div>
            </div>

            {/* Smart URL lookup */}
            <div style={{ background: "var(--green-tint)", border: "1.5px solid #BBDDD0", borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--green-deep)", marginBottom: 6 }}>✦ Paste a link to save time</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 12, margin: "0 0 12px" }}>
                Drop your Amazon author page or website URL and we'll pull your book info automatically.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <input className="form-input" value={form.amazon_url} onChange={(e) => set("amazon_url", e.target.value)}
                  placeholder="https://amazon.com/... or https://yourwebsite.com" style={{ flex: 1 }} />
                <button className="btn btn-green btn-sm" style={{ flexShrink: 0 }}
                  onClick={() => lookupFromURL(form.amazon_url || form.website_url)}
                  disabled={lookupLoading}>
                  {lookupLoading ? "Looking…" : "Import →"}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">Title of your primary book *</label>
              <input className="form-input" value={form.book_title} onChange={(e) => set("book_title", e.target.value)} placeholder="The Color of Home" />
              {fieldErr("book_title")}
            </div>
            <div>
              <label className="form-label">Publisher * <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>(traditional publishers only)</span></label>
              <input className="form-input" value={form.publisher} onChange={(e) => set("publisher", e.target.value)} placeholder="Scholastic, HarperCollins, Penguin Random House…" />
              {fieldErr("publisher")}
              <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 5 }}>Self-published titles are not eligible. <Link href="/apply#faq" style={{ color: "var(--orange)" }}>Learn why</Link></div>
            </div>
            <div>
              <label className="form-label">ISBN (optional — helps us verify faster)</label>
              <input className="form-input" value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="978-0-439-02348-1" />
            </div>
            <div>
              <label className="form-label">Your website (optional)</label>
              <input className="form-input" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://yoursite.com" />
            </div>
          </div>
        </div>
      )}

      {formStep === 1 && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 22 }}>Visit preferences</h2>
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <label className="form-label">Visit formats you offer *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["In-person (local)", "In-person (out of area)", "Virtual"].map((f) => (
                  <button key={f} className={`chip${form.visit_formats.includes(f) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("visit_formats", f)}>{f}</button>
                ))}
              </div>
              {fieldErr("visit_formats")}
            </div>
            <div>
              <label className="form-label">Grade levels you serve *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["Pre-K", "K–2", "3–5", "6–8", "9–12"].map((g) => (
                  <button key={g} className={`chip${form.grades.includes(g) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("grades", g)}>{g}</button>
                ))}
              </div>
              {fieldErr("grades")}
            </div>
            {form.visit_formats.some((f) => f.includes("local")) && (
              <div>
                <label className="form-label">Local travel radius (miles, no extra fee)</label>
                <input className="form-input" type="number" value={form.local_radius} onChange={(e) => set("local_radius", e.target.value)} style={{ maxWidth: 140 }} />
              </div>
            )}
            <div>
              <label className="form-label">Pricing &amp; booking link (optional)</label>
              <input className="form-input" type="url" value={form.booking_url} onChange={(e) => set("booking_url", e.target.value)} placeholder="https://yoursite.com/school-visits or mailto:agent@agency.com" />
              <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 5 }}>Your fees stay private. Schools click “Request Pricing &amp; Availability” to reach you or your agent here. You can change this later.</div>
            </div>
            <div>
              <label className="form-label">Languages you present in</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["English", "Spanish", "French", "Mandarin", "Arabic", "Other"].map((l) => (
                  <button key={l} className={`chip${form.languages.includes(l) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("languages", l)}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--green-tint)", border: "1.5px solid #BBDDD0", borderRadius: 16, padding: 20 }}>
              <label style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <input type="checkbox" checked={form.offers_grant} onChange={(e) => set("offers_grant", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--green)", marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--green-deep)", marginBottom: 4 }}>★ Offer volunteer (grant) visits</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>I'm willing to do a few free visits per year for qualifying schools. This badge makes your profile stand out to Title I schools.</div>
                </div>
              </label>
              {form.offers_grant && (
                <div style={{ marginTop: 14 }}>
                  <label className="form-label">How many free visits per year?</label>
                  <input className="form-input" type="number" value={form.grant_visits_per_year} onChange={(e) => set("grant_visits_per_year", e.target.value)} style={{ maxWidth: 100 }} min={1} max={20} />
                </div>
              )}
            </div>
            <div style={{ background: "var(--blue-tint)", border: "1.5px solid var(--blue)", borderRadius: 16, padding: 20 }}>
              <label style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <input type="checkbox" checked={form.offers_title1_subsidy} onChange={(e) => set("offers_title1_subsidy", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--blue)", marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--blue-deep)", marginBottom: 4 }}>Offer subsidized rates for Title I schools</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>I offer reduced rates for Title I / high-need schools. They can filter for this, and you'll get a “Title I rates” badge.</div>
                </div>
              </label>
            </div>
            <div style={{ background: "var(--green-tint)", border: "1.5px solid #BBDDD0", borderRadius: 16, padding: 20 }}>
              <label style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <input type="checkbox" checked={form.offers_free_virtual_qa} onChange={(e) => set("offers_free_virtual_qa", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--green)", marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--green-deep)", marginBottom: 4 }}>Offer a free virtual Q&amp;A</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>A short, no-cost video Q&amp;A for classrooms that have read at least one of my books.</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {formStep === 2 && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 22 }}>Vetting & background check</h2>
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <label className="form-label">Years visiting schools *</label>
              <select className="form-input" value={form.years_visiting} onChange={(e) => set("years_visiting", e.target.value)} style={{ maxWidth: 260 }}>
                <option value="">Select…</option>
                {["This will be my first", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {fieldErr("years_visiting")}
            </div>
            <div>
              <label className="form-label">School visit references (optional — speeds up review)</label>
              <textarea className="form-input" value={form.school_visit_references} onChange={(e) => set("school_visit_references", e.target.value)} rows={3} placeholder="Name, school, email of a librarian or teacher who can vouch for your visits…" style={{ resize: "vertical" }} />
            </div>
            <div>
              <label className="form-label">Why do you want to join Writers for Readers? *</label>
              <textarea className="form-input" value={form.why_join} onChange={(e) => set("why_join", e.target.value)} rows={3} placeholder="I believe author visits are one of the most powerful ways to get kids excited about reading…" style={{ resize: "vertical" }} />
              {fieldErr("why_join")}
            </div>
            <div style={{ background: "var(--blue-tint)", border: "1.5px solid var(--blue)", borderRadius: 16, padding: 20 }}>
              <label style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}>
                <input type="checkbox" checked={form.background_check_consent} onChange={(e) => set("background_check_consent", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--blue)", marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--blue-deep)", marginBottom: 4 }}>✓ I consent to a background check</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>After approval, you'll receive a link to complete a background check at no cost to you. This is required to be listed in the directory.</div>
                </div>
              </label>
              {fieldErr("background_check")}
            </div>
          </div>
        </div>
      )}

      {formStep === 3 && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 22 }}>Review your application</h2>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            {[
              ["Name", form.name],
              ["Email", form.email],
              ["Book", form.book_title],
              ["Publisher", form.publisher],
              ["Visit formats", form.visit_formats.join(", ") || "Not set"],
              ["Grades", form.grades.join(", ") || "Not set"],
              ["Languages", form.languages.join(", ") || "English"],
              ["Volunteer visits", form.offers_grant ? `Yes — ${form.grant_visits_per_year}/year` : "No"],
              ["Title I subsidized rates", form.offers_title1_subsidy ? "Yes" : "No"],
              ["Free virtual Q&A", form.offers_free_virtual_qa ? "Yes" : "No"],
              ["School experience", form.years_visiting],
              ["Background check", form.background_check_consent ? "Consented" : "Not consented"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--line-soft)", fontSize: 14 }}>
                <span style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--orange-tint)", borderRadius: 14, padding: "14px 18px", fontSize: 14, color: "var(--orange-deep)", fontWeight: 600, marginBottom: 12 }}>
            📋 After submission, our team will verify your publisher credentials (usually 3–5 business days) and send you a background check link.
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
        {formStep > 0 ? (
          <button className="btn btn-ghost" onClick={backStep}>← Back</button>
        ) : (
          <button className="btn btn-ghost" onClick={() => setStep("landing")}>← Cancel</button>
        )}
        {formStep < 3 ? (
          <button className="btn btn-primary" onClick={nextStep}>Continue →</button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit application →"}
          </button>
        )}
      </div>
    </div>
  );
}
