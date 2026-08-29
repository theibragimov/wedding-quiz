const KEY = "wedding-quiz:my-games";

export function getMyGameSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addMyGameSlug(slug: string) {
  if (typeof window === "undefined") return;
  const current = getMyGameSlugs();
  if (!current.includes(slug)) {
    window.localStorage.setItem(KEY, JSON.stringify([slug, ...current]));
  }
}
