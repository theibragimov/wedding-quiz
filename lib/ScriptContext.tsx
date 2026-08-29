"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translit } from "@/lib/translit";

type Script = "cyrillic" | "latin";

const ScriptCtx = createContext<{
  script: Script;
  toggle: () => void;
}>({ script: "cyrillic", toggle: () => {} });

const KEY = "wedding-quiz:script";

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScript] = useState<Script>("cyrillic");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "latin" || saved === "cyrillic") setScript(saved);
    } catch {}
  }, []);

  function toggle() {
    setScript((s) => {
      const next = s === "cyrillic" ? "latin" : "cyrillic";
      try {
        window.localStorage.setItem(KEY, next);
      } catch {}
      return next;
    });
  }

  return <ScriptCtx.Provider value={{ script, toggle }}>{children}</ScriptCtx.Provider>;
}

export function useScript() {
  return useContext(ScriptCtx);
}

export function useT() {
  const { script } = useContext(ScriptCtx);
  return (text: string) => translit(text, script);
}

export function T({ children }: { children: string }) {
  const { script } = useContext(ScriptCtx);
  return <>{translit(children, script)}</>;
}
