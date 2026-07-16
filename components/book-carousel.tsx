"use client";
import BookCover from "./book-cover";

export interface CarouselBook {
  color: string;
  title?: string;
  imageUrl?: string;
}

/** An infinitely-scrolling shelf of tilted book covers. */
export default function BookCarousel({ books }: { books: CarouselBook[] }) {
  if (!books.length) return null;
  // Duplicate so the marquee can loop seamlessly.
  const loop = [...books, ...books];
  const tilts = [-6, -2, 3, 7, -4, 2, -8, 5];

  return (
    <div className="bc-mask" style={{ marginTop: 56, position: "relative", overflow: "hidden", width: "100%" }}>
      <div className="bc-track" style={{ display: "flex", gap: 22, width: "max-content", alignItems: "flex-end" }}>
        {loop.map((b, i) => (
          <div
            key={i}
            className="bc-item"
            style={{ width: 90, flexShrink: 0, transform: `rotate(${tilts[i % tilts.length]}deg)` }}
          >
            <BookCover color={b.color} title={b.title} imageUrl={b.imageUrl} />
          </div>
        ))}
      </div>
      <style>{`
        .bc-track {
          animation: bc-scroll 38s linear infinite;
        }
        .bc-mask:hover .bc-track { animation-play-state: paused; }
        .bc-item { transition: transform .25s ease; }
        .bc-item:hover { transform: translateY(-8px) rotate(0deg) scale(1.05) !important; }
        @keyframes bc-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bc-track { animation: none; flex-wrap: wrap; justify-content: center; }
        }
        /* Soft fade on the edges */
        .bc-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
      `}</style>
    </div>
  );
}
