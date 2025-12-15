import { prisma } from "../../../lib/prisma.ts";

// GET family recipes
export async function getRecipesByFamilyId(familyId: number) {
  return prisma.recipe.findMany({
    where: {
      familyId,
      status: {
        in: ["DRAFT", "PUBLISHED"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// CREATE DRAFT recipe
export async function createRecipe(data: {
  title: string;
  familyId: number;
  createdById: number;
}) {
  return prisma.recipe.create({
    data,
  });
}

// CREATE Recipe Step
export async function createRecipeStep(data: {
  recipeId: number;
  stepNumber: number;
  instruction: string;
}) {
  return prisma.recipeStep.create({
    data,
  });
}

// PUBLISH recipe
export async function publishRecipe(recipeId: number) {
  return prisma.recipe.update({
    where: { id: recipeId },
    data: {
      status: "PUBLISHED",
    },
  });
}

// GET recipe by its id
export async function getRecipeById(recipeId: number) {
  return prisma.recipe.findUnique({
    where: { id: recipeId },
  });
}
