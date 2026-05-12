import { buildRecommendations } from "../lib/flowly-recommendations.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { phase, mood, energy, stress, symptoms } = body;
  const tips = buildRecommendations({ phase, mood, energy, stress, symptoms });
  return res.status(200).json({ tips, generatedAt: new Date().toISOString() });
}
