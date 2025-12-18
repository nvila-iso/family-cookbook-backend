import { Router } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../../middleware/authMiddleware.ts";
import {
  findUserByEmail,
  registerUser,
  updateUserProfile,
  findUserById,
  deleteUserById,
} from "./user.service.ts";

import { avatarUpload } from "../../middleware/avatarUpload.js";

const router = Router();
// --> api/users/register
router.post("/register", async (req, res) => {
  // check if the email already exists
  // check if the username already exists
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
});

// --> api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password with hash
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, family: user.family ? { id: user.family.id } : null },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Login Successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        family: user.family,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
});

// !!! THIS NEEDS TO BE CHANGES TO SETTINGS !!!
// --> profile patching (not password)
router.patch("/:id/profile", authenticate, async (req, res) => {
  const requestedId = Number(req.params.id);
  const loggedInId = req.user.id;

  if (requestedId !== loggedInId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { firstName, lastName, username } = req.body;

  try {
    const updatedUser = await updateUserProfile(loggedInId, {
      firstName,
      lastName,
      username,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Profile update failed" });
  }
});

// !!! THIS NEEDS TO BE CHANGES TO SETTINGS !!!
// --> api/users/profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load user profile" });
  }
});

// --> DELETE api/users/:id
router.delete("/:id", authenticate, async (req, res) => {
  const requestedId = Number(req.params.id);
  const loggedInId = req.user.id;

  if (requestedId !== loggedInId) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const { id } = await deleteUserById(loggedInId);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

router.post(
  "/avatar",
  authenticate,
  avatarUpload.single("avatar"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await updateUserProfile(req.user.id, {
      avatarUrl,
    });

    res.json({ user: updatedUser });
  }
);

router.patch("/avatar", authenticate, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user?.avatarUrl) {
      return res.status(400).json({ error: "No avatar to delete" });
    }

    const filePath = path.join(process.cwd(), user.avatarUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const updatedUser = await updateUserProfile(req.user.id, {
      avatarUrl: null,
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Delete avatar failed:", error);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

export default router;
