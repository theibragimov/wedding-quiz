"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase, type Game } from "@/lib/supabase";
import { type DraftQuestion } from "@/lib/questions";
import IconDivider from "@/components/IconDivider";
import QuestionsEditor from "@/components/QuestionsEditor";

export default function EditGamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: g } = await supabase.from("games").select("*").eq("slug", slug).single();
      if (!g) {
        setLoading(false);
        return;
      }
      setGame(g);
      setBrideName(g.bride_name);
      setGroomName(g.groom_name);
      const { data: qs } = await supabase
        .from("questions")
        .select("*")
        .eq("game_id", g.id)
        .order("position", { ascending: true });
      setQuestions(
        (qs ?? []).map((q) => ({
          about: q.about,
          text: q.text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option,
        }))
      );
      setLoading(false);
    }
    load();
  }, [slug]);

  const readyQuestions = questions.filter(
    (q) => q.text.trim() && q.option_a.trim() && q.option_b.trim() && q.option_c.trim() && q.option_d.trim()
  );

  async function handleSave() {
    if (!game) return;
    setError(null);
    if (readyQuestions.length === 0) {
      setError("Kamida bitta to'liq savol qo'shing.");
      return;
    }
    setSaving(true);
    try {
      const { error: gameErr } = await supabase
        .from("games")
        .update({ bride_name: brideName.trim(), groom_name: groomName.trim() })
        .eq("id", game.id);
      if (gameErr) throw gameErr;

      const { error: delErr } = await supabase.from("questions").delete().eq("game_id", game.id);
      if (delErr) throw delErr;

      const rows = readyQuestions.map((q, i) => ({ ...q, game_id: game.id, position: i }));
      const { error: qErr } = await supabase.from("questions").insert(rows);
      if (qErr) throw qErr;

      router.push(`/game/${slug}`);
    } catch (e) {
      console.error(e);
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--burgundy)", opacity: 0.6 }}>Yuklanmoqda...</p>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="gilded-card p-8 text-center max-w-md">
          <p className="text-xl font-display font-bold gold-text mb-2">Topilmadi</p>
          <p className="text-cream/60">Bu viktorina mavjud emas yoki o&apos;chirilgan.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-14 sm:py-20">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.jsdelivr.net/gh/theibragimov/wedding-quiz@main/public/gold-rings.png"
            alt=""
            aria-hidden="true"
            className="w-16 sm:w-20 mx-auto mb-2 drop-shadow-[0_6px_14px_rgba(150,110,40,0.35)]"
          />
          <div className="icon-divider mb-1" style={{ maxWidth: 260 }}>
            <span className="icon-divider-line" />
            <p className="font-script text-2xl sm:text-3xl whitespace-nowrap" style={{ color: "var(--gold-deep)" }}>
              Tahrirlash
            </p>
            <span className="icon-divider-line" />
          </div>
          <span className="icon-divider-glyph text-base block mb-4">◆</span>
          <h1
            className="font-elegant italic text-3xl sm:text-4xl font-medium"
            style={{ color: "var(--burgundy)" }}
          >
            {game.bride_name} &amp; {game.groom_name}
          </h1>
          <div className="mt-4 flex justify-center">
            <IconDivider icon="diamond" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="gilded-card p-6 sm:p-8 space-y-5 mb-6"
        >
          <div>
            <label className="block text-sm text-gold-light/80 mb-2">Kelinning ismi</label>
            <input
              className="input-elegant"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gold-light/80 mb-2">Kuyovning ismi</label>
            <input
              className="input-elegant"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <QuestionsEditor
            questions={questions}
            setQuestions={setQuestions}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        </motion.div>

        {error && <p className="text-center text-rose-300 mt-4">{error}</p>}

        <div className="flex justify-between pt-6">
          <button className="btn-ghost" onClick={() => router.push(`/game/${slug}`)}>
            ← Bekor qilish
          </button>
          <button className="btn-gold btn-gold-hero" disabled={saving} onClick={handleSave}>
            {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
          </button>
        </div>
      </div>
    </main>
  );
}
