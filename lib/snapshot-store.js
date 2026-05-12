/**
 * Снимки для «облака»: локально — файл в server/, на Vercel — /tmp (ограничение serverless).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function storeFile() {
  if (process.env.VERCEL) {
    return "/tmp/flowly-snapshots.json";
  }
  return path.join(__dirname, "..", "server", "snapshots.json");
}

export function loadSnapshots() {
  try {
    const raw = fs.readFileSync(storeFile(), "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function appendSnapshot(telegramUserId, payload) {
  const row = {
    id: Date.now(),
    telegram_user_id: String(telegramUserId),
    payload: JSON.stringify(payload),
    created_at: new Date().toISOString(),
  };
  const all = loadSnapshots();
  all.push(row);
  fs.writeFileSync(storeFile(), JSON.stringify(all, null, 0), "utf8");
}

export function latestPayload(telegramUserId) {
  const id = String(telegramUserId);
  const all = loadSnapshots();
  for (let i = all.length - 1; i >= 0; i--) {
    if (all[i].telegram_user_id === id) {
      try {
        return JSON.parse(all[i].payload);
      } catch {
        return null;
      }
    }
  }
  return null;
}
