import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Alex_Brush, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import PetalField from "@/components/PetalField";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const script = Alex_Brush({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const elegant = Bodoni_Moda({
  variable: "--font-elegant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Visol",
  description: "Kelin-kuyovni qanchalik yaxshi bilasiz?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${display.variable} ${body.variable} ${script.variable} ${elegant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Goldeen.jpg"
          alt=""
          aria-hidden="true"
          className="fixed inset-0 w-full h-full object-cover scale-105 blur-sm opacity-100 -z-10 pointer-events-none select-none"
        />
        <div className="bg-scene" aria-hidden="true">
          <div className="bg-vignette" />
          <div className="bg-glow bg-glow-a" />
          <div className="bg-glow bg-glow-b" />
        </div>
        <PetalField />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flower-bloom.png"
          alt=""
          aria-hidden="true"
          className="fixed -top-20 -left-20 w-60 sm:w-96 opacity-90 pointer-events-none select-none z-[1] drop-shadow-[0_10px_24px_rgba(150,110,40,0.25)]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flower-bloom.png"
          alt=""
          aria-hidden="true"
          className="fixed -bottom-20 -right-20 w-60 sm:w-96 opacity-90 pointer-events-none select-none z-[1] rotate-180 drop-shadow-[0_10px_24px_rgba(150,110,40,0.25)]"
        />
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
