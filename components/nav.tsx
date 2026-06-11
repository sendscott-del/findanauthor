"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(251,243,228,.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1.5px solid var(--line)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "var(--orange)", display: "flex", alignItems: "flex-end",
            justifyContent: "center", gap: 3, padding: "6px 7px", flexShrink: 0,
          }}>
            {[14, 20, 12].map((h, i) => (
              <div key={i} style={{ width: 6, height: h, background: "rgba(255,255,255,.9)", borderRadius: 2 }} />
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Young Serif', Georgia, serif", fontSize: 17, color: "var(--ink)", lineHeight: 1.1 }}>
              Writers for Readers
            </div>
            <div style={{ fontFamily: "'Mulish', sans-serif", fontSize: 11, color: "var(--ink-faint)", fontWeight: 600, letterSpacing: ".03em" }}>
              findanauthor.org
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav">
          {[
            ["Find an author", "/authors"],
            ["How it works", "/#how"],
            ["Volunteer visits", "/#grant"],
            ["For authors", "/apply"],
          ].map(([label, href]) => (
            <Link key={href} href={href} style={{
              fontFamily: "'Mulish', sans-serif", fontWeight: 700, fontSize: 14.5,
              color: "var(--ink-soft)", textDecoration: "none",
            }}
              className="hover:text-ink"
            >
              {label}
            </Link>
          ))}
          <Link href="/request" className="btn btn-primary btn-sm">Request a visit</Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink)", padding: 4 }}
          className="mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          borderTop: "1.5px solid var(--line)",
          background: "rgba(251,243,228,.97)",
          padding: "20px 28px 28px",
        }}>
          {[
            ["Find an author", "/authors"],
            ["How it works", "/#how"],
            ["Volunteer visits", "/#grant"],
            ["For authors", "/apply"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              display: "block", fontFamily: "'Mulish', sans-serif", fontWeight: 700,
              fontSize: 17, color: "var(--ink)", textDecoration: "none", padding: "12px 0",
              borderBottom: "1px solid var(--line-soft)",
            }}>
              {label}
            </Link>
          ))}
          <div style={{ marginTop: 20 }}>
            <Link href="/request" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
              Request a visit
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-toggle { display: none !important; }
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
