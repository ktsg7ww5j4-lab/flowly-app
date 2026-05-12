import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSymptoms } from "../store/userSlice.js";

const OPTIONS = {
  pms: ["Раздражительность", "Отёки", "Головная боль", "Тяга к сладкому", "Боль в груди"],
  pcos: ["Нерегулярный цикл", "Акне", "Лишний вес", "Волосатость", "Сонливость"],
  endo: ["Тазовая боль", "Боль при менструации", "Боль при интимности", "Тошнота", "Усталость"],
};

function ToggleGroup({ title, field, selected, onToggle }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS[field].map((label) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => onToggle(field, label)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-flow-plum text-white shadow-sm"
                  : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SymptomTracker({ telegram }) {
  const dispatch = useDispatch();
  const symptoms = useSelector((s) => s.user.symptoms);

  const toggle = (field, label) => {
    const list = symptoms[field];
    const next = list.includes(label) ? list.filter((x) => x !== label) : [...list, label];
    dispatch(setSymptoms({ [field]: next }));
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Симптомы</h2>
        <Link to="/cycle" className="text-sm font-medium text-flow-plum">
          К циклу
        </Link>
      </div>
      <p className="text-sm text-slate-600">
        Отметьте то, что актуально. Данные хранятся локально; отправка врачу — демонстрация.
      </p>

      <ToggleGroup title="ПМС" field="pms" selected={symptoms.pms} onToggle={toggle} />
      <ToggleGroup title="СПКЯ" field="pcos" selected={symptoms.pcos} onToggle={toggle} />
      <ToggleGroup title="Эндометриоз" field="endo" selected={symptoms.endo} onToggle={toggle} />

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
        <label className="text-sm font-medium text-slate-800">Комментарий для врача</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-flow-plum/30"
          rows={3}
          value={symptoms.note}
          onChange={(e) => dispatch(setSymptoms({ note: e.target.value }))}
        />
      </div>

      <button
        type="button"
        className="w-full rounded-2xl bg-gradient-to-r from-flow-plum to-flow-violet py-3 text-sm font-semibold text-white shadow-md"
        onClick={() => {
          const payload = JSON.stringify({ type: "symptoms_for_doctor", symptoms });
          try {
            telegram?.sendData?.(payload);
          } catch {
            /* noop */
          }
          alert("Сводка симптомов «отправлена» в чат (имитация отправки врачу).");
        }}
      >
        Отправить врачу (имитация)
      </button>
    </section>
  );
}
