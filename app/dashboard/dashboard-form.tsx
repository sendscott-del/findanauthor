"use client";
import { useState } from "react";
import type { Author } from "@/lib/types";
import BookCover from "@/components/book-cover";

const GRADE_OPTIONS = ["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const FORMAT_OPTIONS = [
  { value: "in_person_assembly", label: "In-person assembly" },
  { value: "in_person_classroom", label: "In-person classroom" },
  { value: "virtual", label: "Virtual" },
];

const MAX_BOOKS = 10;
const COVER_COLORS = ["#E8743B", "#2E8B6F", "#3A5A8C", "#E2A93B", "#7C6A9C", "#CE5C26", "#226C56", "#B84A4A"];
const BOOK_TYPES = [
  { value: "picture_book", label: "Picture book" },
  { value: "middle_grade", label: "Middle grade" },
  { value: "young_adult", label: "Young adult" },
  { value: "nonfiction", label: "Nonfiction" },
];

type BookRow = { title: string; publisher: string; year: string; isbn: string; cover_color: string; type: string };

const labelStyle: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 14, color: "var(--ink)", marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 13px", fontSize: 15, borderRadius: 10,
  border: "1.5px solid var(--line)", background: "#fff", fontFamily: "'Mulish', sans-serif",
};
const fieldGap: React.CSSProperties = { marginBottom: 20 };

