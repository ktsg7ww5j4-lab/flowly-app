import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getCycleDay, getPhase, phaseGradient, phaseLabel } from "../lib/cycle.js";

export default function Header({ telegram, compact }) {
  const cycle = useSelector((s) => s.user.cycle);
  const firstName = useSelector((s) => s.user.telegramUser?.first_name);

  const day = useMemo(
    () => getCycleDay(cycle.lastPeriodStart, cycle.lengthDays),
    [cycle.lastPeriodStart, cycle.lengthDays]
  );
  const phase = useMemo(() => getPhase(day, cycle.lengthDays), [day, cycle.lengthDays]);
  const gradient = phaseGradient(phase);

  return (
    <header
      className={`rounded-3xl bg-gradient-to-r p-[1px] shadow-sm ${compact ? "max-w-md mx-auto" : ""}`}
    >
      <div
        className={`rounded-[22px] bg-gradient-to-br ${gradient} px-5 py-4 ${
          compact ? "py-5" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-700/80">
              Сегодня в цикле
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              День {day}
              <span className="ml-2 text-base font-normal text-slate-700">
                · {phaseLabel(phase)}
              </span>
            </p>
            {!compact && firstName && (
              <p className="mt-2 text-sm text-slate-700">Привет, {firstName}</p>
            )}
          </div>
          {telegram?.initDataUnsafe?.user?.photo_url && (
            <img
              src={telegram.initDataUnsafe.user.photo_url}
              alt=""
              className="h-12 w-12 rounded-2xl border border-white/60 object-cover shadow-sm"
            />
          )}
        </div>
      </div>
    </header>
  );
}
