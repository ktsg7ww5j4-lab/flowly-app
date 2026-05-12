import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const s = store.getState().user;
    const snapshot = {
      started: s.started,
      telegramUser: s.telegramUser,
      initDataUnsafe: s.initDataUnsafe,
      cycle: s.cycle,
      mood: s.mood,
      symptoms: s.symptoms,
      insights: s.insights,
      storageMode: s.storageMode,
      wearablesConnected: s.wearablesConnected,
      privacyLocalOnly: s.privacyLocalOnly,
      lastSyncedAt: s.lastSyncedAt,
    };
    try {
      localStorage.setItem("flowly_state_v1", JSON.stringify(snapshot));
    } catch {
      /* quota */
    }
  });
}
