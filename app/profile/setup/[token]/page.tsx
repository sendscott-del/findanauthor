"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Step = "loading" | "invalid" | "expired" | "done" | 1 | 2 | 3;

const GRADE_OPTIONS = ["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const FORMAT_OPTIONS = [
  { value: "in_person_assembly", label: "In-person assembly" },
  { value: "in_person_classroom", label: "In-person classroom" },
  { value: "virtual", label: "Virtual" },
];

export default function ProfileSetupPage() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<Step>("loading");
  const [tokenData, setTokenData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    // Step 1 — Bio & photo
    tagline: "",
    bio: "",
    photo_url: "",
    location_city: "",
    location_state: "",
    website_url: "",
    // Step 2 — Visit details
    grade_range: [] as string[],
    visit_formats: [] as string[],
    local_radius: "30",
    base_price_local: "650",
    base_price_virtual: "300",
    offers_grant_visits: false,
    grant_visits_per_year: "3",
    // Step 3 — Final touches
    languages: "English",
    genres: "",
    themes: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArr(field: "grade_range" | "visit_formats", val: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  useEffect(() => {
    async function verifyToken() {
      const res = await fetch(`/api/profile/verify-token?token=${token}`);
      const json = await res.json();
      if (!res.ok || json.error) { setStep("invalid"); return; }
      if (json.expired) { setStep("expired"); return; }
      if (json.used) { setStep("done"); return; }
      setTokenData(json);
      // Pre-fill from application data
      if (json.application) {
        setForm((prev) => ({
          ...prev,
          location_city: json.application.location_city ?? "",
          location_state: json.application.location_state ?? "",
          website_url: json.application.website_url ?? "",
          grade_range: json.application.grades ?? [],
          visit_formats: json.application.visit_formats ?? [],
          base_price_local: String(json.application.base_price_local ?? 650),
          base_price_virtual: String(json.application.base_price_virtual ?? 300),
          offers_grant_visits: json.application.offers_grant ?? false,
          grant_visits_per_year: String(json.application.grant_visits_per_year ?? 3),
        }));
      }
      setStep(1);
    }
    verifyToken();
  }, [token]);

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.tagline.trim()) e.tagline = "Required";
      if (!form.bio.trim()) e.bio = "Required";
      if (!form.location_city.trim()) e.location_city = "Required";
      if (!form.location_state.trim()) e.location_state = "Required";
    }
    if (s === 2) {
      if (form.grade_range.length === 0) e.grade_range = "Select at least one";
      if (form.visit_formats.length === 0) e.visit_formats = "Select at least one";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && validate(1)) setStep(2);
    else if (step === 2 && validate(2)) setStep(3);
  }

  async function submit() {
    setSaving(true);
    const res = await fetch("/api/profile/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, form, tokenData }),
    });
    if (res.ok) setStep("done");
    else {
      const json = await res.json();
      setErrors({ _: json.error ?? "Something went wrong. Please try again." });
    }
    setSaving(false);
  }

  if (step === "loading") {
    return (
      <div className="container" style={{ paddingTop: 80, textAlign: "center" }}>
        <p style={{ color: "var(--ink-soft)" }}>Verifying your setup link…</p>
      </div>
    );
  }

  if (step === "invalid") {
    return (
      <div className="container" style={{ paddingTop: 80, maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
        <h1 style={{ fontSize: 26 }}>Link not found</h1>
        <p style={{ color: "var(--ink-soft)" }}>This setup link is invalid. Please check your email or contact <a href="mailto:authors@findanauthor.org">authors@findanauthor.org</a>.</p>
      </div>
    );
  }

  if (step === "expired") {
    return (
      <div className="container" style={{ paddingTop: 80, maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏰</div>
        <h1 style={{ fontSize: 26 }}>Link expired</h1>
        <p style={{ color: "var(--ink-soft)" }}>Setup links expire after 7 days. Email <a href="mailto:authors@findanauthor.org">authors@findanauthor.org</a> and we'll send a new one.</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="container" style={{ paddingTop: 80, maxWidth: 540, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 30 }}>Your profile is live!</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          Schools and librarians can now find and request you on Writers for Readers.
        </p>
        <a href="/authors" className="btn btn-primary">See the author directory →</a>
      </div>
    );
  }

  const stepTitles = ["Your bio", "Visit details", "Final touches"];
  const currentStep = step as number;

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 620 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ color: "var(--orange-deep)", marginBottom: 10 }}>Profile Setup</div>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Welcome to Writers for Readers!</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15 }}>
          You're approved. Let's build your public profile — it takes about 5 minutes.
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
        {stepTitles.map((title, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 2, marginBottom: 6,
              background: i + 1 <= currentStep ? "var(--orange)" : "var(--line)",
            }} />
            <div style={{ fontSize: 12, color: i + 1 === currentStep ? "var(--orange-deep)" : "var(--ink-faint)", fontWeight: i + 1 === currentStep ? 700 : 400 }}>
              {i + 1}. {title}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28 }}>
        {/* Step 1 — Bio & photo */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Your bio & basics</h2>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Tagline <span style={{ color: "var(--orange)" }}>*</span></span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="e.g. Author of bilingual picture books about family & culture" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
              {errors.tagline && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.tagline}</span>}
            </label>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Author bio <span style={{ color: "var(--orange)" }}>*</span></span>
              <textarea className="form-input" rows={5} style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }} placeholder="Tell schools about yourself, your books, and why you love doing school visits…" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
              {errors.bio && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.bio}</span>}
            </label>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Author photo URL</span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="https://your-website.com/photo.jpg" value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Paste a direct link to a high-quality headshot (JPG or PNG).</span>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label>
                <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>City <span style={{ color: "var(--orange)" }}>*</span></span>
                <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} value={form.location_city} onChange={(e) => set("location_city", e.target.value)} />
                {errors.location_city && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.location_city}</span>}
              </label>
              <label>
                <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>State <span style={{ color: "var(--orange)" }}>*</span></span>
                <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="e.g. CA" maxLength={2} value={form.location_state} onChange={(e) => set("location_state", e.target.value.toUpperCase())} />
                {errors.location_state && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.location_state}</span>}
              </label>
            </div>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Website</span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="https://yourwebsite.com" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} />
            </label>
          </div>
        )}

        {/* Step 2 — Visit details */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Visit details</h2>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Grade levels you visit <span style={{ color: "var(--orange)" }}>*</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {GRADE_OPTIONS.map((g) => (
                  <button key={g} type="button"
                    onClick={() => toggleArr("grade_range", g)}
                    style={{
                      padding: "7px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer", border: "2px solid",
                      background: form.grade_range.includes(g) ? "var(--orange)" : "transparent",
                      borderColor: form.grade_range.includes(g) ? "var(--orange)" : "var(--line)",
                      color: form.grade_range.includes(g) ? "#fff" : "var(--ink)",
                      fontWeight: 700,
                    }}
                  >{g}</button>
                ))}
              </div>
              {errors.grade_range && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.grade_range}</span>}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Visit formats <span style={{ color: "var(--orange)" }}>*</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FORMAT_OPTIONS.map((f) => (
                  <label key={f.value} style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                    <input type="checkbox" checked={form.visit_formats.includes(f.value)} onChange={() => toggleArr("visit_formats", f.value)} />
                    <span style={{ fontSize: 15 }}>{f.label}</span>
                  </label>
                ))}
              </div>
              {errors.visit_formats && <span style={{ color: "var(--orange-deep)", fontSize: 13 }}>{errors.visit_formats}</span>}
            </div>

            {form.visit_formats.some((f) => f !== "virtual") && (
              <label>
                <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Local travel radius (miles)</span>
                <input type="number" className="form-input" style={{ width: 120 }} min={0} max={500} value={form.local_radius} onChange={(e) => set("local_radius", e.target.value)} />
              </label>
            )}

            <div style={{ display: "grid", gridTemplateColumns: form.visit_formats.some(f => f !== "virtual") && form.visit_formats.includes("virtual") ? "1fr 1fr" : "1fr", gap: 16 }}>
              {form.visit_formats.some((f) => f !== "virtual") && (
                <label>
                  <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>In-person base price ($)</span>
                  <input type="number" className="form-input" style={{ width: "100%", boxSizing: "border-box" }} min={0} value={form.base_price_local} onChange={(e) => set("base_price_local", e.target.value)} />
                </label>
              )}
              {form.visit_formats.includes("virtual") && (
                <label>
                  <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Virtual base price ($)</span>
                  <input type="number" className="form-input" style={{ width: "100%", boxSizing: "border-box" }} min={0} value={form.base_price_virtual} onChange={(e) => set("base_price_virtual", e.target.value)} />
                </label>
              )}
            </div>

            <div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 3 }} checked={form.offers_grant_visits} onChange={(e) => set("offers_grant_visits", e.target.checked)} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Offer grant visits (free visits for under-resourced schools)</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>You'll be marked with a "Grant visit" badge and prioritized in grant searches.</div>
                </div>
              </label>
              {form.offers_grant_visits && (
                <div style={{ marginTop: 12, marginLeft: 26 }}>
                  <label>
                    <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Free visits per year</span>
                    <input type="number" className="form-input" style={{ width: 100 }} min={1} max={20} value={form.grant_visits_per_year} onChange={(e) => set("grant_visits_per_year", e.target.value)} />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Final touches */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Final touches</h2>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Languages you present in</span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="English, Spanish…" value={form.languages} onChange={(e) => set("languages", e.target.value)} />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Comma-separated</span>
            </label>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Genres / topics</span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="Picture books, Middle grade, STEM, Poetry…" value={form.genres} onChange={(e) => set("genres", e.target.value)} />
            </label>

            <label>
              <span style={{ display: "block", fontWeight: 700, marginBottom: 5, fontSize: 14 }}>Themes in your books</span>
              <input className="form-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="Family, Culture, Friendship, Identity…" value={form.themes} onChange={(e) => set("themes", e.target.value)} />
            </label>

            {errors._ && (
              <p style={{ color: "var(--orange-deep)", fontSize: 14, fontWeight: 600 }}>{errors._}</p>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <button
            type="button"
            className="btn"
            style={{ visibility: currentStep > 1 ? "visible" : "hidden" }}
            onClick={() => setStep((currentStep - 1) as Step)}
          >
            ← Back
          </button>
          {currentStep < 3 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Continue →
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
              {saving ? "Saving…" : "Publish my profile →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
