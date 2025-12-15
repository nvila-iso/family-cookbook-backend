-- CreateEnum
CREATE TYPE "RecipeVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "visiblity" "RecipeVisibility" NOT NULL DEFAULT 'PRIVATE';
