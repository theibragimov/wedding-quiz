"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { supabase, type Game, type Participant } from "@/lib/supabase";
import { addMyGameSlug } from "@/lib/myGames";
import StatsBoard from "@/components/StatsBoard";
import IconDivider from "@/components/IconDivider";
import { T, useT } from "@/lib/ScriptContext";

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = useT();
  const { slug } = use(params);
  const created = useSearchParams().get("created") === "1";
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    addMyGameSlug(slug);
    setLink(`${window.location.origin}/q/${slug}`);

    async function load() {
      const { data: g } = await supabase.from("games").select("*").eq("slug", slug).single();
      if (!g) return;
      setGame(g);
      const { data: p } = await supabase
        .from("participants")
        .select("*")
        .eq("game_id", g.id)
        .order("score", { ascending: false });
      setParticipants(p ?? []);
    }
    load();

    const channel = supabase
      .channel(`participants-${slug}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "participants" },
        (payload) => {
          setParticipants((cur) => [...cur, payload.new as Participant]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "participants" },
        (payload) => {
          const updated = payload.new as Participant;
          setParticipants((cur) => cur.map((p) => (p.id === updated.id ? updated : p)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  if (!game) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--burgundy)", opacity: 0.6 }}><T>Yuklanmoqda...</T></p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-14 sm:py-20">
      <div className="w-full max-w-3xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          {created && (
            <p className="text-sm mb-3" style={{ color: "#2f7a4d" }}>
              ✅ <T>Viktorina muvaffaqiyatli yaratildi!</T>
            </p>
          )}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/theibragimov/wedding-quiz@main/public/gold-rings.png"
            alt=""
            aria-hidden="true"
            className="w-16 sm:w-20 mx-auto mb-2 drop-shadow-[0_6px_14px_rgba(150,110,40,0.35)]"
            whileHover={{ scale: 1.12, rotate: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
          />
          <div className="icon-divider mb-1" style={{ maxWidth: 260 }}>
            <span className="icon-divider-line" />
            <p className="font-script text-2xl sm:text-3xl whitespace-nowrap" style={{ color: "var(--gold-deep)" }}>
              <T>Visol</T>
            </p>
            <span className="icon-divider-line" />
          </div>
          <span className="icon-divider-glyph text-base block mb-4">◆</span>
          <h1
            className="font-elegant italic text-3xl sm:text-5xl font-medium"
            style={{ color: "var(--burgundy)" }}
          >
            {t(game.bride_name)} &amp; {t(game.groom_name)}
          </h1>
          <div className="mt-4 flex justify-center">
            <IconDivider icon="diamond" />
          </div>
          <Link href={`/game/${slug}/edit`} className="btn-ghost inline-block mt-5 text-sm">
            ✏️ <T>Savollarni tahrirlash</T>
          </Link>
        </motion.div>

        <div className="gilded-card p-6 sm:p-8 flex flex-col items-center gap-4">
          <p className="text-cream/70 text-center">
            <T>Mehmonlar uchun havolani ulashing yoki QR kod orqali taqdim eting:</T>
          </p>
          <div className="flex items-center gap-2 w-full max-w-md">
            <input readOnly className="input-elegant text-sm" value={link} />
            <button
              className="btn-ghost !px-4"
              onClick={() => {
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "✓" : <T>Nusxa</T>}
            </button>
          </div>
          <button className="btn-gold" onClick={() => setShowQr((s) => !s)}>
            {showQr ? <T>QR kodni yashirish</T> : <>📱 <T>QR kod yaratish</T></>}
          </button>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-cream p-4 rounded-2xl"
            >
              <QRCodeSVG value={link} size={200} fgColor="#241019" />
            </motion.div>
          )}
        </div>

        <div>
          <div className="divider-flourish mb-6 text-sm uppercase tracking-widest justify-center">
            <span><T>Statistika</T></span>
          </div>
          <StatsBoard participants={participants} />
        </div>
      </div>
    </main>
  );
}
