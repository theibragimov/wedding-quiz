"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase, type Game } from "@/lib/supabase";
import { getMyGameSlugs } from "@/lib/myGames";
import IconDivider from "@/components/IconDivider";
import ConfettiIcon from "@/components/ConfettiIcon";
import { T, useT } from "@/lib/ScriptContext";


export default function Home() {
  const t = useT();
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
    <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-16 sm:pt-10 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl relative"
      >
        <div className="icon-divider mb-1" style={{ maxWidth: 320 }}>
          <span className="icon-divider-line" />
          <p className="font-display text-3xl sm:text-4xl whitespace-nowrap font-semibold" style={{ color: "var(--gold-deep)" }}>
            Visol
          </p>
          <span className="icon-divider-line" />
        </div>
        <span className="icon-divider-glyph text-base block mb-5">◆</span>
        <h1
          className="text-[2.1rem] leading-snug sm:text-5xl md:text-6xl sm:leading-tight font-bold"
          style={{ color: "var(--burgundy)" }}
        >
          <span className="whitespace-nowrap">Visol</span> <T>oqshomingizni</T>
          <br /> <T>bir umrga unutilmas qiling!</T>
        </h1>
        <div className="my-6 flex justify-center">
          <IconDivider icon="diamond" />
        </div>
        <p className="text-muted text-lg sm:text-xl font-body">
          <T>
            Mehmonlaringizni shunchaki tomoshabin bo&apos;lib qolishiga qo&apos;ymang.
            Ularni o&apos;yinga qo&apos;shing, kuldiring, hayajonga soling va
            to&apos;yingizning eng esda qolarli lahzalarini birga yarating.
          </T>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-10"
      >
        <Link href="/create" className="btn-gold btn-gold-hero text-lg">
          <T>Lahza yaratish!</T>
        </Link>
      </motion.div>

      <div className="my-10">
        <IconDivider icon="heart" />
      </div>

      <div className="w-full max-w-3xl">
        <div className="divider-flourish mb-6 text-sm uppercase tracking-widest justify-center">
          <span><T>Mening Lahzalarim</T></span>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: "var(--burgundy)", opacity: 0.6 }}>
            <T>Yuklanmoqda...</T>
          </p>
        ) : games.length === 0 ? (
          <div className="gilded-card p-6 sm:p-8">
            <div className="empty-state">
              <span className="empty-state-icon">
                <ConfettiIcon className="w-9 h-9" />
              </span>
              <div>
                <p className="font-body font-bold text-cream">
                  <T>Hali eng yaxshi lahzalar yaratilgani yo&apos;q...</T> ✨
                </p>
                <p className="font-body text-cream/60 text-sm mt-1">
                  <T>
                    O&apos;yiningizni yarating va mehmonlaringiz bilan birga kulgi,
                    hayajon va unutilmas lahzalarga boy oqshomni tarixga
                    muhirlang!
                  </T>
                </p>
              </div>
            </div>
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
                  {t(g.bride_name)} &amp; {t(g.groom_name)}
                </span>
                <span className="text-cream/50 text-sm">
                  /{g.slug} — {t("statistikani ko'rish")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
