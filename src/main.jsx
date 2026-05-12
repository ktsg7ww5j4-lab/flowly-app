import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { store } from "./store/index.js";
import "./index.css";

function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return null;
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#fce7f3");
    tg.setBackgroundColor("#fce7f3");
  } catch {
    /* older clients */
  }
  return tg;
}

const tg = initTelegramWebApp();

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App telegram={tg} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
