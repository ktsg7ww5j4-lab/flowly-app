import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { buildRecommendations } from "../lib/flowly-recommendations.js";
import { appendSnapshot, latestPayload } from "../lib/snapshot-store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/recommendations", (req, res) => {
  const { phase, mood, energy, stress, symptoms } = req.body || {};
  const tips = buildRecommendations({ phase, mood, energy, stress, symptoms });
  res.json({ tips, generatedAt: new Date().toISOString() });
});

app.post("/api/sync", (req, res) => {
  const { telegramUserId, payload } = req.body || {};
  if (!telegramUserId || !payload) {
    return res.status(400).json({ error: "telegramUserId and payload required" });
  }
  appendSnapshot(telegramUserId, payload);
  res.json({ saved: true });
});

app.get("/api/sync/:telegramUserId", (req, res) => {
  const payload = latestPayload(req.params.telegramUserId);
  res.json({ payload });
});

const distDir = path.join(__dirname, "../dist");
const distIndex = path.join(distDir, "index.html");

if (fs.existsSync(distIndex)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(distIndex);
  });
}

app.listen(PORT, () => {
  console.log(`Flowly API on http://127.0.0.1:${PORT}`);
});
