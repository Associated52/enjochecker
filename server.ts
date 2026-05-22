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
      // ユーザー指定の順序: 2.5-flash-lite -> 2.5-flash -> 1.5-flash -> 3.5-flash
      const models = [
          "gemini-2.0-flash",
          "gemini-2.0-flash-lite",
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
            const errCode = "ERR_SAFETY_BLOCKED";
            const errText = "入力された内容がポリシー（安全基準）に抵触したため、AIによる分析を中断しました。不適切な表現が含まれていないかご確認ください。";
            errorsList.push({ model: modelName, code: errCode, message: errText });
            console.warn(`Model ${modelName} blocked by safety policy.`);
            continue;
          }

          let text = result.text || "";
          
          // Clean up JSON response from Gemini
          text = text.replace(/```json|```/g, "").trim();
          
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(text);
          } catch (parseErr: any) {
            console.error(`Result from model ${modelName} parsing error:`, text);
            errorsList.push({
              model: modelName,
              code: "ERR_JSON_PARSE_FAILED",
              message: `AIからの出力解析(JSON)に失敗しました。 (${parseErr.message})`
            });
            continue;
          }
          return res.json(jsonResponse);
        } catch (error: any) {
          const errMsg = error.message || "Unknown error";
          let errCode = "ERR_MODEL_CALL_FAILED";
          let errText = "モデルの呼び出しに失敗しました。";

          if (errMsg.includes("quota") || errMsg.includes("429") || error.status === 429) {
            errCode = "ERR_QUOTA_EXCEEDED";
            errText = "リクエスト制限（クオータ上限）に達しました。しばらく時間をおいてから再度お試しください。";
          } else if (errMsg.includes("safety") || errMsg.includes("block") || errMsg.includes("policy")) {
            errCode = "ERR_SAFETY_BLOCKED";
            errText = "入力された内容がポリシー（安全基準）に抵触したため、AIによる分析を中断しました。不適切な表現が含まれていないかご確認ください。";
          } else if (errMsg.includes("not found") || errMsg.includes("404") || error.status === 404) {
            errCode = "ERR_MODEL_NOT_FOUND";
            errText = "指定されたモデルが見つからないか、お使いのAPIキーではサポートされていません。";
          } else if (errMsg.includes("API key not valid") || errMsg.includes("401") || errMsg.includes("403") || error.status === 401 || error.status === 403) {
            errCode = "ERR_AUTH_FAILED";
            errText = "APIキーが無効であるか、アクセス権限がありません。";
          } else if (errMsg.includes("500") || errMsg.includes("503") || error.status === 500 || error.status === 503 || errMsg.includes("unavailable") || errMsg.includes("temporary")) {
            errCode = "ERR_GEMINI_SERVER_ERROR";
            errText = "Geminiサーバー側で一時的なエラーが発生しました。";
          } else if (errMsg.includes("400") || error.status === 400 || errMsg.includes("invalid")) {
            errCode = "ERR_BAD_REQUEST";
            errText = "リクエストの形式が正しくないか、無効なパラメータが含まれています。";
          }

          console.warn(`Model ${modelName} failed with ${errCode}: ${errMsg}`);
          errorsList.push({
            model: modelName,
            code: errCode,
            message: `${errText} (${errMsg})`
          });
          continue;
        }
      }

      // 全てのモデルのフォールバックに失敗した場合
      const summaryDetails = errorsList.map(e => `[${e.model}: ${e.code}] ${e.message}`).join("\n");
      res.status(500).json({
        code: "ERR_MODELS_EXHAUSTED",
        error: "現在、サーバーが大変混雑しているか、一時的なシステムエラーが発生しました。お手数ですが、もう一度「診断する」ボタンを押してください。",
        details: summaryDetails,
        innerCode: errorsList[errorsList.length - 1]?.code || "ERR_UNKNOWN_FAILURE"
      });
    } catch (outerError: any) {
      console.error("Gemini API Error:", outerError);
      res.status(500).json({
        code: "ERR_CONNECTION_FAILED",
        error: "API接続エラーが発生しました。しばらく待ってから再度お試しください。",
        details: outerError.message || "Unknown inner error"
      });
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
