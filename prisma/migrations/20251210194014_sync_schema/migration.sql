-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_familyId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeImage" DROP CONSTRAINT "RecipeImage_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "createdById" DROP NOT NULL,
ALTER COLUMN "familyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
