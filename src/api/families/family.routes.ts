import { Router } from "express";
import { authenticate } from "../../middleware/authMiddleware.ts";
import { prisma } from "../../../lib/prisma.ts";

import {
  searchFamiliesByName,
  createFamily,
  generateFamilyCode,
  findPublicFamilyBySlug,
  findPrivateFamilyBySlug,
} from "./family.service.ts";

const router = Router();

// --> api/families/search
router.get("/search", async (req, res) => {
  const { name } = req.query;

  try {
    const families = await searchFamiliesByName(String(name));
    return res.json(families);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Family search failed." });
  }
});

// --> api/families/create
router.post("/create", authenticate, async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;

  try {
    const code = generateFamilyCode();
    const family = await createFamily(name, code);

    // add user creating family to family
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        familyId: true,
      },
    });

    return res.json({
      message: "Family created successfully",
      family,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Family creation failed" });
  }
});

// --> api/families/join
router.post("/join", authenticate, async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  try {
    const family = await prisma.family.findUnique({
      where: { code },
    });

    if (!family) {
      return res.status(404).json({ error: "Invalid family code" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        familyId: true,
      },
    });

    return res.json({
      message: "Joined family successfully!",
      user: updatedUser,
      family,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Joining family failed" });
  }
});

// --> api/families/:slug
router.get("/:slug", authenticate, async (req, res) => {
  const { slug } = req.params;

  try {
    const family = await findPrivateFamilyBySlug(slug);

    if (family.id !== req.user.family?.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this family" });
    }

    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }

    return res.json({ family });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error fetching family" });
  }
});

router.get("/:slug/public", async (req, res) => {
  const { slug } = req.params;

  try {
    const family = await findPublicFamilyBySlug(slug);

    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }

    return res.json({ family });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error fetching public family" });
  }
});

export default router;
