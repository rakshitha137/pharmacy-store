// ─── CONFIG ───────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ─── HELPER ───────────────────────────────────────────────
async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong.");
    err.status = res.status;
    throw err;
  }

  return data;
}

// ─── SIGNUP ───────────────────────────────────────────────
export async function signup({ name, email, password }) {
  const data = await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  // Persist token after signup
  if (data?.data?.token) {
    persistSessionToken(data.data.token);
  }

  return data;
}

// ─── LOGIN ────────────────────────────────────────────────
export async function login({ email, password }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Persist token after login
  if (data?.data?.token) {
    persistSessionToken(data.data.token);
  }

  return data;
}

// ─── TOKEN HELPERS ────────────────────────────────────────
export function persistSessionToken(token) {
  if (!token) return;
  try {
    window.localStorage.setItem("carerx-token", token);
  } catch {
    /* ignore */
  }
}

export function clearSessionToken() {
  try {
    window.localStorage.removeItem("carerx-token");
  } catch {
    /* ignore */
  }
}

export function getSessionToken() {
  try {
    return window.localStorage.getItem("carerx-token");
  } catch {
    return null;
  }
}