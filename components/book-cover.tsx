interface Props {
  color: string;
  title?: string;
  width?: number;
}

export default function BookCover({ color, title, width = 80 }: Props) {
  return (
    <div
      className="cover"
      style={{
        background: color,
        width: "100%",
        aspectRatio: "2/3",
        borderRadius: "3px 8px 8px 3px",
        boxShadow: "var(--shadow-m)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Spine shadow */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 7,
        background: "rgba(0,0,0,.18)", zIndex: 1,
      }} />
      {/* Title text */}
      {title && (
        <div style={{
          position: "absolute", bottom: 8, left: 10, right: 10,
          fontFamily: "'Young Serif', Georgia, serif", fontSize: 11, color: "rgba(255,255,255,.9)",
          lineHeight: 1.2, textShadow: "0 1px 3px rgba(0,0,0,.35)", zIndex: 2,
        }}>
          {title}
        </div>
      )}
      {/* Deco lines */}
      <div style={{
        position: "absolute", top: 14, left: 14, right: 14,
        height: 2, background: "rgba(255,255,255,.25)", borderRadius: 1,
      }} />
    </div>
  );
}
