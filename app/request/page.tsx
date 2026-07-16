"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BudgetType, VisitKind } from "@/lib/types";
import { CheckCircle } from "lucide-react";

const STEPS = ["Your school", "The visit", "Budget", "Your hopes", "Review"];

type RequestedAuthor = { slug?: string; name?: string; tagline?: string };

function RequestForm() {
  const params = useSearchParams();
  const authorSlug = params.get("author");
  const [author, setAuthor] = useState<RequestedAuthor | null>(null);

  // Look up the real author (by slug) from the live directory for the pre-fill banner.
  useEffect(() => {
    if (!authorSlug) { setAuthor(null); return; }
    fetch("/api/authors")
      .then((r) => r.json())
      .then((list: RequestedAuthor[]) => {
        setAuthor(Array.isArray(list) ? list.find((a) => a.slug === authorSlug) ?? null : null);
      })
      .catch(() => setAuthor(null));
  }, [authorSlug]);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    school_name: "", requester_name: "", requester_role: "", requester_email: "",
    school_city: "", school_state: "", school_website: "",
    school_type: [] as string[],
    grades: [] as string[],
    visit_kind: "" as VisitKind | "",
    date_earliest: "", date_latest: "",
    student_count: "",
    timing_notes: "",
    budget_type: "" as BudgetType | "",
    budget_amount: "",
    grant_need_reason: "", grant_staff_lead: "", grant_prep_plan: "",
    success_description: "",
    themes: [] as string[],
    notes: "",
    confirmed_staff_lead: false,
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArr = (key: string, val: string) => {
    const arr = (form as any)[key] as string[];
    set(key, arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.school_name) e.school_name = "Required";
      if (!form.requester_name) e.requester_name = "Required";
      if (!form.requester_email || !form.requester_email.includes("@")) e.requester_email = "Valid email required";
      if (!form.school_city) e.school_city = "Required";
    }
    if (s === 1) {
      if (!form.grades.length) e.grades = "Select at least one grade";
      if (!form.visit_kind) e.visit_kind = "Select a visit type";
      if (!form.date_earliest) e.date_earliest = "Required";
    }
    if (s === 2) {
      if (!form.budget_type) e.budget_type = "Select a budget option";
      if (form.budget_type === "grant") {
        if (!form.grant_need_reason) e.grant_need_reason = "Required";
        if (!form.grant_staff_lead) e.grant_staff_lead = "Required";
        if (!form.grant_prep_plan) e.grant_prep_plan = "Required";
      }
    }
    if (s === 3) {
      if (!form.success_description) e.success_description = "Required";
    }
    if (s === 4) {
      if (!form.confirmed_staff_lead) e.confirmed_staff_lead = "Please confirm";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 4)); };
  const back = () => { setStep((s) => Math.max(s - 1, 0)); setErrors({}); };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, author_id: authorSlug ?? author?.slug }),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-tint)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={38} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 32, marginBottom: 12 }}>Your request is on its way!</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 440, margin: "0 auto 32px", fontSize: 16 }}>
          {author ? `${author.name} will be in touch soon.` : "Matched authors will reach out within 2–3 days."} You'll get a confirmation email at <strong>{form.requester_email}</strong>.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/authors" className="btn btn-primary">Browse more authors</Link>
          <Link href="/" className="btn btn-ghost">Back to home</Link>
        </div>
      </div>
    );
  }

  const fieldErr = (k: string) => errors[k] ? (
    <div style={{ color: "var(--orange-deep)", fontSize: 13, marginTop: 4, fontWeight: 600 }}>{errors[k]}</div>
  ) : null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>
      {/* Context card */}
      {author && (
        <div className="card" style={{ padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
          <div className="ph" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: "monospace", fontSize: 8 }}>PHOTO</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Requesting: {author.name}</span>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", marginLeft: 10 }}>{author.tagline}</span>
          </div>
          <Link href="/authors" style={{ fontSize: 13, color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}>Change</Link>
        </div>
      )}

      {/* Progress tracker */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1 0 auto" : "0 0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <button
                className={`step-dot${i < step ? " done" : i === step ? " active" : ""}`}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, color: i === step ? "var(--orange)" : i < step ? "var(--green)" : "var(--ink-faint)", whiteSpace: "nowrap" }} className="step-label">
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-bar${i < step ? " done" : ""}`} style={{ margin: "0 4px", marginBottom: 20 }} />
            )}
          </div>
        ))}
      </div>

      {/* Step panels */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>Tell us about your school</h2>
          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <label className="form-label">School name *</label>
              <input className="form-input" value={form.school_name} onChange={(e) => set("school_name", e.target.value)} placeholder="Lincoln Elementary School" />
              {fieldErr("school_name")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">Your name *</label>
                <input className="form-input" value={form.requester_name} onChange={(e) => set("requester_name", e.target.value)} placeholder="Jane Smith" />
                {fieldErr("requester_name")}
              </div>
              <div>
                <label className="form-label">Your role *</label>
                <select className="form-input" value={form.requester_role} onChange={(e) => set("requester_role", e.target.value)}>
                  <option value="">Select…</option>
                  {["Teacher", "Librarian", "Media Specialist", "Principal / Admin", "PTA / PTO", "Other"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Email address *</label>
              <input className="form-input" type="email" value={form.requester_email} onChange={(e) => set("requester_email", e.target.value)} placeholder="you@school.edu" />
              {fieldErr("requester_email")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">City *</label>
                <input className="form-input" value={form.school_city} onChange={(e) => set("school_city", e.target.value)} placeholder="Chicago" />
                {fieldErr("school_city")}
              </div>
              <div>
                <label className="form-label">State</label>
                <input className="form-input" value={form.school_state} onChange={(e) => set("school_state", e.target.value)} placeholder="IL" maxLength={2} />
              </div>
            </div>
            <div>
              <label className="form-label">School website (optional — we'll pull details automatically)</label>
              <input className="form-input" value={form.school_website} onChange={(e) => set("school_website", e.target.value)} placeholder="https://yourschool.edu" />
            </div>
            <div>
              <label className="form-label">School type (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["Public", "Title I", "Charter", "Private", "Rural", "Other"].map((t) => (
                  <button key={t} className={`chip${form.school_type.includes(t) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("school_type", t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>About the visit</h2>
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <label className="form-label">Grade level(s) * — select all that apply</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8"].map((g) => (
                  <button key={g} className={`chip${form.grades.includes(g) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("grades", g)}>{g}</button>
                ))}
              </div>
              {fieldErr("grades")}
            </div>
            <div>
              <label className="form-label">What kind of visit? *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 6 }} className="visit-kind-grid">
                {[
                  { val: "local" as VisitKind, icon: "📍", label: "In-person, local", note: "Within author's travel zone — no extra fees." },
                  { val: "out_of_area" as VisitKind, icon: "🧳", label: "In-person, out of area", note: "Farther away — travel costs may apply." },
                  { val: "virtual" as VisitKind, icon: "💻", label: "Virtual", note: "Live video session from anywhere." },
                ].map((opt) => (
                  <div key={opt.val} className={`option-card${form.visit_kind === opt.val ? " selected" : ""}`}
                    onClick={() => set("visit_kind", opt.val)} role="radio" aria-checked={form.visit_kind === opt.val}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{opt.note}</div>
                  </div>
                ))}
              </div>
              {fieldErr("visit_kind")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">Earliest date *</label>
                <input className="form-input" type="date" value={form.date_earliest} onChange={(e) => set("date_earliest", e.target.value)} />
                {fieldErr("date_earliest")}
              </div>
              <div>
                <label className="form-label">Latest date</label>
                <input className="form-input" type="date" value={form.date_latest} onChange={(e) => set("date_latest", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="form-label">Approximate number of students</label>
              <input className="form-input" type="number" value={form.student_count} onChange={(e) => set("student_count", e.target.value)} placeholder="e.g. 120" style={{ maxWidth: 200 }} />
            </div>
            <div>
              <label className="form-label">Timing notes (optional)</label>
              <textarea className="form-input" value={form.timing_notes} onChange={(e) => set("timing_notes", e.target.value)} rows={2} placeholder="Morning preferred, avoiding testing week in April…" style={{ resize: "vertical" }} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>Budget</h2>
          <div style={{ display: "grid", gap: 14, marginBottom: 22 }}>
            {[
              { val: "set" as BudgetType, icon: "💰", label: "We have a set budget", desc: "We have funds allocated for this visit." },
              { val: "partial" as BudgetType, icon: "📋", label: "Small or partial budget", desc: "We have some funds but may need help covering the full cost." },
              { val: "grant" as BudgetType, icon: "★", label: "Hoping for a volunteer (grant) visit", desc: "We're looking for an author willing to visit for free.", green: true },
            ].map((opt) => (
              <div key={opt.val}
                className={`option-card${form.budget_type === opt.val ? (opt.green ? " selected-green" : " selected") : ""}`}
                onClick={() => set("budget_type", opt.val)}
                style={opt.green && form.budget_type === opt.val ? { borderColor: "var(--green)", background: "var(--green-tint)" } : {}}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: opt.green ? "var(--green-deep)" : "var(--ink)" }}>{opt.label}</div>
                    <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{opt.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {fieldErr("budget_type")}

          {form.budget_type === "set" && (
            <div>
              <label className="form-label">Budget amount</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>$</span>
                <input className="form-input" type="number" value={form.budget_amount} onChange={(e) => set("budget_amount", e.target.value)} placeholder="650" style={{ maxWidth: 200 }} />
              </div>
            </div>
          )}

          {form.budget_type === "grant" && (
            <div style={{ border: "2px solid var(--green)", borderRadius: 18, padding: 24, background: "var(--green-tint)", display: "grid", gap: 18 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="badge badge-grant" style={{ fontSize: 12 }}>★ Grant justification</span>
                <span style={{ fontSize: 13.5, color: "var(--green-deep)" }}>Help us match you with the right author</span>
              </div>
              <div>
                <label className="form-label">Why is a free visit important for your school right now? *</label>
                <textarea className="form-input" value={form.grant_need_reason} onChange={(e) => set("grant_need_reason", e.target.value)} rows={3} placeholder="We're a Title I school where 78% of students qualify for free/reduced lunch. Our arts budget was cut this year…" style={{ resize: "vertical" }} />
                {fieldErr("grant_need_reason")}
              </div>
              <div>
                <label className="form-label">Who will lead the day? (staff lead's name and role) *</label>
                <input className="form-input" value={form.grant_staff_lead} onChange={(e) => set("grant_staff_lead", e.target.value)} placeholder="Sarah Chen, school librarian" />
                {fieldErr("grant_staff_lead")}
              </div>
              <div>
                <label className="form-label">How will you prepare students beforehand? *</label>
                <textarea className="form-input" value={form.grant_prep_plan} onChange={(e) => set("grant_prep_plan", e.target.value)} rows={3} placeholder="We'll read at least one of the author's books in class before the visit. Our librarian will lead a pre-visit discussion…" style={{ resize: "vertical" }} />
                {fieldErr("grant_prep_plan")}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>Your hopes for the visit</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label className="form-label">What would make this visit a success? *</label>
              <textarea className="form-input" value={form.success_description} onChange={(e) => set("success_description", e.target.value)} rows={4} placeholder="We'd love students to walk away excited to pick up a book. Our kids need to see themselves in stories…" style={{ resize: "vertical" }} />
              {fieldErr("success_description")}
            </div>
            <div>
              <label className="form-label">Focus or themes (optional)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {["Cultural diversity", "STEM & science", "Poetry & writing", "Adventure", "Bilingual", "Social-emotional", "Fantasy", "History"].map((t) => (
                  <button key={t} className={`chip${form.themes.includes(t) ? " active-orange" : ""}`}
                    onClick={() => toggleArr("themes", t)}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Anything else you'd like the author to know? (optional)</label>
              <textarea className="form-input" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="We have several ELL students, outdoor space available, a very enthusiastic librarian…" style={{ resize: "vertical" }} />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 26, marginBottom: 24 }}>Review your request</h2>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            {[
              ["School", form.school_name],
              ["Contact", `${form.requester_name} · ${form.requester_role}`],
              ["Email", form.requester_email],
              ["Location", `${form.school_city}${form.school_state ? ", " + form.school_state : ""}`],
              ["School type", form.school_type.join(", ") || "Not specified"],
              ["Grades", form.grades.join(", ") || "Not specified"],
              ["Visit type", form.visit_kind || "Not specified"],
              ["Dates", form.date_earliest ? `${form.date_earliest}${form.date_latest ? " → " + form.date_latest : ""}` : "Not specified"],
              ["Budget", form.budget_type === "grant" ? "Requesting volunteer visit" : form.budget_type === "set" ? `$${form.budget_amount}` : form.budget_type || "Not specified"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line-soft)", fontSize: 14.5, gap: 12 }}>
                <span style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</span>
                <span style={{ fontWeight: 700, textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>

          <div className={`option-card${form.confirmed_staff_lead ? " selected-green" : ""}`}
            onClick={() => set("confirmed_staff_lead", !form.confirmed_staff_lead)}
            style={{ marginBottom: 8 }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form.confirmed_staff_lead ? "var(--green)" : "var(--line)"}`, background: form.confirmed_staff_lead ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {form.confirmed_staff_lead && <span style={{ color: "white", fontSize: 13, fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>
                I confirm that a staff lead will own the day — coordinating with the author, preparing students, and ensuring the visit runs smoothly.
              </span>
            </div>
          </div>
          {fieldErr("confirmed_staff_lead")}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, gap: 12 }}>
        {step > 0 ? (
          <button className="btn btn-ghost" onClick={back}>← Back</button>
        ) : (
          <Link href="/authors" className="btn btn-ghost">← Cancel</Link>
        )}
        {step < 4 ? (
          <button className="btn btn-primary" onClick={next}>Continue →</button>
        ) : (
          <button
            className="btn btn-green btn-lg"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ opacity: submitting ? .7 : 1 }}
          >
            {submitting ? "Sending…" : "Send my request ✦"}
          </button>
        )}
      </div>

      <style>{`
        .visit-kind-grid { @media (max-width: 540px) { grid-template-columns: 1fr !important; } }
        .step-label { @media (max-width: 540px) { display: none !important; } }
      `}</style>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense>
      <RequestForm />
    </Suspense>
  );
}
