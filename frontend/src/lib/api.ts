export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type FetchOptions = RequestInit;

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as any).error)
        : `Request failed with status ${res.status}`;
    throw new Error(message);
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

async function buildAdminHeaders(extraHeaders?: HeadersInit) {
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

export async function adminFetch(path: string, options: FetchOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: await buildAdminHeaders(options.headers),
    cache: "no-store",
  });

  return parseResponse(res);
}