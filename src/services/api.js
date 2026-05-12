/**
 * Клиент к бэкенду: рекомендации и опциональная синхронизация в SQLite.
 */

export async function fetchRecommendations(payload) {
  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("recommendations_failed");
  return res.json();
}

export async function syncToServer(telegramUserId, payload) {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramUserId, payload }),
  });
  if (!res.ok) throw new Error("sync_failed");
  return res.json();
}

export async function fetchServerSnapshot(telegramUserId) {
  const res = await fetch(`/api/sync/${encodeURIComponent(telegramUserId)}`);
  if (!res.ok) throw new Error("sync_fetch_failed");
  return res.json();
}

/** Локальные «статьи» и заглушки без сети */
export const fakeArticles = [
  {
    id: "a1",
    title: "Дыхание для второй фазы",
    excerpt: "Короткие сессии 4-7-8 помогают снизить тревожность перед сном.",
  },
  {
    id: "a2",
    title: "Дневник цикла",
    excerpt: "Заметки о симптомах экономят время на приёме у гинеколога.",
  },
  {
    id: "a3",
    title: "Носимые устройства",
    excerpt: "Пульс и сон как контекст — не диагноз; обсуждайте тренды с врачом.",
  },
];
