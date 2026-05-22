  import express from "express";
import path from "path";
import https from "https";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();

  app.use(express.json());

  app.post("/api/analyze", async (req, res) => {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        code: "ERR_API_KEY_MISSING",
        error: "GEMINI_API_KEY is not set on the server."
      });
    }

    try {
      const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const models = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
      ];
      const errorsList: { model: string; code: string; message: string }[] = [];

      for (const modelName of models) {
        try {
          const result = await client.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });
          
          const candidate = result.candidates?.[0];
          if (candidate?.finishReason === "SAFETY" || candidate?.finishReason === "BLOCKLIST") {
            errorsList.push({ model: modelName, code: "ERR_SAFETY_BLOCKED", message: "安全基準に抵触しました。" });
            continue;
          }

          let text = result.text || "";
          text = text.replace(/```json|```/g, "").trim();
          
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(text);
          } catch (parseErr: any) {
            errorsList.push({ model: modelName, code: "ERR_JSON_PARSE_FAILED", message: parseErr.message });
            continue;
          }
          return res.json(jsonResponse);
        } catch (error: any) {
          const errMsg = error.message || "Unknown error";
          let errCode = "ERR_MODEL_CALL_FAILED";
          if (errMsg.includes("quota") || errMsg.includes("429") || error.status === 429) errCode = "ERR_QUOTA_EXCEEDED";
          errorsList.push({ model: modelName, code: errCode, message: errMsg });
          continue;
        }
      }

      res.status(500).json({
        code: "ERR_MODELS_EXHAUSTED",
        error: "サーバーエラーが発生しました。再度お試しください。",
      });
    } catch (outerError: any) {
      res.status(500).json({
        code: "ERR_CONNECTION_FAILED",
        error: "API接続エラーが発生しました。",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.get('/sitemap.xml', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'sitemap.xml'));
    });
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // HTTP→HTTPSリダイレクト
  const httpApp = express();
  httpApp.use((req, res) => {
    res.redirect(301, `https://enjochecker.pgw.jp${req.url}`);
  });
  httpApp.listen(80, "0.0.0.0", () => {
    console.log("HTTP redirect server running on port 80");
  });

  // HTTPSサーバー
  const sslOptions = {
    key: fs.readFileSync("/home/ubuntu/enjochecker/privkey.pem"),
    cert: fs.readFileSync("/home/ubuntu/enjochecker/fullchain.pem"),
  };

  https.createServer(sslOptions, app).listen(443, "0.0.0.0", () => {
    console.log("HTTPS server running on port 443");
  });
}

startServer();
