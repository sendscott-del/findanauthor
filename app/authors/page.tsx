"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import AuthorCard from "@/components/author-card";
import { SEED_AUTHORS } from "@/lib/seed-data";

const GRADES = ["K–2", "3–5", "6–8", "9–12"];
const GENRES = ["Picture Books", "Middle Grade", "STEM", "Poetry", "Bilingual", "Adventure"];

export default function AuthorDirectory() {
  const [grades, setGrades] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [grantOnly, setGrantOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState(1500);
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("best");

  const toggleArr = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = [...SEED_AUTHORS];
    if (grades.length) list = list.filter((a) => a.grade_range?.some((g) => grades.includes(g)));
    if (formats.includes("in-person")) list = list.filter((a) => a.visit_offerings?.some((o) => o.kind !== "virtual"));
    if (formats.includes("virtual")) list = list.filter((a) => a.visit_offerings?.some((o) => o.kind === "virtual"));
    if (grantOnly) list = list.filter((a) => a.offers_grant_visits && (a.grant_visits_remaining ?? 0) > 0);
    if (maxBudget < 1500) list = list.filter((a) => (a.visit_offerings ?? []).some((o) => o.base_price <= maxBudget));
    if (genreFilters.length) list = list.filter((a) => a.genres?.some((g) => genreFilters.includes(g)));
    if (sort === "grant") list = [...list].sort((a, b) => (b.offers_grant_visits ? 1 : 0) - (a.offers_grant_visits ? 1 : 0));
    if (sort === "price-low") list = [...list].sort((a, b) => {
      const ma = Math.min(...(a.visit_offerings ?? [{ base_price: 9999 }]).map((o) => o.base_price));
      const mb = Math.min(...(b.visit_offerings ?? [{ base_price: 9999 }]).map((o) => o.base_price));
      return ma - mb;
    });
    return list;
  }, [grades, formats, grantOnly, maxBudget, genreFilters, sort]);

  const grantCount = filtered.filter((a) => a.offers_grant_visits && (a.grant_visits_remaining ?? 0) > 0).length;
  const clearAll = () => { setGrades([]); setFormats([]); setGrantOnly(false); setMaxBudget(1500); setGenreFilters([]); };
  const hasFilters = grades.length || formats.length || grantOnly || maxBudget < 1500 || genreFilters.length;

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
            Every author here is traditionally published, school-visit-experienced, and background-checked. Browse freely — no cost to your school.
          </p>
        </div>
        {/* Grant strip */}
        <div style={{ background: "var(--green-tint)", borderTop: "1px solid #BBDDD0", borderBottom: "1px solid #BBDDD0", padding: "14px 0" }}>
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

          {/* Grant visits */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 15 }}>
              <input type="checkbox" checked={grantOnly} onChange={(e) => setGrantOnly(e.target.checked)}
                style={{ accentColor: "var(--green)", width: 17, height: 17 }} />
              <span style={{ color: "var(--green-deep)", fontWeight: 700 }}>★ Offers grant visits</span>
            </label>
          </div>

          {/* Budget */}
          <div style={{ marginBottom: 24 }}>
            <div className="form-label">Max budget: {maxBudget >= 1500 ? "Any" : `$${maxBudget}`}</div>
            <input type="range" min={0} max={1500} step={50} value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--orange)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-faint)", marginTop: 3 }}>
              <span>$0</span><span>$1,500+</span>
            </div>
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
              <option value="grant">Volunteer visits first</option>
              <option value="price-low">Price: low to high</option>
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

          {filtered.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button className="btn btn-ghost">Load more authors</button>
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
