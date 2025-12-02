import { Router } from "express";
import { findUserByEmail, registerUser } from "./user.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful:", user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
