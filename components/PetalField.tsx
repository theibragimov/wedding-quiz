"use client";

function Petal({ style, size, hue }: { style: React.CSSProperties; size: number; hue: "gold" | "rose" }) {
  const fill =
    hue === "gold"
      ? "linear-gradient(135deg, #f7e7b4, #e8c874)"
      : "linear-gradient(135deg, #f2c6d3, #c46a86)";
  return (
    <span
      className="petal"
      style={{
        ...style,
        width: size,
        height: size * 1.3,
        background: fill,
        borderRadius: "0% 70% 0% 70%",
      }}
    />
  );
}

const PETALS = Array.from({ length: 16 }).map((_, i) => {
  const left = (i * 137.5) % 100;
  const delay = -(i * 3.7) % 26;
  const duration = 16 + (i % 6) * 2.3;
  const size = 10 + (i % 4) * 4;
  const swayDuration = 4 + (i % 3);
  return {
    id: i,
    left,
    delay,
    duration,
    size,
    swayDuration,
    hue: i % 3 === 0 ? ("rose" as const) : ("gold" as const),
  };
});

export default function PetalField() {
  return (
    <div className="petal-field">
      {PETALS.map((p) => (
        <Petal
          key={p.id}
          size={p.size}
          hue={p.hue}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s, ${p.swayDuration}s`,
            animationDelay: `${p.delay}s, ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
