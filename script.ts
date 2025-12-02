import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      firstName: "nick",
      lastName: "vila",
      username: "nvila88",
      password: hashedPassword,
      email: "nvila@email.com",
      family: "vila",
    },
  });
  console.log("Created user", user.username);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
