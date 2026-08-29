import type { Side, OptionKey } from "@/lib/supabase";

export interface DraftQuestion {
  about: Side;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionKey;
}

export function blankQuestion(about: Side): DraftQuestion {
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
