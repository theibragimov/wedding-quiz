export default function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 20C40 4 70 36 100 20C130 4 160 36 198 20"
        stroke="url(#g)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="100" cy="20" r="4" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="200" y2="0">
          <stop offset="0%" stopColor="#e8c874" stopOpacity="0" />
          <stop offset="50%" stopColor="#f7e7b4" stopOpacity="1" />
          <stop offset="100%" stopColor="#e8c874" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
