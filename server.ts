import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Analysis
  app.post("/api/analyze", async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
    }

    try {
      const client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      // Use correct and supported models
      const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let lastError = "";

      for (const modelName of models) {
        try {
          const result = await client.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });
          
          let text = result.text || "";
          
          // Clean up JSON response from Gemini
          text = text.replace(/```json|```/g, "").trim();
          
          const jsonResponse = JSON.parse(text);
          return res.json(jsonResponse);
        } catch (error: any) {
          lastError = error.message || "Unknown error";
          console.warn(`Model ${modelName} failed: ${lastError}`);
          // Continue to next model if error
          continue;
        }
      }

      res.status(500).json({ error: "現在、サーバーが大変混雑しているか、一時的なシステムエラーが発生しました。お手数ですが、もう一度「診断する」ボタンを押してください。" });
    } catch (outerError: any) {
      console.error("Gemini API Error:", outerError);
      res.status(500).json({ error: "API接続エラーが発生しました。しばらく待ってから再度お試しください。" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
