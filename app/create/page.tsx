"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase, type Side, type OptionKey } from "@/lib/supabase";
import { makeSlug } from "@/lib/slug";
import { addMyGameSlug } from "@/lib/myGames";
import Flourish from "@/components/Flourish";

interface DraftQuestion {
  about: Side;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionKey;
}

function blankQuestion(about: Side): DraftQuestion {
  return {
    about,
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "a",
  };
}

const OPTION_KEYS: OptionKey[] = ["a", "b", "c", "d"];

export default function CreatePage() {
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

  function updateQuestion(i: number, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function addQuestion(about: Side) {
    setQuestions((qs) => [...qs, blankQuestion(about)]);
    setOpenIndex(questions.length);
  }

  function removeQuestion(i: number) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
    setOpenIndex((cur) => Math.max(0, cur - (cur >= i ? 1 : 0)));
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
        <div className="text-center mb-10">
          <p className="font-script text-3xl sm:text-4xl text-burgundy mb-1" style={{ color: "var(--burgundy)" }}>
            Yangi viktorina
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold gold-text">
            {step === "names" ? "Kelin va kuyov ismlari" : "Savollarni tuzing"}
          </h1>
          <div className="my-4 flex justify-center">
            <Flourish className="w-32 h-7" />
          </div>
        </div>

        <>
          {step === "names" ? (
            <motion.div
              key="names"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="gilded-card p-6 sm:p-8 space-y-5"
            >
              <div>
                <label className="block text-sm text-gold-light/80 mb-2">Kelinning ismi</label>
                <input
                  className="input-elegant"
                  placeholder="Masalan: Zarina"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gold-light/80 mb-2">Kuyovning ismi</label>
                <input
                  className="input-elegant"
                  placeholder="Masalan: Aziz"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  className="btn-gold"
                  disabled={!brideName.trim() || !groomName.trim()}
                  onClick={() => setStep("questions")}
                >
                  Keyingisi →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {questions.map((q, i) => (
                <div key={i} className="gilded-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  >
                    <span className="font-display font-semibold">
                      {i + 1}-savol{" "}
                      <span className="text-xs font-body text-cream/50 capitalize">
                        ({q.about === "bride" ? "kelin haqida" : "kuyov haqida"})
                      </span>
                      {q.text && <span className="text-cream/60 font-body"> — {q.text.slice(0, 40)}</span>}
                    </span>
                    <span className="text-gold-light">{openIndex === i ? "−" : "+"}</span>
                  </button>

                  {openIndex === i && (
                    <div className="px-5 pb-5 space-y-4 border-t border-gold/15 pt-4">
                      <div className="tab-toggle">
                        <button
                          className={q.about === "bride" ? "active" : ""}
                          onClick={() => updateQuestion(i, { about: "bride" })}
                        >
                          Kelin haqida
                        </button>
                        <button
                          className={q.about === "groom" ? "active" : ""}
                          onClick={() => updateQuestion(i, { about: "groom" })}
                        >
                          Kuyov haqida
                        </button>
                      </div>

                      <input
                        className="input-elegant"
                        placeholder="Savol matni"
                        value={q.text}
                        onChange={(e) => updateQuestion(i, { text: e.target.value })}
                      />

                      <div className="grid sm:grid-cols-2 gap-3">
                        {OPTION_KEYS.map((key) => (
                          <div key={key} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(i, { correct_option: key })}
                              title="To'g'ri javob sifatida belgilash"
                              className={`shrink-0 w-8 h-8 rounded-full border font-display font-bold text-sm flex items-center justify-center transition ${
                                q.correct_option === key
                                  ? "bg-gradient-to-br from-gold-light to-gold text-[#2b1508] border-gold"
                                  : "border-gold/30 text-gold-light/70"
                              }`}
                            >
                              {key.toUpperCase()}
                            </button>
                            <input
                              className="input-elegant"
                              placeholder={`${key.toUpperCase()} variant`}
                              value={q[`option_${key}` as `option_${OptionKey}`]}
                              onChange={(e) =>
                                updateQuestion(i, { [`option_${key}`]: e.target.value } as Partial<DraftQuestion>)
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-cream/40">
                        To&apos;g&apos;ri javobni belgilash uchun harf tugmasini bosing.
                      </p>

                      {questions.length > 1 && (
                        <button
                          className="text-sm text-rose-300/80 hover:text-rose-200"
                          onClick={() => removeQuestion(i)}
                        >
                          Savolni o&apos;chirish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button className="btn-ghost" onClick={() => addQuestion("bride")}>
                  + Kelin haqida savol
                </button>
                <button className="btn-ghost" onClick={() => addQuestion("groom")}>
                  + Kuyov haqida savol
                </button>
              </div>

              {error && <p className="text-center text-rose-300">{error}</p>}

              <div className="flex justify-between pt-4">
                <button className="btn-ghost" onClick={() => setStep("names")}>
                  ← Orqaga
                </button>
                <button className="btn-gold" disabled={saving} onClick={handleCreate}>
                  {saving ? "Yaratilmoqda..." : "🎉 O'yinni yaratish"}
                </button>
              </div>
            </motion.div>
          )}
        </>
      </div>
    </main>
  );
}
