export const STORAGE_KEYS = {
  donations: "sharethemeal.v2.donations",
  draft: "sharethemeal.v2.draft",
  welcomeDismissed: "sharethemeal.v2.welcome-dismissed",
  location: "sharethemeal.v2.location",
};

// Storage can throw (private mode, quota, blocked cookies). The app should keep
// working in memory when that happens, so every access is guarded.
const createStore = (areaName) => ({
  get(key, fallback) {
    try {
      const raw = window[areaName].getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window[areaName].setItem(key, JSON.stringify(value));
    } catch {
      // Ignore: the value still lives in React state for this session.
    }
  },
  remove(key) {
    try {
      window[areaName].removeItem(key);
    } catch {
      // Ignore, see above.
    }
  },
});

export const localStore = createStore("localStorage");
export const sessionStore = createStore("sessionStorage");
