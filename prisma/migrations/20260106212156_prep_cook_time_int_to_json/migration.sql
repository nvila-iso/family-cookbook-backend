/*
  Warnings:

  - The `prepTime` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cookTime` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "prepTime",
ADD COLUMN     "prepTime" JSONB,
DROP COLUMN "cookTime",
ADD COLUMN     "cookTime" JSONB;
