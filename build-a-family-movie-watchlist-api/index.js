import express from "express";
import helmet from "helmet";
import jwt from 'jsonwebtoken';
import bcrypt from'bcryptjs';
import { findByUsername } from './utils/db.js';

import watchlistRoutes from "./routes/watchlist.js";

const PORT = process.env.PORT;
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.use("/api/watchlist", watchlistRoutes);

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ "error": "Username and password are required" })
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ "error": "Invalid credentials" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ "error": "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token: token });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
