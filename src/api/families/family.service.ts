import { prisma } from "../../../lib/prisma.ts";

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
  return prisma.family.create({
    data: {
      name,
      code,
    },
  });
}
