import { Router } from "express";
import {
  authenticate,
  requireFamily,
} from "../../middleware/authMiddleware.ts";

import { createRecipe, getRecipesByFamilyId } from "./recipe.service.js";

const router = Router();

// GET recipes from a family
router.get("/family/:familyId", authenticate, async (req, res) => {
  const familyId = Number(req.params.familyId);

  if (Number.isNaN(familyId)) {
    return res.status(400).json({ error: "Invalid family id" });
  }

  try {
    const recipes = await getRecipesByFamilyId(familyId);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// CREATE family recipes
router.post("/", authenticate, requireFamily, async (req, res) => {
  const { title } = req.body;
  const familyId = req.user.family.id;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const recipe = await createRecipe({
      title,
      familyId: Number(familyId),
      createdById: userId,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

export default router;
