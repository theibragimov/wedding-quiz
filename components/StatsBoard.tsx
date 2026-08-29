"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/lib/supabase";
import { T, useT } from "@/lib/ScriptContext";

const MEDAL = ["🥇", "🥈", "🥉", "🏅"];

export default function StatsBoard({ participants }: { participants: Participant[] }) {
  const t = useT();
  const sorted = [...participants].sort((a, b) => b.score - a.score || a.created_at.localeCompare(b.created_at));
  const top4 = sorted.slice(0, 4);
  const rest = sorted.slice(4);

  if (sorted.length === 0) {
    return (
      <div className="gilded-card p-8 text-center text-cream/70">
        <T>Hozircha ishtirokchilar yo&apos;q. Havolani mehmonlar bilan ulashing!</T>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {top4.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`gilded-card rank-${i + 1} p-4 text-center flex flex-col items-center gap-1`}
          >
            <span className="text-3xl">{MEDAL[i]}</span>
            <span className="font-display font-bold text-lg gold-text truncate w-full">
              {t(p.full_name)}
            </span>
            <span className="mt-1 text-2xl font-display font-extrabold text-gold-light">
              {p.score}/{p.total_questions}
            </span>
          </motion.div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="gilded-card p-4 sm:p-6">
          <div className="divider-flourish mb-4 text-sm uppercase tracking-widest">
            <span><T>Qolganlar</T></span>
          </div>
          <ol className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-2">
            {rest.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gold-light/70 font-display font-semibold w-6 text-right">
                    {i + 5}
                  </span>
                  <span className="font-medium">{t(p.full_name)}</span>
                </span>
                <span className="font-display font-bold text-gold-light">
                  {p.score}/{p.total_questions}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="text-center text-cream/60 text-sm">
        <T>Jami ishtirokchilar:</T> <span className="text-gold-light font-semibold">{sorted.length}</span>
      </p>
    </div>
  );
}
