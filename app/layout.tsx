import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";
import PetalField from "@/components/PetalField";
import FloralCorner from "@/components/FloralCorner";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const body = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Toy Viktorinasi",
  description: "Kelin-kuyovni qanchalik yaxshi bilasiz?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <div className="bg-scene" aria-hidden="true">
          <div className="bg-vignette" />
          <div className="bg-glow bg-glow-a" />
          <div className="bg-glow bg-glow-b" />
        </div>
        <PetalField />
        <FloralCorner className="fixed -top-4 -left-4 w-40 sm:w-56 h-40 sm:h-56 z-[1] pointer-events-none" />
        <FloralCorner
          flip
          className="fixed -bottom-4 -right-4 w-40 sm:w-56 h-40 sm:h-56 z-[1] pointer-events-none"
        />
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
