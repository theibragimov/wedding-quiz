"use client";

import { use, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Game, type Question, type OptionKey } from "@/lib/supabase";
import Flourish from "@/components/Flourish";
import { T, useT, useScript } from "@/lib/ScriptContext";

type Stage = "loading" | "notfound" | "welcome" | "register" | "quiz" | "done";

const OPTION_KEYS: OptionKey[] = ["a", "b", "c", "d"];
const TIME_PER_Q = 12;

export default function GuestQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = useT();
  const { script } = useScript();
  const headingFont = script === "cyrillic" ? "font-body" : "font-display";
  const { slug } = use(params);
  const [stage, setStage] = useState<Stage>("loading");
  const [game, setGame] = useState<Game | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [score, setScore] = useState(0);
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [reveal, setReveal] = useState<"correct" | "wrong" | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const participantId = useRef<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: g } = await supabase.from("games").select("*").eq("slug", slug).single();
      if (!g) {
        setStage("notfound");
        return;
      }
      setGame(g);
      const { data: qs } = await supabase
        .from("questions")
        .select("*")
        .eq("game_id", g.id)
        .order("position", { ascending: true });
      setQuestions(qs ?? []);
      setStage("welcome");
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (stage !== "quiz" || !questions[current]) return;
    setTimeLeft(TIME_PER_Q);
    const tick = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [stage, current, questions]);

  useEffect(() => {
    if (stage !== "quiz" || selected) return;
    if (timeLeft === 0) chooseOption(null);
  }, [timeLeft, stage, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  async function handleRegister() {
    if (!game || !fullName.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await supabase
        .from("participants")
        .insert({
          game_id: game.id,
          full_name: fullName.trim(),
          score: 0,
          total_questions: questions.length,
        })
        .select()
        .single();
      if (data) participantId.current = data.id;
      setStage("quiz");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  function chooseOption(key: OptionKey | null) {
    if (selected) return;
    setSelected(key ?? ("__timeout__" as OptionKey));
    const q = questions[current];
    const correct = key === q.correct_option;
    setReveal(correct ? "correct" : "wrong");
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    if (participantId.current) {
      supabase.from("participants").update({ score: newScore }).eq("id", participantId.current).then();
    }
    advanceTimer.current = setTimeout(() => {
      setSelected(null);
      setReveal(null);
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
      } else {
        setStage("done");
      }
    }, 1400);
  }

  if (stage === "loading") {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="ink-text/60" style={{ color: "var(--burgundy)" }}><T>Yuklanmoqda...</T></p>
      </main>
    );
  }

  if (stage === "notfound") {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="gilded-card p-8 text-center max-w-md">
          <p className="text-xl font-display font-bold gold-text mb-2"><T>Havola topilmadi</T></p>
          <p className="text-cream/60"><T>Bu viktorina mavjud emas yoki o&apos;chirilgan.</T></p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-14">
      <AnimatePresence>
        {reveal && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{
              background:
                reveal === "correct"
                  ? "radial-gradient(circle at 50% 40%, rgba(90,200,120,0.35), transparent 65%)"
                  : "radial-gradient(circle at 50% 40%, rgba(224,90,90,0.35), transparent 65%)",
            }}
          />
        )}
      </AnimatePresence>
      <div className="w-full max-w-xl">
        <>
          {stage === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gilded-card p-8 sm:p-10 text-center space-y-5"
            >
              <p className="font-script text-3xl text-gold-light"><T>Xush kelibsiz</T></p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold gold-text">
                Visol oqshomi, to&apos;y {game?.groom_name ?? ""} va {game?.bride_name ?? ""}
              </h1>
              <Flourish className="w-32 h-7 mx-auto" />
              <p className="text-cream/75 text-lg">
                <T>Ikki yoshni qanchalik yaxshi bilishingizni tekshirib ko&apos;ramiz.</T>
              </p>
              <p className="text-cream/50 text-sm">{questions.length} <T>ta savol sizni kutmoqda</T></p>
              <button className="btn-gold text-lg mt-2" onClick={() => setStage("register")}>
                <T>Boshlash</T> →
              </button>
            </motion.div>
          )}

          {stage === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="gilded-card p-6 sm:p-8 space-y-5"
            >
              <h2 className={`${headingFont} text-2xl font-bold gold-text text-center`}>
                <T>Ism familyangizni kiriting</T>
              </h2>
              <input
                className="input-elegant"
                placeholder={t("Ism Familiya")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
              />
              <button
                className="btn-gold w-full"
                disabled={!fullName.trim() || submitting}
                onClick={handleRegister}
              >
                {submitting ? <T>Boshlanmoqda...</T> : <><T>Boshlash</T> 🎉</>}
              </button>
            </motion.div>
          )}

          {stage === "quiz" && questions[current] && (
            <motion.div
              key={`q-${current}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gilded-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="game-chip">
                  {current + 1} <span className="opacity-50">/ {questions.length}</span>
                </span>
                <span className="game-chip">🏆 {score} <T>ball</T></span>
              </div>

              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-cream/50">
                <span>
                  {questions[current].about === "bride" ? <>💍 <T>Kelin haqida</T></> : <>🤵 <T>Kuyov haqida</T></>}
                </span>
                <motion.span
                  key={`t-${timeLeft}`}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className={`font-display text-base font-extrabold ${
                    timeLeft <= 3 ? "text-red-400" : "text-gold-light"
                  }`}
                >
                  {timeLeft}s
                </motion.span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      timeLeft <= 3
                        ? "linear-gradient(90deg,#e05a5a,#ff8a8a)"
                        : "linear-gradient(90deg, var(--gold), var(--gold-light))",
                  }}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / TIME_PER_Q) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <h2 className={`${headingFont} text-2xl sm:text-3xl font-bold text-cream leading-snug`}>
                {t(questions[current].text)}
              </h2>
              <div className="grid gap-3">
                {OPTION_KEYS.map((key) => {
                  const q = questions[current];
                  const isSelected = selected === key;
                  const isCorrect = q.correct_option === key;
                  let cls = "option-btn";
                  if (selected) {
                    if (isCorrect) cls += " correct";
                    else if (isSelected) cls += " wrong";
                  }
                  return (
                    <motion.button
                      key={key}
                      className={cls}
                      disabled={!!selected}
                      onClick={() => chooseOption(key)}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="font-display font-bold text-gold-light mr-2">
                        {key.toUpperCase()}.
                      </span>
                      {t(q[`option_${key}` as `option_${OptionKey}`])}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {reveal && (
                  <motion.div
                    key="reveal-stamp"
                    initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: -6 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 340, damping: 18 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span
                      className={`stamp ${reveal === "correct" ? "stamp-correct" : "stamp-wrong"}`}
                    >
                      {reveal === "correct" ? <>✅ <T>TO&apos;G&apos;RI!</T></> : <>❌ <T>NOTO&apos;G&apos;RI</T></>}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gilded-card p-8 sm:p-10 text-center space-y-4"
            >
              <div className="text-5xl">🎁</div>
              <h2 className={`${headingFont} text-3xl font-extrabold gold-text`}>
                <T>Rahmat,</T> {t(fullName.split(" ")[0])}!
              </h2>
              <p className="text-cream/75 text-lg">
                <T>Natijangiz:</T> {score}/{questions.length}
              </p>
              <p className="text-cream/60">
                <T>Sizga kichik bir sovg&apos;amiz bor. Toyimizda ishtirok etganingiz uchun tashakkur!</T>
              </p>
            </motion.div>
          )}
        </>
      </div>
    </main>
  );
}
