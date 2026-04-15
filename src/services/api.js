import { mockNgos, mockUser } from "../constants/mockData";

const API_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
const STORAGE_KEYS = {
  user: "sharethemeal.user",
  donations: "sharethemeal.donations",
};

const hasBackend = Boolean(API_BASE_URL);

const readStorage = (key, fallbackValue) => {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
};

const writeStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const buildUrl = (path) => {
  if (!path.startsWith("/")) {
    throw new Error(`Expected an absolute API path, received "${path}"`);
  }

  return `${API_BASE_URL}${path}`;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

export const ngoService = {
  async getAll() {
    if (!hasBackend) {
      return mockNgos;
    }

    const data = await requestJson("/ngos");
    return Array.isArray(data) ? data : [];
  },
};

export const authService = {
  async getCurrentUser() {
    if (!hasBackend) {
      return readStorage(STORAGE_KEYS.user, null);
    }

    const data = await requestJson("/user");
    return data?.user || null;
  },
  async logout() {
    if (!hasBackend) {
      window.localStorage.removeItem(STORAGE_KEYS.user);
      return;
    }

    await requestJson("/logout");
  },
  loginWithGoogle() {
    if (!hasBackend) {
      writeStorage(STORAGE_KEYS.user, mockUser);
      return mockUser;
    }

    window.location.assign(buildUrl("/auth/google"));
    return null;
  },
};

export const donationService = {
  async getAll() {
    return readStorage(STORAGE_KEYS.donations, []);
  },
  async create(donationPayload) {
    const existingDonations = readStorage(STORAGE_KEYS.donations, []);
    const createdDonation = {
      id: `donation-${Date.now()}`,
      status: donationPayload.deliveryMode === "Pickup" ? "Pickup Requested" : "Scheduled",
      createdAt: new Date().toISOString(),
      ...donationPayload,
    };

    writeStorage(STORAGE_KEYS.donations, [createdDonation, ...existingDonations]);
    return createdDonation;
  },
};
