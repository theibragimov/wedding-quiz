// Uzbek Latin -> Cyrillic transliteration (approximate, good enough for UI text).

const DIGRAPHS: [string, string][] = [
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
  ["ye", "е"],
  ["sh", "ш"],
  ["ch", "ч"],
  ["ng", "нг"],
  ["o'", "ў"],
  ["o‘", "ў"],
  ["o’", "ў"],
  ["g'", "ғ"],
  ["g‘", "ғ"],
  ["g’", "ғ"],
];

const SINGLES: Record<string, string> = {
  a: "а",
  b: "б",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
  "'": "ъ",
  "‘": "ъ",
  "’": "ъ",
};

function matchCase(sample: string, target: string): string {
  if (sample.length === 0) return target;
  const isUpper = sample === sample.toUpperCase() && sample !== sample.toLowerCase();
  const isTitle = sample[0] === sample[0].toUpperCase() && sample[0] !== sample[0].toLowerCase();
  if (isUpper && target.length > 1) return target.toUpperCase();
  if (isTitle) return target.charAt(0).toUpperCase() + target.slice(1);
  return target;
}

export function toCyrillic(input: string): string {
  let out = "";
  let i = 0;
  const lower = input.toLowerCase();
  while (i < input.length) {
    let matched = false;
    for (const [lat, cyr] of DIGRAPHS) {
      if (lower.startsWith(lat, i)) {
        out += matchCase(input.slice(i, i + lat.length), cyr);
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const ch = input[i];
    const lowerCh = lower[i];
    if (SINGLES[lowerCh]) {
      out += matchCase(ch, SINGLES[lowerCh]);
    } else {
      out += ch;
    }
    i += 1;
  }
  return out;
}

export function translit(text: string, script: "cyrillic" | "latin"): string {
  if (script === "latin") return text;
  return toCyrillic(text);
}
