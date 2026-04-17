export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type FetchOptions = RequestInit;
type ApiError = Error & { status?: number };

const AUTH_INVALID_EVENT = "bp:auth-invalid";

function emitAuthInvalid() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_INVALID_EVENT));
  }
}

async function parseResponse(res: Response) {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${res.status}`;

    const error = new Error(message) as ApiError;
    error.status = res.status;

    if (res.status === 401) {
      emitAuthInvalid();
    }

    throw error;
  }

  return data;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  return parseResponse(res);
}

async function buildAuthHeaders(extraHeaders?: HeadersInit) {
  const { supabase } = await import("@/lib/supabase");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(extraHeaders || {}),
  };
}

export async function authFetch(path: string, options: FetchOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: await buildAuthHeaders(options.headers),
    cache: "no-store",
  });

  return parseResponse(res);
}

export async function adminFetch(path: string, options: FetchOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: await buildAuthHeaders(options.headers),
    cache: "no-store",
  });

  return parseResponse(res);
}

export { AUTH_INVALID_EVENT };  