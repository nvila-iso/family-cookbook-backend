import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma.ts";

// Registration -- working!
export async function registerUser(data: {
  // firstName: string;
  // lastName: string;
  // username: string;
  email: string;
  password: string;
}) {
  // hash the password before sending
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
}

// Find User via Email
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
