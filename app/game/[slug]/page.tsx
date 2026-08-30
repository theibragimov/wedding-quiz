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
import ConfirmDialog from "@/components/ConfirmDialog";
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function handleClearParticipants() {
    if (!game) return;
    setClearing(true);
    try {
      await supabase.from("participants").delete().eq("game_id", game.id);
      setParticipants([]);
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  }

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
          <div className="icon-divider mb-1" style={{ maxWidth: 260 }}>
            <span className="icon-divider-line" />
            <p className="font-display text-2xl sm:text-3xl whitespace-nowrap font-semibold" style={{ color: "var(--gold-deep)" }}>
              Visol
            </p>
            <span className="icon-divider-line" />
          </div>
          <span className="icon-divider-glyph text-base block mb-4">◆</span>
          <h1
            className="text-3xl sm:text-5xl font-bold"
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
          {participants.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                className="btn-ghost text-sm text-rose-300/80 hover:text-rose-200"
                onClick={() => setShowClearConfirm(true)}
              >
                🗑️ <T>Ishtirokchilarni tozalash</T>
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        title={t("Ishtirokchilarni tozalashni istaysizmi?")}
        message={t("Barcha ishtirokchilar va ularning natijalari butunlay o'chib ketadi. Savollar o'zgarishsiz qoladi. Bu amalni orqaga qaytarib bo'lmaydi.")}
        confirmLabel={clearing ? t("Tozalanmoqda...") : t("Ha, tozalash")}
        cancelLabel={t("Yo'q")}
        onConfirm={handleClearParticipants}
        onCancel={() => setShowClearConfirm(false)}
      />
    </main>
  );
}