export default function DashboardForm({ author, email }: { author: Author; email: string }) {
  const offeringKinds = (author.visit_offerings ?? []).map((o) => (o as { kind: string }).kind);
  const csv = (arr?: string[]) => (arr ?? []).join(", ");

  const [form, setForm] = useState({
    tagline: author.tagline ?? "",
    bio: author.bio ?? "",
    photo_url: author.photo_url ?? "",
    location_city: author.location_city ?? "",
    location_state: author.location_state ?? "",
    website_url: author.website_url ?? "",
    booking_url: author.booking_url ?? "",
    grade_range: author.grade_range ?? [],
    visit_formats: FORMAT_OPTIONS.map((f) => f.value).filter((v) => offeringKinds.includes(v)),
    local_radius: String(author.local_radius_miles ?? 30),
    offers_grant_visits: !!author.offers_grant_visits,
    grant_visits_per_year: String(author.grant_visits_per_year ?? 3),
    offers_title1_subsidy: !!author.offers_title1_subsidy,
    offers_free_virtual_qa: !!author.offers_free_virtual_qa,
    languages: csv(author.languages) || "English",
    genres: csv(author.genres),
    themes: csv(author.themes),
    books: (author.books ?? []).slice(0, MAX_BOOKS).map((b): BookRow => ({
      title: b.title ?? "",
      publisher: b.publisher ?? "",
      year: b.year ? String(b.year) : "",
      isbn: b.isbn ?? "",
      cover_color: b.cover_color ?? COVER_COLORS[0],
      type: b.type ?? "picture_book",
    })),
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult("idle");
  }
  function toggleArr(field: "grade_range" | "visit_formats", val: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
    setResult("idle");
  }
  function addBook() {
    setForm((prev) => {
      if (prev.books.length >= MAX_BOOKS) return prev;
      const color = COVER_COLORS[prev.books.length % COVER_COLORS.length];
      const next: BookRow = { title: "", publisher: "", year: "", isbn: "", cover_color: color, type: "picture_book" };
      return { ...prev, books: [...prev.books, next] };
    });
    setResult("idle");
  }
  function removeBook(idx: number) {
    setForm((prev) => ({ ...prev, books: prev.books.filter((_, i) => i !== idx) }));
    setResult("idle");
  }
  function updateBook(idx: number, field: keyof BookRow, value: string) {
    setForm((prev) => ({
      ...prev,
      books: prev.books.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
    }));
    setResult("idle");
  }

  async function handlePhotoUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-photo", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      set("photo_url", json.url);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save");
      setResult("saved");
    } catch (err: unknown) {
      setResult("error");
      setMessage(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container section" style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 6, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 30, color: "var(--ink)", marginBottom: 4 }}>
            Your author profile
          </h1>
          <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>Signed in as {email}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {author.slug && (
            <a href={`/authors/${author.slug}`} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
              View public page
            </a>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn btn-ghost btn-sm">Sign out</button>
          </form>
        </div>
      </div>

      <form onSubmit={save} style={{ marginTop: 24 }}>
        {/* Photo */}
        <div style={fieldGap}>
          <span style={labelStyle}>Profile photo</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 76, height: 76, borderRadius: 14, overflow: "hidden", background: "var(--line-soft)", flexShrink: 0 }}>
              {form.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
              {uploading ? "Uploading…" : form.photo_url ? "Replace photo" : "Upload photo"}
              <input type="file" accept="image/*" hidden onChange={(e) => handlePhotoUpload(e.target.files?.[0])} />
            </label>
          </div>
        </div>

        <div style={fieldGap}>
          <label style={labelStyle}>Tagline</label>
          <input style={inputStyle} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="One line that sums up your visits" />
        </div>

        <div style={fieldGap}>
          <label style={labelStyle}>Bio</label>
          <textarea style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </div>

        {/* Books */}
        <div style={fieldGap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={labelStyle}>Your books</span>
            <span style={{ fontSize: 12.5, color: "var(--ink-faint)", fontWeight: 700 }}>{form.books.length} of {MAX_BOOKS}</span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 0, marginBottom: 12 }}>
            Add up to {MAX_BOOKS} titles. These appear on your public profile.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {form.books.map((book, idx) => (
              <div key={idx} style={{ border: "1.5px solid var(--line)", borderRadius: 12, padding: 14, background: "#fff", display: "flex", gap: 14 }}>
                {/* Live cover preview */}
                <div style={{ width: 52, flexShrink: 0 }}>
                  <BookCover color={book.cover_color} title={book.title} />
                </div>

                <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 10 }}>
                  <input
                    style={inputStyle}
                    value={book.title}
                    onChange={(e) => updateBook(idx, "title", e.target.value)}
                    placeholder="Book title"
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                    <input
                      style={inputStyle}
                      value={book.publisher}
                      onChange={(e) => updateBook(idx, "publisher", e.target.value)}
                      placeholder="Publisher"
                    />
                    <input
                      style={inputStyle}
                      inputMode="numeric"
                      value={book.year}
                      onChange={(e) => updateBook(idx, "year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="Year"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
                    <select style={inputStyle} value={book.type} onChange={(e) => updateBook(idx, "type", e.target.value)}>
                      {BOOK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeBook(idx)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: "#8a1c12", whiteSpace: "nowrap" }}
                    >
                      Remove
                    </button>
                  </div>
                  {/* Cover color */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 700 }}>Cover color</span>
                    {COVER_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Cover color ${c}`}
                        onClick={() => updateBook(idx, "cover_color", c)}
                        style={{
                          width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
                          border: book.cover_color === c ? "3px solid var(--ink)" : "2px solid var(--line)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {form.books.length < MAX_BOOKS ? (
            <button type="button" onClick={addBook} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
              + Add {form.books.length === 0 ? "a book" : "another book"}
            </button>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 12 }}>
              You&apos;ve reached the {MAX_BOOKS}-book limit. Remove one to add a different title.
            </p>
          )}
        </div>

        <div style={{ ...fieldGap, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={form.location_city} onChange={(e) => set("location_city", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <input style={inputStyle} value={form.location_state} onChange={(e) => set("location_state", e.target.value)} placeholder="IL" />
          </div>
        </div>

        <div style={{ ...fieldGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Website</label>
            <input style={inputStyle} value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://" />
          </div>
          <div>
            <label style={labelStyle}>Booking link</label>
            <input style={inputStyle} value={form.booking_url} onChange={(e) => set("booking_url", e.target.value)} placeholder="https://" />
          </div>
        </div>

        {/* Grades */}
        <div style={fieldGap}>
          <span style={labelStyle}>Grade levels</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GRADE_OPTIONS.map((g) => (
              <button type="button" key={g} onClick={() => toggleArr("grade_range", g)}
                style={chip(form.grade_range.includes(g))}>{g}</button>
            ))}
          </div>
        </div>

        {/* Visit formats */}
        <div style={fieldGap}>
          <span style={labelStyle}>Visit formats</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FORMAT_OPTIONS.map((f) => (
              <button type="button" key={f.value} onClick={() => toggleArr("visit_formats", f.value)}
                style={chip(form.visit_formats.includes(f.value))}>{f.label}</button>
            ))}
          </div>
        </div>

        <div style={fieldGap}>
          <label style={labelStyle}>Local travel radius (miles)</label>
          <input type="number" min={0} style={{ ...inputStyle, maxWidth: 160 }} value={form.local_radius} onChange={(e) => set("local_radius", e.target.value)} />
        </div>

        {/* Offer toggles */}
        <div style={{ ...fieldGap, display: "grid", gap: 12 }}>
          <Toggle label="I offer free/subsidized visits to Title I schools" checked={form.offers_title1_subsidy} onChange={(v) => set("offers_title1_subsidy", v)} />
          <Toggle label="I offer a free virtual Q&A for classes that read my book" checked={form.offers_free_virtual_qa} onChange={(v) => set("offers_free_virtual_qa", v)} />
          <Toggle label="I offer volunteer grant visits each year" checked={form.offers_grant_visits} onChange={(v) => set("offers_grant_visits", v)} />
          {form.offers_grant_visits && (
            <div>
              <label style={labelStyle}>Grant visits per year</label>
              <input type="number" min={0} style={{ ...inputStyle, maxWidth: 160 }} value={form.grant_visits_per_year} onChange={(e) => set("grant_visits_per_year", e.target.value)} />
            </div>
          )}
        </div>

        <div style={{ ...fieldGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Languages</label>
            <input style={inputStyle} value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="English, Spanish" />
          </div>
          <div>
            <label style={labelStyle}>Genres</label>
            <input style={inputStyle} value={form.genres} onChange={(e) => set("genres", e.target.value)} placeholder="Picture book, Middle grade" />
          </div>
        </div>

        <div style={fieldGap}>
          <label style={labelStyle}>Themes</label>
          <input style={inputStyle} value={form.themes} onChange={(e) => set("themes", e.target.value)} placeholder="Kindness, STEM, Resilience" />
          <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 6 }}>Separate multiple values with commas.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {result === "saved" && <span style={{ color: "#1d7a3a", fontWeight: 700, fontSize: 14 }}>Saved ✓</span>}
          {result === "error" && <span style={{ color: "#8a1c12", fontSize: 14 }}>{message}</span>}
          {message && result !== "error" && <span style={{ color: "#8a1c12", fontSize: 14 }}>{message}</span>}
        </div>
      </form>
    </main>
  );
}

function chip(active: boolean): React.CSSProperties {
  return {
    padding: "8px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Mulish', sans-serif",
    border: active ? "1.5px solid var(--orange)" : "1.5px solid var(--line)",
    background: active ? "var(--orange)" : "#fff",
    color: active ? "#fff" : "var(--ink-soft)",
  };
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", fontSize: 14.5, color: "var(--ink)" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--orange)" }} />
      {label}
    </label>
  );
}
