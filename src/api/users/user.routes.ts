import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../../middleware/authMiddleware.ts";
import {
  findUserByEmail,
  registerUser,
  updateUserProfile,
} from "./user.service.ts";

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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Login Successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
});

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

    return res.json({
      message: "Profile updates",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Profile update failed" });
  }
});

export default router;
