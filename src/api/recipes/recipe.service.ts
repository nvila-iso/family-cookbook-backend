import { prisma } from "../../../lib/prisma.ts";

// GET family recipes
export async function getRecipesByFamilyId(familyId: number) {
  return prisma.recipe.findMany({
    where: {
      familyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// CREATE family recipe
export async function createRecipe(data: {
  title: string;
  familyId: number;
  createdById: number;
}) {
  return prisma.recipe.create({
    data,
  });
}
