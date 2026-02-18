export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function adminHeaders() {
  const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "";
  console.log("Admin token:", token ? `${token.slice(0, 10)}...` : "MISSING");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiAdminGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { ...adminHeaders() },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error ?? `GET ${path} failed: ${res.status}`);
  return json as T;
}

export async function apiAdminPatch<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error ?? `PATCH ${path} failed: ${res.status}`);
  return json as T;
}
