import { authFetch } from "./api";

export type SupportSession = {
  id: string;
  channel: string;
  external_user_id: string;
  status: string;
  created_at: string;
};

export type SupportMessage = {
  id: string;
  session_id: string;
  role: "customer" | "admin";
  content: string;
  metadata?: Record<string, any> | null;
  created_at: string;
};

export async function getSupportSession() {
  return authFetch("/support/session") as Promise<{
    session: SupportSession;
  }>;
}

export async function getSupportMessages() {
  return authFetch("/support/messages") as Promise<{
    session: SupportSession;
    items: SupportMessage[];
  }>;
}

export async function sendSupportMessage(content: string) {
  return authFetch("/support/messages", {
    method: "POST",
    body: JSON.stringify({ content }),
  }) as Promise<{
    ok: boolean;
    item: SupportMessage;
    session: SupportSession;
  }>;
}