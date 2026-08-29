"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase, type Game } from "@/lib/supabase";
import { getMyGameSlugs } from "@/lib/myGames";
import Flourish from "@/components/Flourish";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = getMyGameSlugs();
    if (slugs.length === 0) {
      setLoading(false);
      return;
    }
    supabase
      .from("games")
      .select("*")
      .in("slug", slugs)
      .then(({ data }) => {
        const ordered = slugs
          .map((s) => data?.find((g) => g.slug === s))
          .filter(Boolean) as Game[];
        setGames(ordered);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl"
      >
        <p className="font-script text-4xl sm:text-5xl mb-2" style={{ color: "var(--gold-deep)" }}>
          Toy Viktorinasi
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight" style={{ color: "var(--burgundy)" }}>
          Kelin-kuyovni
          <br /> qanchalik yaxshi bilasiz?
        </h1>
        <div className="my-6 flex justify-center">
          <Flourish className="w-40 h-8" />
        </div>
        <p className="text-lg sm:text-xl font-body" style={{ color: "var(--burgundy)", opacity: 0.75 }}>
          O&apos;z to&apos;yingiz uchun ajoyib viktorina yarating, mehmonlaringizni
          sinovdan o&apos;tkazing va g&apos;oliblarni jonli statistikada kuzating.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-10"
      >
        <Link href="/create" className="btn-gold text-lg">
          ✨ O&apos;yin yaratish
        </Link>
      </motion.div>

      <div className="mt-20 w-full max-w-3xl">
        <div className="divider-flourish mb-6 text-sm uppercase tracking-widest justify-center">
          <span>Mening o&apos;yinlarim</span>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: "var(--burgundy)", opacity: 0.6 }}>
            Yuklanmoqda...
          </p>
        ) : games.length === 0 ? (
          <div className="gilded-card p-8 text-center text-cream/60">
            Hali hech qanday o&apos;yin yaratilmagan. Yuqoridagi tugma orqali
            birinchi viktorinangizni yarating!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {games.map((g) => (
              <Link
                key={g.id}
                href={`/game/${g.slug}`}
                className="gilded-card p-5 flex flex-col gap-1 hover:-translate-y-1 transition-transform"
              >
                <span className="font-display text-xl font-bold text-gold-light">
                  {g.bride_name} &amp; {g.groom_name}
                </span>
                <span className="text-cream/50 text-sm">
                  /{g.slug} — statistikani ko&apos;rish
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
