"use client";
import { useState, useMemo, useEffect } from "react";
import AuthorCard from "@/components/author-card";
import { Author } from "@/lib/types";

const GRADES = ["K–2", "3–5", "6–8", "9–12"];
const GENRES = ["Picture Books", "Middle Grade", "STEM", "Poetry", "Bilingual", "Adventure"];

export default function AuthorDirectory() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [grantOnly, setGrantOnly] = useState(false);
  const [title1Only, setTitle1Only] = useState(false);
  const [freeQaOnly, setFreeQaOnly] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);
  const [zip, setZip] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("best");

  // Refetch with distance info whenever the active ZIP changes
  useEffect(() => {
    const url = zip ? `/api/authors?zip=${encodeURIComponent(zip)}` : "/api/authors";
    fetch(url).then((r) => r.json()).then(setAuthors).catch(() => {});
  }, [zip]);

  const locationActive = zip.length === 5;

  const toggleArr = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = [...authors];
    if (grades.length) list = list.filter((a) => a.grade_range?.some((g) => grades.includes(g)));
    if (formats.includes("in-person")) list = list.filter((a) => a.visit_offerings?.some((o) => o.kind !== "virtual"));
    if (formats.includes("virtual")) list = list.filter((a) => a.visit_offerings?.some((o) => o.kind === "virtual"));
    if (grantOnly) list = list.filter((a) => a.offers_grant_visits && (a.grant_visits_remaining ?? 0) > 0);
    if (title1Only) list = list.filter((a) => a.offers_title1_subsidy);
    if (freeQaOnly) list = list.filter((a) => a.offers_free_virtual_qa);
    if (localOnly && locationActive) list = list.filter((a) => a.within_local_zone);
    if (genreFilters.length) list = list.filter((a) => a.genres?.some((g) => genreFilters.includes(g)));

    if (sort === "grant") list = [...list].sort((a, b) => (b.offers_grant_visits ? 1 : 0) - (a.offers_grant_visits ? 1 : 0));
    if (sort === "nearest" || (locationActive && sort === "best")) {
      list = [...list].sort((a, b) => {
        const da = a.distance_miles ?? Infinity;
        const db = b.distance_miles ?? Infinity;
        return da - db;
      });
    }
    return list;
  }, [authors, grades, formats, grantOnly, title1Only, freeQaOnly, localOnly, locationActive, genreFilters, sort]);

  const grantCount = filtered.filter((a) => a.offers_grant_visits && (a.grant_visits_remaining ?? 0) > 0).length;
  const clearAll = () => {
    setGrades([]); setFormats([]); setGrantOnly(false); setTitle1Only(false);
    setFreeQaOnly(false); setLocalOnly(false); setGenreFilters([]);
    setZip(""); setZipInput("");
  };
  const hasFilters = grades.length || formats.length || grantOnly || title1Only || freeQaOnly || localOnly || zip || genreFilters.length;

  const submitZip = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = zipInput.replace(/\D/g, "").slice(0, 5);
    setZip(cleaned.length === 5 ? cleaned : "");
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--paper-2)", padding: "52px 0 40px", borderBottom: "1.5px solid var(--line)" }}>
        <div className="container">
          <div className="eyebrow" style={{ color: "var(--orange-deep)", marginBottom: 14 }}>Author directory</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 12, maxWidth: 600 }}>
            Find the storyteller your students will love.
          </h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: 520, marginBottom: 24, fontSize: 16 }}>
            Every author here is traditionally published, school-visit-experienced, and background-checked.
          </p>
          {/* Location search */}
          <form onSubmit={submitZip} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              inputMode="numeric"
              placeholder="Enter your ZIP to find authors near you"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="form-input"
              style={{ width: 300, maxWidth: "100%" }}
            />
            <button type="submit" className="btn btn-primary">Search nearby</button>
            {zip && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setZip(""); setZipInput(""); setLocalOnly(false); }}>
                Clear location
              </button>
            )}
          </form>
          {locationActive && (
            <p style={{ marginTop: 10, fontSize: 13.5, color: "var(--green-deep)", fontWeight: 600 }}>
              📍 Showing distances from {zip}. Authors marked “Local · no travel fee” cost you no travel — ideal for grant visits, which cover the honorarium only.
            </p>
          )}
        </div>
        {/* Grant strip */}
        <div style={{ background: "var(--green-tint)", borderTop: "1px solid #BBDDD0", borderBottom: "1px solid #BBDDD0", padding: "14px 0", marginTop: 28 }}>
          <div className="container" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>★</div>
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--green-deep)", fontWeight: 600 }}>
              Authors with a green badge offer free volunteer visits for schools that demonstrate need and commitment.
            </p>
            <button className="btn btn-green btn-sm" onClick={() => setGrantOnly(true)}>
              Show grant authors
            </button>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="container" style={{ display: "flex", gap: 32, paddingTop: 36, paddingBottom: 60, alignItems: "flex-start" }}>
        {/* Filter rail */}
        <aside style={{ width: 260, flexShrink: 0, position: "sticky", top: 80 }} className="filter-rail">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Filters</span>
            {hasFilters && (
              <button onClick={clearAll} className="btn btn-ghost btn-sm" style={{ padding: "6px 14px", fontSize: 13 }}>Clear all</button>
            )}
          </div>

          {/* Grade level */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-label">Grade level</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {GRADES.map((g) => (
                <button key={g} className={`chip${grades.includes(g) ? " active-orange" : ""}`}
                  onClick={() => toggleArr(grades, setGrades, g)}>{g}</button>
              ))}
            </div>
          </div>

          {/* Visit format */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-label">Visit format</div>
            {[["in-person", "📍 In-person"], ["virtual", "💻 Virtual"]].map(([val, label]) => (
              <label key={val} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8, cursor: "pointer", fontSize: 15 }}>
                <input type="checkbox" checked={formats.includes(val)} onChange={() => toggleArr(formats, setFormats, val)}
                  style={{ accentColor: "var(--orange)", width: 17, height: 17 }} />
                {label}
              </label>
            ))}
          </div>

          {/* Location */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-label">Location</div>
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: locationActive ? "pointer" : "not-allowed", fontSize: 15, opacity: locationActive ? 1 : 0.5 }}>
              <input type="checkbox" checked={localOnly} disabled={!locationActive} onChange={(e) => setLocalOnly(e.target.checked)}
                style={{ accentColor: "var(--green)", width: 17, height: 17 }} />
              <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>Local only — no travel fee</span>
            </label>
            {!locationActive && (
              <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>Enter a ZIP above to filter by distance.</div>
            )}
          </div>

          {/* Funding & access */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-label">Funding &amp; access</div>
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 15, marginBottom: 8 }}>
              <input type="checkbox" checked={grantOnly} onChange={(e) => setGrantOnly(e.target.checked)}
                style={{ accentColor: "var(--green)", width: 17, height: 17 }} />
              <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>★ Offers grant visits</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 15, marginBottom: 8 }}>
              <input type="checkbox" checked={title1Only} onChange={(e) => setTitle1Only(e.target.checked)}
                style={{ accentColor: "var(--blue)", width: 17, height: 17 }} />
              <span style={{ color: "var(--blue-deep)", fontWeight: 700 }}>Title I subsidized rates</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 15 }}>
              <input type="checkbox" checked={freeQaOnly} onChange={(e) => setFreeQaOnly(e.target.checked)}
                style={{ accentColor: "var(--green)", width: 17, height: 17 }} />
              <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>Free virtual Q&amp;A</span>
            </label>
          </div>

          {/* Genre */}
          <div>
            <div className="form-label">Genre / type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {GENRES.map((g) => (
                <button key={g} className={`chip${genreFilters.includes(g) ? " active-orange" : ""}`}
                  style={{ fontSize: 12.5, padding: "5px 12px" }}
                  onClick={() => toggleArr(genreFilters, setGenreFilters, g)}>{g}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Results bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>
              {filtered.length} author{filtered.length !== 1 ? "s" : ""} match
              {grantCount > 0 && <span style={{ color: "var(--green-deep)" }}> · {grantCount} offer grant visits</span>}
            </span>
            <select className="form-input" style={{ width: "auto", padding: "8px 14px" }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="best">Best match</option>
              {locationActive && <option value="nearest">Nearest first</option>}
              <option value="grant">Volunteer visits first</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="results-grid">
            {filtered.map((a) => <AuthorCard key={a.slug} author={a as any} />)}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-soft)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
              <h3>No authors match those filters</h3>
              <p>Try widening your search or <button onClick={clearAll} style={{ color: "var(--orange)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>clearing all filters</button>.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .filter-rail { @media (max-width: 860px) { display: none !important; } }
        .results-grid { @media (max-width: 980px) { grid-template-columns: repeat(2, 1fr) !important; } }
        .results-grid { @media (max-width: 560px) { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
