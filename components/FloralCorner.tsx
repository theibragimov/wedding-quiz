export default function FloralCorner({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 260 260"
      className={className}
      style={flip ? { transform: "rotate(180deg)" } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.9">
        <path d="M10 120c30-40 20-90 70-100 45-9 70 30 55 65-12 28-45 30-55 10" stroke="#c9a24a" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="70" cy="55" rx="26" ry="18" fill="#e9c9a8" opacity="0.55" transform="rotate(-25 70 55)" />
        <ellipse cx="95" cy="75" rx="24" ry="16" fill="#dba97e" opacity="0.5" transform="rotate(10 95 75)" />
        <ellipse cx="60" cy="90" rx="22" ry="15" fill="#f0d9a0" opacity="0.6" transform="rotate(50 60 90)" />
        <circle cx="78" cy="70" r="10" fill="#b8863b" opacity="0.85" />
        <path d="M20 150c20 10 35 35 30 65" stroke="#8fae6f" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        <path d="M35 170c15-4 28 2 34 16" stroke="#8fae6f" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        <path d="M8 60c14 4 22 18 18 34" stroke="#8fae6f" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        <circle cx="150" cy="35" r="5" fill="#c9a24a" opacity="0.7" />
        <circle cx="170" cy="55" r="3.5" fill="#dba97e" opacity="0.7" />
        <circle cx="30" cy="115" r="4" fill="#c9a24a" opacity="0.6" />
      </g>
    </svg>
  );
}
