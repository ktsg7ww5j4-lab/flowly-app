import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { setTelegramContext, setStarted } from "./store/userSlice.js";
import Header from "./components/Header.jsx";
import CycleTracker from "./components/CycleTracker.jsx";
import MoodTracker from "./components/MoodTracker.jsx";
import SymptomTracker from "./components/SymptomTracker.jsx";
import Insights from "./components/Insights.jsx";
import Settings from "./components/Settings.jsx";

function Welcome({ telegram }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firstName = useSelector((s) => s.user.telegramUser?.first_name) || "друг";

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-10 safe-pb">
      <Header telegram={telegram} compact />
      <div className="mt-8 flex flex-1 flex-col justify-center">
        <p className="text-center text-sm uppercase tracking-[0.2em] text-slate-500">
          Flowly
        </p>
        <h1 className="mt-2 text-center text-3xl font-semibold text-slate-900">
          Привет, {firstName}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-slate-600">
          Персональный гид цикла: фазы, настроение, симптомы и мягкие рекомендации — в одном
          месте.
        </p>
        <button
          type="button"
          className="mx-auto mt-10 w-full max-w-xs rounded-2xl bg-gradient-to-r from-flow-plum to-flow-violet px-6 py-4 text-base font-semibold text-white shadow-lg shadow-purple-300/40 active:scale-[0.98] transition"
          onClick={() => {
            dispatch(setStarted(true));
            navigate("/cycle", { replace: true });
          }}
        >
          Начать
        </button>
      </div>
    </div>
  );
}

function useTelegramBackButton(telegram, started) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tg = telegram;
    if (!tg?.BackButton) return;

    const path = location.pathname;
    const canBack = started && path !== "/cycle" && path !== "/";

    if (canBack) {
      tg.BackButton.show();
      const handler = () => {
        if (path === "/mood" || path === "/symptoms" || path === "/insights" || path === "/settings") {
          navigate(-1);
        } else {
          navigate("/cycle");
        }
      };
      tg.BackButton.onClick(handler);
      return () => {
        tg.BackButton.offClick(handler);
        tg.BackButton.hide();
      };
    }

    tg.BackButton.hide();
    return undefined;
  }, [telegram, location.pathname, navigate, started]);
}

export default function App({ telegram }) {
  const dispatch = useDispatch();
  const started = useSelector((s) => s.user.started);
  useTelegramBackButton(telegram, started);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user) return;
    dispatch(
      setTelegramContext({
        user: tg.initDataUnsafe.user,
        initDataUnsafe: tg.initDataUnsafe,
      })
    );
  }, [dispatch]);

  return (
    <div className="min-h-full">
      <Routes>
        <Route
          path="/"
          element={
            started ? <Navigate to="/cycle" replace /> : <Welcome telegram={telegram} />
          }
        />
        <Route
          path="/cycle"
          element={
            !started ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-full px-4 pb-24 pt-6 safe-pb">
                <Header telegram={telegram} />
                <CycleTracker telegram={telegram} />
              </div>
            )
          }
        />
        <Route
          path="/mood"
          element={
            !started ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-full px-4 pb-24 pt-6 safe-pb">
                <MoodTracker telegram={telegram} />
              </div>
            )
          }
        />
        <Route
          path="/symptoms"
          element={
            !started ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-full px-4 pb-24 pt-6 safe-pb">
                <SymptomTracker telegram={telegram} />
              </div>
            )
          }
        />
        <Route
          path="/insights"
          element={
            !started ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-full px-4 pb-24 pt-6 safe-pb">
                <Insights />
              </div>
            )
          }
        />
        <Route
          path="/settings"
          element={
            !started ? (
              <Navigate to="/" replace />
            ) : (
              <div className="min-h-full px-4 pb-24 pt-6 safe-pb">
                <Settings telegram={telegram} />
              </div>
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
