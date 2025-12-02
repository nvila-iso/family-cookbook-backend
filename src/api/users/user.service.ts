import { prisma } from "../../../lib/prisma.ts";

// Registration -- working!
export async function registerUser(data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) {
  return await prisma.user.create({
    data,
  });
}

// Login -- status?
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
