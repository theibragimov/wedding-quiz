export default function Crown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 27 L5 13 L13 19.5 L24 6 L35 19.5 L43 13 L43 27 Z"
        stroke="var(--gold-deep)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="5" y1="27" x2="43" y2="27" stroke="var(--gold-deep)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.3" fill="var(--gold-deep)" />
      <circle cx="5" cy="11" r="2" fill="var(--gold-deep)" />
      <circle cx="43" cy="11" r="2" fill="var(--gold-deep)" />
    </svg>
  );
}
