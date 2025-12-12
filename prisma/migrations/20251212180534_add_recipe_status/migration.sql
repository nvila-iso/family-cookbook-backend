-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "status" "RecipeStatus" NOT NULL DEFAULT 'DRAFT';
