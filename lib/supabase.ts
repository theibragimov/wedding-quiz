import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgjcifbvwlkszrcoastx.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnamNpZmJ2d2xrc3pyY29hc3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODU2MDksImV4cCI6MjEwMzU2MTYwOX0.hMJvY_jEt-3A6hJZ21hCKKYzK6LpK-_yH-gELhcu1oI";

export const supabase = createClient(url, key);

export type Side = "bride" | "groom";
export type OptionKey = "a" | "b" | "c" | "d";

export interface Game {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  created_at: string;
}

export interface Question {
  id: string;
  game_id: string;
  about: Side;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionKey;
  position: number;
}

export interface Participant {
  id: string;
  game_id: string;
  full_name: string;
  side: Side;
  score: number;
  total_questions: number;
  created_at: string;
}
