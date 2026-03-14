import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import crypto from "crypto";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);
    
    db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, hash);
    db.prepare("INSERT INTO subscriptions (userId, plan) VALUES (?, ?)").run(id, "free");

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ user: { id, email, plan: "free" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const sub = db.prepare("SELECT plan FROM subscriptions WHERE userId = ?").get(user.id) as any;
    const plan = sub ? sub.plan : "free";

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ user: { id: user.id, email: user.email, plan } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare("SELECT id, email, locale FROM users WHERE id = ?").get(decoded.id) as any;
    if (!user) return res.status(401).json({ error: "User not found" });

    const sub = db.prepare("SELECT plan FROM subscriptions WHERE userId = ?").get(user.id) as any;
    const plan = sub ? sub.plan : "free";

    res.json({ user: { id: user.id, email: user.email, locale: user.locale, plan } });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
