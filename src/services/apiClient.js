const DEFAULT_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

function buildUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!DEFAULT_BASE) return null;
  return `${DEFAULT_BASE}${p}`;
}

export async function apiRequest(path, options = {}) {
  const url = buildUrl(path);
  if (!url) {
    const err = new Error("API_BASE_URL_NOT_CONFIGURED");
    err.code = "NO_API";
    throw err;
  }

  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("carerx-token")
      : null;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.message) || res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function isApiConfigured() {
  return Boolean(DEFAULT_BASE);
}

export { DEFAULT_BASE as API_BASE_URL };
