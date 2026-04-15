const API_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

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
    const data = await requestJson("/ngos");
    return Array.isArray(data) ? data : [];
  },
};

export const authService = {
  async getCurrentUser() {
    const data = await requestJson("/user");
    return data?.user || null;
  },
  async logout() {
    await requestJson("/logout");
  },
  loginWithGoogle() {
    window.location.assign(buildUrl("/auth/google"));
  },
};
