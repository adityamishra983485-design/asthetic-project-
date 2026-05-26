import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of Gemini client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Initialized GoogleGenAI successfully.");
  } else {
    console.warn("GEMINI_API_KEY is not defined. AI features will fallback gracefully.");
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI:", err);
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Skincare Diagnostic Endpoint
app.post("/api/consultation", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "Our AI Skincare Advisor is temporarily offline because the GEMINI_API_KEY environment variable is not set. Please add your key in the Secrets menu to activate clinical consultation.",
    });
  }

  const { name, age, skinType, concerns, routine, sunExposure, goals, message } = req.body;

  const profileSummary = `
  - Client Name: ${name || "Valued Client"}
  - Age Group: ${age || "Not specified"}
  - Skin Type: ${skinType}
  - Concerns: ${Array.isArray(concerns) ? concerns.join(", ") : concerns || "General health"}
  - Current Routine: ${routine}
  - Sun Exposure: ${sunExposure}
  - Skincare Goals: ${Array.isArray(goals) ? goals.join(", ") : goals || "Radiance & Glow"}
  - Custom Query: ${message || "None"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft a high-end, elegant visual skin consultation roadmap based on the following patient profile:\n${profileSummary}`,
      config: {
        systemInstruction: `You are Dr. Evelyn Hope, Lead Medical Director and Senior Aesthetician of Hope Aesthetics Center. 
Your tone is scientific, luxurious, warm, supportive, and exceptionally professional.

Draft a highly customized skin summary roadmap in elegant Markdown. Avoid generic advice; refer directly to their specifics:
1. **Skin Profile Insights**: Give a professional, supportive scientific overview of their skin type and concern triggers. Emphasize cellular repair.
2. **Clinical Daily Routine**: Outline a minimal, ultra-premium steps schedule (Morning & Evening) using medical-grade descriptions (like "double cleanse", "hyaluronic lock with visual renewal serum", "broad spectrum defense").
3. **Recommended In-Clinic Therapies**: Detail exactly 1-2 clinic treatments from our elite selection (such as "Hope Signature HydraFacial MD", "Luminous RF Microneedling", "Clear & Brilliant Laser Laser Reveal", "Advanced Cell-Regen Chemical Peel") and state why it perfectly targets their concerns.
4. **Lifestyle Elixir Advice**: Give 2 practical habits (sleep, nutrient, hydration, or stress reduction) that synergize with topical treatments.

Respond with elegant spacing, bullet markers, and headers. Ensure reading length is concise (350-450 words) to feel exclusive and personal.`,
        temperature: 0.7,
      },
    });

    const analysis = response.text || "Unable to generate routine at this time.";
    res.json({ analysis });
  } catch (err: any) {
    console.error("Gemini Consultation API Error:", err);
    res.status(500).json({ error: err.message || "An error occurred with our AI Diagnostics." });
  }
});

// Integration of Vite Dev Server / Static Asset Serving
async function bootServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Serving application in development mode with Vite...");
    const vitePost = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vitePost.middlewares);
  } else {
    console.log("Serving application in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hope Aesthetics Center server running on http://localhost:${PORT}`);
  });
}

bootServer();
