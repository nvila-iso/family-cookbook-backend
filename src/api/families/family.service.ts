import { prisma } from "../../../lib/prisma.ts";
import { nanoid } from "nanoid";

export async function searchFamiliesByName(name: string) {
  return prisma.family.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });
}

// --> slug generator to differentiate families with similar names
// --> const slug = generateFamilySlug(familyName);
export function generateFamilySlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return `${base}-${nanoid(4)}`;
}

// --> generating random code for family
export function generateFamilyCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // removed characters that look too similar
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  // hyphen between 3 characters
  return code.slice(0, 3) + "-" + code.slice(3);
}

export async function createFamily(name: string, code: string) {
  const slug = generateFamilySlug;
  return prisma.family.create({
    data: {
      name,
      code,
      slug,
    },
  });
}

export async function findFamilyBySlug(slug: string) {
  return prisma.family.findUnique({
    where: { slug },
    include: {
      members: true,
    },
  });
}
