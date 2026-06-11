"use client";
import Link from "next/link";
import { Author } from "@/lib/types";
import BookCover from "./book-cover";

interface Props {
  author: Partial<Author>;
  showGrantRing?: boolean;
}

export default function AuthorCard({ author, showGrantRing }: Props) {
  const hasGrant = author.offers_grant_visits && (author.grant_visits_remaining ?? 0) > 0;
  const minPrice = author.visit_offerings
    ? Math.min(...author.visit_offerings.map((o) => o.base_price))
    : null;

  return (
    <Link
      href={`/authors/${author.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        className={`card card-hover${hasGrant && showGrantRing !== false ? " grant-ring" : ""}`}
        style={{ overflow: "hidden" }}
      >
        {/* Photo placeholder */}
        <div className="ph" style={{ aspectRatio: "5/4", position: "relative" }}>
          <span style={{
            fontFamily: "monospace", fontSize: 11, letterSpacing: ".08em",
            textTransform: "uppercase", color: "var(--ink-faint)",
            background: "rgba(255,255,255,.6)", padding: "4px 8px", borderRadius: 4,
          }}>Author photo</span>
          {hasGrant && (
            <div className="badge badge-grant" style={{ position: "absolute", top: 10, left: 10, fontSize: 11 }}>
              ★ Grant visit
            </div>
          )}
          {/* Save button */}
          <button
            style={{
              position: "absolute", top: 8, right: 8, width: 32, height: 32,
              background: "rgba(255,255,255,.8)", border: "none", borderRadius: "50%",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15,
            }}
            onClick={(e) => e.preventDefault()}
            aria-label="Save to shortlist"
          >♡</button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 16px 0" }}>
          <h3 style={{ fontSize: 19, marginBottom: 2 }}>{author.name}</h3>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 12px" }}>{author.tagline}</p>

          {/* Mini book covers */}
          {author.books && author.books.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {author.books.slice(0, 3).map((b, i) => (
                <div key={i} style={{ width: 36, flexShrink: 0 }}>
                  <BookCover color={b.cover_color} />
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {author.grade_range?.slice(0, 2).map((g) => (
              <span key={g} className="badge badge-grade" style={{ fontSize: 11, padding: "4px 9px" }}>{g}</span>
            ))}
            {author.visit_offerings?.some((o) => o.kind !== "virtual") && (
              <span className="badge badge-in-person" style={{ fontSize: 11, padding: "4px 9px" }}>📍 In-person</span>
            )}
            {author.visit_offerings?.some((o) => o.kind === "virtual") && (
              <span className="badge badge-virtual" style={{ fontSize: 11, padding: "4px 9px" }}>💻 Virtual</span>
            )}
          </div>
        </div>

        {/* Foot */}
        <div style={{
          padding: "12px 16px", marginTop: 12,
          borderTop: "1px dashed var(--line)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 16 }}>
            {minPrice ? `From $${minPrice}` : "Varies"}
          </span>
          <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
            {author.location_city}, {author.location_state}
          </span>
        </div>
      </div>
    </Link>
  );
}
