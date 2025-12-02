import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.ts";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// testing...
app.get("/", (req, res) => {
  res.json({ message: "Family Cookbook API is up and running!" });
});

app.get("/api/users/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Server Startup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
