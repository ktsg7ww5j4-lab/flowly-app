import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setMood } from "../store/userSlice.js";

function Slider({ label, value, onChange, low, high }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <span className="text-lg font-semibold text-flow-plum">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-flow-plum"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

export default function MoodTracker({ telegram }) {
  const dispatch = useDispatch();
  const mood = useSelector((s) => s.user.mood);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Настроение</h2>
        <Link to="/cycle" className="text-sm font-medium text-flow-plum">
          К циклу
        </Link>
      </div>
      <p className="text-sm text-slate-600">
        Оценки сохраняются в Redux и учитываются в рекомендациях на экране Insights.
      </p>

      <Slider
        label="Настроение"
        low="Тяжело"
        high="Светло"
        value={mood.mood}
        onChange={(v) => dispatch(setMood({ mood: v }))}
      />
      <Slider
        label="Энергия"
        low="Низкая"
        high="Высокая"
        value={mood.energy}
        onChange={(v) => dispatch(setMood({ energy: v }))}
      />
      <Slider
        label="Стресс"
        low="Спокойно"
        high="Сильно"
        value={mood.stress}
        onChange={(v) => dispatch(setMood({ stress: v }))}
      />

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
        <label className="text-sm font-medium text-slate-800">Заметка</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-flow-plum/30"
          rows={3}
          placeholder="Что помогло сегодня?"
          value={mood.note}
          onChange={(e) => dispatch(setMood({ note: e.target.value }))}
        />
      </div>

      <button
        type="button"
        className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white"
        onClick={() => {
          const payload = JSON.stringify({ type: "mood", ...mood });
          try {
            telegram?.sendData?.(payload);
          } catch {
            /* noop */
          }
          alert("Данные настроения подготовлены к отправке боту (имитация).");
        }}
      >
        Поделиться с ботом
      </button>
    </section>
  );
}
