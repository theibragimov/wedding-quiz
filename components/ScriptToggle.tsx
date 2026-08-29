"use client";

import { useScript } from "@/lib/ScriptContext";

export default function ScriptToggle() {
  const { script, toggle } = useScript();
  return (
    <button
      onClick={toggle}
      className="script-toggle"
      title="Кирилл / Lotin"
    >
      {script === "cyrillic" ? "Aa Lotin" : "Аа Кирилл"}
    </button>
  );
}
