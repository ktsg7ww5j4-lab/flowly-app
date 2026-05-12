export function getCycleDay(lastPeriodStartIso, lengthDays = 28) {
  const start = new Date(lastPeriodStartIso + "T12:00:00");
  const now = new Date();
  const diff = Math.floor((now - start) / 86400000);
  if (diff < 0) return 1;
  const mod = diff % lengthDays;
  return mod + 1;
}

export function getPhase(dayInCycle, lengthDays = 28) {
  const mEnd = Math.max(3, Math.round(lengthDays * 0.18));
  const ov = Math.round(lengthDays * 0.5);
  if (dayInCycle <= mEnd) return "menstrual";
  if (dayInCycle < ov - 1) return "follicular";
  if (dayInCycle <= ov + 1) return "ovulation";
  return "luteal";
}

export function phaseLabel(phase) {
  const map = {
    menstrual: "Менструация",
    follicular: "Фолликулярная",
    ovulation: "Овуляция",
    luteal: "Лютеиновая",
  };
  return map[phase] || phase;
}

export function phaseGradient(phase) {
  const map = {
    menstrual: "from-rose-300 via-pink-200 to-rose-100",
    follicular: "from-emerald-200 via-teal-100 to-cyan-100",
    ovulation: "from-violet-300 via-fuchsia-200 to-pink-100",
    luteal: "from-indigo-200 via-purple-100 to-flow-rose",
  };
  return map[phase] || "from-flow-rose to-flow-mint";
}
