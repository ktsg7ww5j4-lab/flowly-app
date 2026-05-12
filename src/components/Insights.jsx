import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setInsights } from "../store/userSlice.js";
import { fetchRecommendations, fakeArticles } from "../services/api.js";
import { getCycleDay, getPhase } from "../lib/cycle.js";

export default function Insights() {
  const dispatch = useDispatch();
  const cycle = useSelector((s) => s.user.cycle);
  const mood = useSelector((s) => s.user.mood);
  const symptoms = useSelector((s) => s.user.symptoms);
  const tips = useSelector((s) => s.user.insights);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const day = getCycleDay(cycle.lastPeriodStart, cycle.lengthDays);
    const phase = getPhase(day, cycle.lengthDays);
    try {
      const { tips: next } = await fetchRecommendations({
        phase,
        mood: mood.mood,
        energy: mood.energy,
        stress: mood.stress,
        symptoms,
      });
      dispatch(setInsights(next));
    } catch {
      dispatch(
        setInsights([
          {
            title: "Офлайн",
            body: "Запустите бэкенд (`npm run dev`) или проверьте сеть — советы приходят с /api/recommendations.",
            tag: "система",
          },
        ])
      );
    } finally {
      setLoading(false);
    }
  }, [cycle.lastPeriodStart, cycle.lengthDays, mood.mood, mood.energy, mood.stress, symptoms, dispatch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Рекомендации</h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => void refresh()}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-flow-plum shadow-sm ring-1 ring-slate-200 disabled:opacity-50"
          >
            {loading ? "…" : "Обновить"}
          </button>
          <Link to="/cycle" className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
            К циклу
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {loading && tips.length === 0 && (
          <p className="rounded-2xl bg-white/60 px-4 py-6 text-center text-sm text-slate-600">
            Загружаем рекомендации…
          </p>
        )}
        {!loading && tips.length === 0 && (
          <p className="rounded-2xl bg-white/60 px-4 py-6 text-center text-sm text-slate-600">
            Нет данных — нажмите «Обновить».
          </p>
        )}
        {tips.map((tip, i) => (
          <article
            key={`${tip.title}-${i}`}
            className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">{tip.title}</h3>
              <span className="shrink-0 rounded-full bg-flow-mint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                {tip.tag}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{tip.body}</p>
          </article>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">Материалы</h3>
        <ul className="mt-2 space-y-2">
          {fakeArticles.map((a) => (
            <li
              key={a.id}
              className="rounded-xl bg-white/60 px-4 py-3 text-sm text-slate-700 backdrop-blur"
            >
              <span className="font-medium text-slate-900">{a.title}</span>
              <span className="block text-slate-600">{a.excerpt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
