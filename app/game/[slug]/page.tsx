"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { supabase, type Game, type Participant } from "@/lib/supabase";
import { addMyGameSlug } from "@/lib/myGames";
import StatsBoard from "@/components/StatsBoard";
import Flourish from "@/components/Flourish";

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  if (!game) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--burgundy)", opacity: 0.6 }}>Yuklanmoqda...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-14 sm:py-20">
      <div className="w-full max-w-3xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {created && (
            <p className="text-sm mb-3" style={{ color: "#2f7a4d" }}>
              ✅ Viktorina muvaffaqiyatli yaratildi!
            </p>
          )}
          <p className="font-script text-3xl sm:text-4xl mb-1" style={{ color: "var(--gold-deep)" }}>
            Toy Viktorinasi
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold" style={{ color: "var(--burgundy)" }}>
            {game.bride_name} &amp; {game.groom_name}
          </h1>
          <div className="my-4 flex justify-center">
            <Flourish className="w-32 h-7" />
          </div>
        </motion.div>

        <div className="gilded-card p-6 sm:p-8 flex flex-col items-center gap-4">
          <p className="text-cream/70 text-center">
            Mehmonlar uchun havolani ulashing yoki QR kod orqali taqdim eting:
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
              {copied ? "✓" : "Nusxa"}
            </button>
          </div>
          <button className="btn-gold" onClick={() => setShowQr((s) => !s)}>
            {showQr ? "QR kodni yashirish" : "📱 QR kod yaratish"}
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
            <span>Statistika</span>
          </div>
          <StatsBoard participants={participants} />
        </div>
      </div>
    </main>
  );
}
