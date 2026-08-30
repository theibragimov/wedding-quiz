import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ScriptToggle from "@/components/ScriptToggle";
import { ScriptProvider } from "@/lib/ScriptContext";

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Visol",
  description: "Kelin-kuyovni qanchalik yaxshi bilasiz?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <ScriptProvider>
        <div className="bg-scene" aria-hidden="true">
          <div className="bg-vignette" />
          <div className="bg-glow bg-glow-a" />
          <div className="bg-glow bg-glow-b" />
        </div>
        <ScriptToggle />
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        </ScriptProvider>
      </body>
    </html>
  );
}
