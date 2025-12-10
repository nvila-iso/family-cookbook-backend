import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma.ts";

// Registration
export async function registerUser(data: { email: string; password: string }) {
  // hash the password before sending
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
}

// patch user data
export async function updateUserProfile(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      familyId: true,
    },
  });
}

// Find User via Email
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// Find User via Id
export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: { family: true },
  });
}
