export default function ConfettiIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 38 L16 20 L28 32 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M18 18 C 22 10, 30 8, 36 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 24 C 28 20, 34 19, 38 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="38" cy="10" r="1.8" fill="currentColor" />
      <circle cx="30" cy="6" r="1.4" fill="currentColor" />
      <circle cx="42" cy="18" r="1.4" fill="currentColor" />
      <circle cx="20" cy="8" r="1.2" fill="currentColor" />
      <path d="M34 28 l2.4 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 34 l2.4 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
