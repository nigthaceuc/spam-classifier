const baseURL = import.meta.env.VITE_API_URL ?? '';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(baseURL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  });

  // manejar respuesta vacía
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = { http };
