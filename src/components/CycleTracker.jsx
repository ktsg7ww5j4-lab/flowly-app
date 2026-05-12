import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setCycle } from "../store/userSlice.js";
import { getCycleDay, getPhase, phaseLabel, phaseGradient } from "../lib/cycle.js";

function addDays(isoDate, delta) {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function CycleTracker({ telegram }) {
  const dispatch = useDispatch();
  const cycle = useSelector((s) => s.user.cycle);
  const [offset, setOffset] = useState(0);

  const previewStart = useMemo(
    () => addDays(cycle.lastPeriodStart, offset),
    [cycle.lastPeriodStart, offset]
  );
  const day = useMemo(
    () => getCycleDay(previewStart, cycle.lengthDays),
    [previewStart, cycle.lengthDays]
  );
  const phase = useMemo(() => getPhase(day, cycle.lengthDays), [day, cycle.lengthDays]);

  const week = useMemo(() => {
    const ruDow = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const start = new Date();
    start.setDate(start.getDate() - 3);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const isSel = iso === new Date().toISOString().slice(0, 10);
      const dNum = getCycleDay(iso, cycle.lengthDays);
      const ph = getPhase(dNum, cycle.lengthDays);
      return { iso, dow: ruDow[d.getDay()], isSel, ph };
    });
  }, [cycle.lengthDays]);

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Календарь цикла</h2>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
            {cycle.lengthDays} дн.
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Смахивание по дням — предпросмотр; «Сохранить старт» фиксирует первый день последних
          месячных.
        </p>

        <label className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-700">
          <span>Длина цикла (дней)</span>
          <input
            type="number"
            min={21}
            max={45}
            value={cycle.lengthDays}
            onChange={(e) =>
              dispatch(setCycle({ lengthDays: Math.min(45, Math.max(21, Number(e.target.value) || 28)) }))
            }
            className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-right font-semibold outline-none focus:ring-2 focus:ring-flow-plum/30"
          />
        </label>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm active:scale-95 transition"
            onClick={() => setOffset((o) => o - 1)}
          >
            ← День
          </button>
          <div
            className={`flex-1 rounded-2xl bg-gradient-to-br px-4 py-4 text-center ${phaseGradient(phase)}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-700">Просмотр</p>
            <p className="text-lg font-semibold text-slate-900">{previewStart}</p>
            <p className="text-sm text-slate-800">
              День {day} · {phaseLabel(phase)}
            </p>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm active:scale-95 transition"
            onClick={() => setOffset((o) => o + 1)}
          >
            День →
          </button>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-flow-plum shadow-sm"
          onClick={() => {
            dispatch(setCycle({ lastPeriodStart: previewStart }));
            setOffset(0);
          }}
        >
          Сохранить как старт цикла
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {week.map((cell) => (
          <div
            key={cell.iso}
            className={`flex flex-col items-center rounded-2xl py-3 text-xs ${
              cell.isSel ? "bg-white shadow-md ring-2 ring-flow-plum/30" : "bg-white/50"
            }`}
          >
            <span className="text-slate-500">{cell.dow}</span>
            <span className="mt-1 text-sm font-semibold text-slate-900">
              {cell.iso.slice(8, 10)}
            </span>
            <span
              className={`mt-2 h-2 w-2 rounded-full ${
                cell.ph === "menstrual"
                  ? "bg-rose-500"
                  : cell.ph === "follicular"
                    ? "bg-emerald-500"
                    : cell.ph === "ovulation"
                      ? "bg-violet-500"
                      : "bg-indigo-400"
              }`}
              title={phaseLabel(cell.ph)}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/mood"
          className="rounded-2xl bg-white/80 px-5 py-4 text-center font-semibold text-slate-800 shadow-sm backdrop-blur active:scale-[0.99] transition"
        >
          Настроение и энергия
        </Link>
        <Link
          to="/symptoms"
          className="rounded-2xl bg-white/80 px-5 py-4 text-center font-semibold text-slate-800 shadow-sm backdrop-blur active:scale-[0.99] transition"
        >
          Симптомы
        </Link>
        <Link
          to="/insights"
          className="rounded-2xl bg-gradient-to-r from-flow-plum to-flow-violet px-5 py-4 text-center font-semibold text-white shadow-md sm:col-span-2"
        >
          Рекомендации
        </Link>
        <Link
          to="/settings"
          className="rounded-2xl border border-white/60 bg-white/40 px-5 py-3 text-center text-sm font-medium text-slate-700 sm:col-span-2"
        >
          Настройки и приватность
        </Link>
      </div>

      <TelegramSendDemo telegram={telegram} />
    </section>
  );
}

function TelegramSendDemo({ telegram }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 p-4 text-sm text-slate-600">
      <p className="font-medium text-slate-800">Отправка в чат (имитация)</p>
      <p className="mt-1">
        В реальном боте данные уходят через{" "}
        <code className="rounded bg-slate-100 px-1">sendData</code> к боту.
      </p>
      <button
        type="button"
        className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        onClick={() => {
          const payload = JSON.stringify({ type: "cycle_ping", at: Date.now() });
          try {
            telegram?.sendData?.(payload);
          } catch {
            /* dev outside Telegram */
          }
          alert("sendData вызван (вне Telegram просто уведомление).");
        }}
      >
        Отправить тест в чат
      </button>
    </div>
  );
}
