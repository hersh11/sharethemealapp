import { demoNgos, demoUser } from "../data/mockData";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL ?? "").trim().replace(/\/+$/, "");

// Without a backend URL the app runs entirely in the browser with demo data.
export const isDemoMode = API_BASE_URL === "";

const requestJson = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : null;
};

const toCoordinate = (value) =>
  value === undefined || value === null || value === "" || !Number.isFinite(Number(value)) ? null : Number(value);

// Accepts the current field names and the ones the original backend used.
export const normalizeNgo = (raw) => ({
  id: String(raw.id ?? raw._id),
  name: raw.name ?? raw.NGOName ?? "Unnamed NGO",
  area: raw.area ?? raw.location ?? "",
  lat: toCoordinate(raw.lat ?? raw.latitude),
  lng: toCoordinate(raw.lng ?? raw.longitude),
  avatar: raw.avatar ?? null,
  mealsNeeded: Number(raw.mealsNeeded ?? raw.mealsRequired ?? 0),
  neededBy: raw.neededBy ?? raw.time ?? "",
  rating: Number(raw.rating ?? raw.reviews ?? 0),
  mealsServed: Number(raw.mealsServed ?? raw.totalFeeds ?? 0),
  campaigns: Number(raw.campaigns ?? raw.totalCampaigns ?? 0),
  volunteers: Number(raw.volunteers ?? raw.totalVolunteers ?? 0),
  accepts: Array.isArray(raw.accepts) ? raw.accepts : [],
  about: raw.about ?? "",
});

export const ngoService = {
  async getAll() {
    if (isDemoMode) {
      return demoNgos;
    }

    const data = await requestJson("/ngos");
    return Array.isArray(data) ? data.filter(Boolean).map(normalizeNgo) : [];
  },
};

export const authService = {
  async getCurrentUser() {
    if (isDemoMode) {
      return demoUser;
    }

    const data = await requestJson("/user");
    return data?.user ?? null;
  },
  // With a backend this redirects to Google sign-in. Demo visitors are always
  // signed in as the guest donor, so there's nothing to do.
  signIn() {
    if (isDemoMode) {
      return demoUser;
    }

    window.location.assign(`${API_BASE_URL}/auth/google`);
    return null;
  },
  async signOut() {
    if (!isDemoMode) {
      await requestJson("/logout");
    }
  },
};
