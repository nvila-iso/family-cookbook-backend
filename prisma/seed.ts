import { faker } from "@faker-js/faker";
import { prisma } from "../lib/prisma";

async function main() {
  // user data
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: faker.internet.password({ length: 10 }),
        email: faker.internet.email(),
      },
    });
  }
  console.log("Users created 🤼");

  // recipe data

//   console.log("Food has been served 🌶️");
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
