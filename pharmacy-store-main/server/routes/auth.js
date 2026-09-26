import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, serializeUser } from "../models/User.js";

const router = Router();

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_SECRET must be set to a strong string (16+ chars)");
  }
  return s;
}

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ sub: String(user._id) }, getJwtSecret(), { expiresIn: "7d" });

    res.status(201).json({
      data: {
        user: serializeUser(user),
        token,
      },
    });
  } catch (err) {
    if (err.message?.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET" });
    }
    console.error(err);
    res.status(500).json({ message: "Could not create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ sub: String(user._id) }, getJwtSecret(), { expiresIn: "7d" });
    res.json({
      data: {
        user: serializeUser(user),
        token,
      },
    });
  } catch (err) {
    if (err.message?.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET" });
    }
    console.error(err);
    res.status(500).json({ message: "Sign-in failed" });
  }
});

export default router;
