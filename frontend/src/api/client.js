const BASE_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};

  const isFormData = body instanceof FormData;

  // Only set JSON content-type when NOT uploading FormData
  if (!isFormData && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}