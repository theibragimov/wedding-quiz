import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 4);

export function makeSlug(brideName: string, groomName: string) {
  const initials = `${brideName.trim().charAt(0)}${groomName.trim().charAt(0)}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "xx";
  return `${initials}${nanoid()}`;
}
