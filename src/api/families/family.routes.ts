import { Router } from "express";
import { authenticate } from "../../middleware/authMiddleware.ts";
import { prisma } from "../../../lib/prisma.ts";

import {
  searchFamiliesByName,
  createFamily,
  generateFamilyCode,
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
    await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
    });

    return res.json({
      message: "Family created successfully",
      family,
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
      res.status(404).json({ error: "Invalid family code" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
    });

    return res.json({ message: "Joined family successfully!", family });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Joining family failed" });
  }
});

export default router;
