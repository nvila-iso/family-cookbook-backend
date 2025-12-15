/*
  Warnings:

  - You are about to drop the column `visiblity` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "visiblity",
ADD COLUMN     "visibility" "RecipeVisibility" NOT NULL DEFAULT 'PRIVATE';
