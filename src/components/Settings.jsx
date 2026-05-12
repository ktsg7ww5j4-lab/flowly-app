import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setStorageMode,
  setWearablesConnected,
  setPrivacyLocalOnly,
  setLastSyncedAt,
} from "../store/userSlice.js";
import { syncToServer } from "../services/api.js";

export default function Settings({ telegram }) {
  const dispatch = useDispatch();
  const [syncing, setSyncing] = useState(false);
  const storageMode = useSelector((s) => s.user.storageMode);
  const wearables = useSelector((s) => s.user.wearablesConnected);
  const localOnly = useSelector((s) => s.user.privacyLocalOnly);
  const lastSync = useSelector((s) => s.user.lastSyncedAt);
  const telegramUser = useSelector((s) => s.user.telegramUser);
  const cycle = useSelector((s) => s.user.cycle);
  const mood = useSelector((s) => s.user.mood);
  const symptoms = useSelector((s) => s.user.symptoms);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Настройки</h2>
        <Link to="/cycle" className="text-sm font-medium text-flow-plum">
          К циклу
        </Link>
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
        <h3 className="text-sm font-semibold text-slate-900">Хранение данных</h3>
        <p className="mt-1 text-xs text-slate-600">
          Локально — в браузере. Облако — демо-запись снимка в файл на сервере.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              storageMode === "local"
                ? "bg-flow-plum text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
            onClick={() => dispatch(setStorageMode("local"))}
          >
            Локально
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              storageMode === "cloud"
                ? "bg-flow-plum text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
            onClick={() => dispatch(setStorageMode("cloud"))}
          >
            Облако (сервер)
          </button>
        </div>
        {storageMode === "cloud" && (
          <button
            type="button"
            disabled={syncing}
            className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white disabled:opacity-50"
            onClick={async () => {
              setSyncing(true);
              try {
                const id = String(telegramUser?.id ?? "dev-local");
                await syncToServer(id, { cycle, mood, symptoms });
                dispatch(setLastSyncedAt(new Date().toISOString()));
              } catch {
                alert("Не удалось синхронизировать — проверьте, что сервер запущен.");
              } finally {
                setSyncing(false);
              }
            }}
          >
            {syncing ? "Синхронизация…" : "Синхронизировать сейчас"}
          </button>
        )}
        {lastSync && storageMode === "cloud" && (
          <p className="mt-2 text-xs text-slate-500">Последняя синхронизация: {lastSync}</p>
        )}
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
        <h3 className="text-sm font-semibold text-slate-900">Приватность</h3>
        <label className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-700">
          <span>Не отправлять аналитику (локальный режим приватности)</span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-flow-plum"
            checked={localOnly}
            onChange={(e) => dispatch(setPrivacyLocalOnly(e.target.checked))}
          />
        </label>
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
        <h3 className="text-sm font-semibold text-slate-900">Носимые устройства</h3>
        <p className="mt-1 text-xs text-slate-600">
          MVP: имитация подключения Apple Health / Google Fit. Реальная интеграция требует OAuth и
          серверного моста.
        </p>
        <button
          type="button"
          className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold ${
            wearables ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          }`}
          onClick={() => dispatch(setWearablesConnected(!wearables))}
        >
          {wearables ? "Устройства «подключены»" : "Подключить (демо)"}
        </button>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/40 p-4 text-xs text-slate-600">
        <p className="font-medium text-slate-800">Telegram</p>
        <p className="mt-1 break-all">
          initData (фрагмент):{" "}
          <code className="rounded bg-slate-100 px-1">
            {(telegram?.initData || "").slice(0, 48) || "— вне Telegram недоступно"}
          </code>
        </p>
      </div>
    </section>
  );
}
