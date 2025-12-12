import express from "express";
import cors from "cors";
import { prisma } from "../lib/prisma.js";

// ROUTES
import userRoutes from "./api/users/user.routes.js";
import familyRoutes from "./api/families/family.routes.js";
import recipesRoute from "./api/recipes/recipe.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

// testing...
app.get("/", (req, res) => {
  res.json({ message: "Family Cookbook API is up and running!" });
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users list" });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/families", familyRoutes);
app.use("/api/recipes", recipesRoute);

// Server Startup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
