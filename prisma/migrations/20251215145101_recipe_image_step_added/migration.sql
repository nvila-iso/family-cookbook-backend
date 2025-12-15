/*
  Warnings:

  - You are about to drop the column `url` on the `RecipeImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stepId]` on the table `RecipeImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `RecipeImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `RecipeImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipeImageType" AS ENUM ('FEATURED', 'STEP');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "servings" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RecipeImage" DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "position" INTEGER,
ADD COLUMN     "stepId" INTEGER,
ADD COLUMN     "type" "RecipeImageType" NOT NULL;

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_recipeId_stepNumber_key" ON "RecipeStep"("recipeId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeImage_stepId_key" ON "RecipeImage"("stepId");

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
