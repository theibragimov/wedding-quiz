export default function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 2 C11.6 6.4 12.6 8.4 17 9 C12.6 9.6 11.6 11.6 11 16 C10.4 11.6 9.4 9.6 5 9 C9.4 8.4 10.4 6.4 11 2Z"
        fill="currentColor"
      />
      <path
        d="M21 13 C21.35 15.4 21.9 16.5 24 16.8 C21.9 17.1 21.35 18.2 21 20.6 C20.65 18.2 20.1 17.1 18 16.8 C20.1 16.5 20.65 15.4 21 13Z"
        fill="currentColor"
      />
      <path
        d="M5.5 17 C5.75 18.6 6.1 19.3 7.5 19.5 C6.1 19.7 5.75 20.4 5.5 22 C5.25 20.4 4.9 19.7 3.5 19.5 C4.9 19.3 5.25 18.6 5.5 17Z"
        fill="currentColor"
      />
    </svg>
  );
}
