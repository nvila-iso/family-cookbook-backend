import { Router } from "express";
import {
  authenticate,
  requireFamily,
  authenticateOptional,
} from "../../middleware/authMiddleware.ts";

import {
  createRecipe,
  getRecipesByFamilyId,
  publishRecipe,
  getRecipeById,
  createRecipeStep,
} from "./recipe.service.js";

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

// GET recipe by id w/ steps
router.get("/:id", authenticateOptional, async (req, res) => {
  const recipeId = Number(req.params.id);

  if (Number.isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // public view
    if (recipe.visibility === "PUBLIC") {
      return res.json(recipe);
    }

    // private view
    if (!req.user || !req.user.family) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (recipe.familyId !== req.user.family.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this recipe" });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// CREATE DRAFT recipe
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

// CREATE Recipe Step
router.post("/:id/steps", authenticate, requireFamily, async (req, res) => {
  const recipeId = Number(req.params.id);
  const { stepNumber, instruction } = req.body;

  console.log("JWT payload:", req.user);

  if (Number.isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }

  if (typeof stepNumber !== "number" || !instruction) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    if (recipe.familyId !== req.user.family.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this recipe" });
    }

    const step = await createRecipeStep({
      recipeId,
      stepNumber,
      instruction,
    });

    res.status(201).json(step);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe step" });
  }
});

// PUBLISH recipe
router.post("/:id/publish", authenticate, requireFamily, async (req, res) => {
  const recipeId = Number(req.params.id);

  if (Number.isNaN(recipeId)) {
    return res.status(400).json({ error: "Invalid recipe id" });
  }

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    if (recipe.familyId !== req.user.family.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to publish this recipe" });
    }

    if (recipe.status === "PUBLISHED") {
      return res.status(409).json({
        error: "Recipe is already published",
      });
    }

    const publishedRecipe = await publishRecipe(recipeId);
    res.json(publishedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to publish recipe" });
  }
});

export default router;
