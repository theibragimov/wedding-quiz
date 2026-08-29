"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { makeSlug } from "@/lib/slug";
import { addMyGameSlug } from "@/lib/myGames";
import { blankQuestion, type DraftQuestion } from "@/lib/questions";
import IconDivider from "@/components/IconDivider";
import QuestionsEditor from "@/components/QuestionsEditor";
import ConfirmDialog from "@/components/ConfirmDialog";
import { T, useT } from "@/lib/ScriptContext";

export default function CreatePage() {
  const t = useT();
  const router = useRouter();
  const [step, setStep] = useState<"names" | "questions">("names");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    blankQuestion("bride"),
    blankQuestion("groom"),
  ]);
  const [openIndex, setOpenIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function handleClear() {
    setBrideName("");
    setGroomName("");
    setQuestions([blankQuestion("bride"), blankQuestion("groom")]);
    setOpenIndex(0);
    setStep("names");
    setError(null);
    setShowClearConfirm(false);
  }

  const readyQuestions = questions.filter(
    (q) => q.text.trim() && q.option_a.trim() && q.option_b.trim() && q.option_c.trim() && q.option_d.trim()
  );

  async function handleCreate() {
    setError(null);
    if (readyQuestions.length === 0) {
      setError("Kamida bitta to'liq savol qo'shing.");
      return;
    }
    setSaving(true);
    try {
      const slug = makeSlug(brideName, groomName);
      const { data: game, error: gameErr } = await supabase
        .from("games")
        .insert({ slug, bride_name: brideName.trim(), groom_name: groomName.trim() })
        .select()
        .single();
      if (gameErr || !game) throw gameErr;

      const rows = readyQuestions.map((q, i) => ({ ...q, game_id: game.id, position: i }));
      const { error: qErr } = await supabase.from("questions").insert(rows);
      if (qErr) throw qErr;

      addMyGameSlug(slug);
      router.push(`/game/${slug}?created=1`);
    } catch (e) {
      console.error(e);
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setSaving(false);
    }
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
              <T>Yangi viktorina</T>
            </p>
            <span className="icon-divider-line" />
          </div>
          <span className="icon-divider-glyph text-base block mb-4">◆</span>
          <motion.h1
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-elegant italic text-3xl sm:text-4xl font-medium"
            style={{ color: "var(--burgundy)" }}
          >
            <T>{step === "names" ? "Kelin va kuyov ismlari" : "Savollarni tuzing"}</T>
          </motion.h1>
          <div className="mt-4 flex justify-center">
            <IconDivider icon="diamond" />
          </div>
          <button
            className="btn-ghost inline-block mt-5 text-sm"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ <T>Tozalash</T>
          </button>
        </motion.div>

        <ConfirmDialog
          open={showClearConfirm}
          title={t("Tozalashni istaysizmi?")}
          message={t("Barcha kiritilgan ismlar va savollar butunlay o'chib ketadi. Bu amalni orqaga qaytarib bo'lmaydi.")}
          confirmLabel={t("Ha, tozalash")}
          cancelLabel={t("Yo'q")}
          onConfirm={handleClear}
          onCancel={() => setShowClearConfirm(false)}
        />

        <>
          {step === "names" ? (
            <motion.div
              key="names"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="gilded-card p-6 sm:p-8 space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <label className="block text-sm text-gold-light/80 mb-2"><T>Kelinning ismi</T></label>
                <input
                  className="input-elegant"
                  placeholder={t("Masalan: Zarina")}
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label className="block text-sm text-gold-light/80 mb-2"><T>Kuyovning ismi</T></label>
                <input
                  className="input-elegant"
                  placeholder={t("Masalan: Aziz")}
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="pt-2 flex justify-end"
              >
                <button
                  className="btn-gold"
                  disabled={!brideName.trim() || !groomName.trim()}
                  onClick={() => setStep("questions")}
                >
                  <T>Keyingisi</T> →
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <QuestionsEditor
                questions={questions}
                setQuestions={setQuestions}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />

              {error && <p className="text-center text-rose-300"><T>{error}</T></p>}

              <div className="flex justify-between pt-4">
                <button className="btn-ghost" onClick={() => setStep("names")}>
                  ← <T>Orqaga</T>
                </button>
                <button
                  className="btn-gold btn-gold-hero"
                  disabled={saving}
                  onClick={handleCreate}
                >
                  {saving ? <T>Yaratilmoqda...</T> : <>🎉 <T>O&apos;yinni yaratish</T></>}
                </button>
              </div>
            </motion.div>
          )}
        </>
      </div>
    </main>
  );
}
