"use client";

import { motion } from "framer-motion";
import type { OptionKey } from "@/lib/supabase";
import { blankQuestion, type DraftQuestion } from "@/lib/questions";

const OPTION_KEYS: OptionKey[] = ["a", "b", "c", "d"];

export default function QuestionsEditor({
  questions,
  setQuestions,
  openIndex,
  setOpenIndex,
}: {
  questions: DraftQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<DraftQuestion[]>>;
  openIndex: number;
  setOpenIndex: (i: number) => void;
}) {
  function updateQuestion(i: number, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function addQuestion(about: "bride" | "groom") {
    setQuestions((qs) => [...qs, blankQuestion(about)]);
    setOpenIndex(questions.length);
  }

  function removeQuestion(i: number) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
    setOpenIndex(Math.max(0, openIndex - (openIndex >= i ? 1 : 0)));
  }

  function moveQuestion(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= questions.length) return;
    setQuestions((qs) => {
      const copy = [...qs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    setOpenIndex(j);
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.06 }}
          className="gilded-card overflow-hidden"
        >
          <div className="w-full flex items-center gap-2 px-5 py-4">
            <button
              className="flex-1 flex items-center justify-between text-left min-w-0"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <span className="font-display font-semibold truncate">
                {i + 1}-savol{" "}
                <span className="text-xs font-body text-cream/50 capitalize">
                  ({q.about === "bride" ? "kelin haqida" : "kuyov haqida"})
                </span>
                {q.text && <span className="text-cream/60 font-body"> — {q.text.slice(0, 40)}</span>}
              </span>
              <span className="text-gold-light ml-3 shrink-0">{openIndex === i ? "−" : "+"}</span>
            </button>
            <div className="flex items-center gap-1 shrink-0 pl-1">
              <button
                type="button"
                title="Yuqoriga surish"
                disabled={i === 0}
                onClick={() => moveQuestion(i, -1)}
                className="reorder-btn"
              >
                ↑
              </button>
              <button
                type="button"
                title="Pastga surish"
                disabled={i === questions.length - 1}
                onClick={() => moveQuestion(i, 1)}
                className="reorder-btn"
              >
                ↓
              </button>
            </div>
          </div>

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
        </motion.div>
      ))}

      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button className="btn-ghost" onClick={() => addQuestion("bride")}>
          + Kelin haqida savol
        </button>
        <button className="btn-ghost" onClick={() => addQuestion("groom")}>
          + Kuyov haqida savol
        </button>
      </div>
    </div>
  );
}
