export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return false;
      const body = (await res.json()) as {
        session?: {
          access_token?: string;
          refresh_token?: string;
        };
      };
      const session = body.session;
      if (!session?.access_token) return false;
      localStorage.setItem('access_token', session.access_token);
      if (session.refresh_token) {
        localStorage.setItem('refresh_token', session.refresh_token);
      }
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function rawFetch(path: string, init?: RequestInit): Promise<Response> {
  const isFormData = init?.body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeader(),
      ...(init?.headers ?? {}),
    },
  });
}

function isTokenError(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const msg = (body as { message?: string }).message ?? '';
  return /invalid or expired access token/i.test(msg) || /jwt expired/i.test(msg);
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let res = await rawFetch(path, init);
  if (res.status === 401) {
    const body = await res.clone().json().catch(() => ({}));
    if (isTokenError(body) || true) {
      const ok = await refreshSession();
      if (ok) {
        res = await rawFetch(path, init);
      }
    }
  }
  const body = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) {
    throw new Error(
      (body as { message?: string }).message ?? `Request failed (${res.status})`,
    );
  }
  return body;
}
