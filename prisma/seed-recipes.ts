import { faker } from "@faker-js/faker";
import { prisma } from "../lib/prisma";

async function main() {

for (let i = 0; i < 3; i++) {
    await prisma.
}

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