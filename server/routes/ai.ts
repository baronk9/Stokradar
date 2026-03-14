import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/analyze", requireAuth, async (req: any, res: any) => {
  const { ticker, lang = "en" } = req.body;
  if (!ticker) return res.status(400).json({ error: "Ticker required" });

  try {
    // Check quota for free users
    const sub = db.prepare("SELECT plan FROM subscriptions WHERE userId = ?").get(req.user.id) as any;
    const plan = sub ? sub.plan : "free";
    const today = new Date().toISOString().split("T")[0];

    if (plan === "free") {
      let usage = db.prepare("SELECT aiAnalysesCount FROM usage_counters WHERE userId = ? AND date = ?").get(req.user.id, today) as any;
      if (!usage) {
        db.prepare("INSERT INTO usage_counters (userId, date, aiAnalysesCount) VALUES (?, ?, 0)").run(req.user.id, today);
        usage = { aiAnalysesCount: 0 };
      }
      if (usage.aiAnalysesCount >= 3) {
        return res.status(403).json({ error: "Free plan limit reached (3 analyses/day)" });
      }
      // Increment usage
      db.prepare("UPDATE usage_counters SET aiAnalysesCount = aiAnalysesCount + 1 WHERE userId = ? AND date = ?").run(req.user.id, today);
    }

    // Call Gemini
    const prompt = `Analyze the US stock ticker ${ticker}. Provide a structured analysis in ${lang === 'ar' ? 'Arabic' : 'English'}.
    Include:
    - Rating (BUY, HOLD, SELL)
    - Conviction score (0-10)
    - Upside percentage (e.g. 15%)
    - 3 Strengths (bullets)
    - 3 Risks (bullets)
    - A short analyst note
    - Target price
    - Stop loss price
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.STRING, enum: ["BUY", "HOLD", "SELL"] },
            convictionScore: { type: Type.NUMBER },
            upsidePercent: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            analystNote: { type: Type.STRING },
            targetPrice: { type: Type.NUMBER },
            stopLoss: { type: Type.NUMBER }
          },
          required: ["rating", "convictionScore", "upsidePercent", "strengths", "risks", "analystNote", "targetPrice", "stopLoss"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

export default router;
