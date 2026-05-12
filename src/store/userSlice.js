import { createSlice } from "@reduxjs/toolkit";

const today = () => new Date().toISOString().slice(0, 10);

const loadPersisted = () => {
  try {
    const raw = localStorage.getItem("flowly_state_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persisted = typeof localStorage !== "undefined" ? loadPersisted() : null;

const initialState = {
  started: persisted?.started ?? false,
  telegramUser: persisted?.telegramUser ?? null,
  initDataUnsafe: persisted?.initDataUnsafe ?? null,
  cycle: persisted?.cycle ?? {
    lastPeriodStart: today(),
    lengthDays: 28,
  },
  mood: persisted?.mood ?? {
    mood: 3,
    energy: 3,
    stress: 2,
    note: "",
    date: today(),
  },
  symptoms: persisted?.symptoms ?? {
    pms: [],
    pcos: [],
    endo: [],
    note: "",
  },
  insights: persisted?.insights ?? [],
  storageMode: persisted?.storageMode ?? "local",
  wearablesConnected: persisted?.wearablesConnected ?? false,
  privacyLocalOnly: persisted?.privacyLocalOnly ?? true,
  lastSyncedAt: persisted?.lastSyncedAt ?? null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTelegramContext(state, action) {
      const { user, initDataUnsafe } = action.payload;
      state.telegramUser = user;
      state.initDataUnsafe = initDataUnsafe;
    },
    setStarted(state, action) {
      state.started = action.payload;
    },
    setCycle(state, action) {
      state.cycle = { ...state.cycle, ...action.payload };
    },
    setMood(state, action) {
      state.mood = { ...state.mood, ...action.payload, date: today() };
    },
    setSymptoms(state, action) {
      state.symptoms = { ...state.symptoms, ...action.payload };
    },
    setInsights(state, action) {
      state.insights = action.payload;
    },
    setStorageMode(state, action) {
      state.storageMode = action.payload;
    },
    setWearablesConnected(state, action) {
      state.wearablesConnected = action.payload;
    },
    setPrivacyLocalOnly(state, action) {
      state.privacyLocalOnly = action.payload;
    },
    setLastSyncedAt(state, action) {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const {
  setTelegramContext,
  setStarted,
  setCycle,
  setMood,
  setSymptoms,
  setInsights,
  setStorageMode,
  setWearablesConnected,
  setPrivacyLocalOnly,
  setLastSyncedAt,
} = userSlice.actions;

export default userSlice.reducer;
