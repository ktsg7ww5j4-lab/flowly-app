import { latestPayload } from "../../lib/snapshot-store.js";

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query?.telegramUserId;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid telegramUserId" });
  }
  const payload = latestPayload(id);
  return res.status(200).json({ payload });
}
