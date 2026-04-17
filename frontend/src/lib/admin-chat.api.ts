import { adminFetch } from "./api";

export type AdminChatSession = {
  id: string;
  channel: string;
  external_user_id: string;
  status: string;
  created_at: string;
  last_message?: {
    id: string;
    session_id: string;
    role: "customer" | "admin";
    content: string;
    metadata?: Record<string, any> | null;
    created_at: string;
  } | null;
};

export type AdminChatMessage = {
  id: string;
  session_id: string;
  role: "customer" | "admin";
  content: string;
  metadata?: Record<string, any> | null;
  created_at: string;
};

export async function getAdminChatSessions() {
  return adminFetch("/admin/chat/sessions") as Promise<{
    items: AdminChatSession[];
  }>;
}

export async function getAdminChatMessages(sessionId: string) {
  return adminFetch(`/admin/chat/sessions/${sessionId}/messages`) as Promise<{
    session: AdminChatSession;
    items: AdminChatMessage[];
  }>;
}

export async function sendAdminChatMessage(sessionId: string, content: string) {
  return adminFetch(`/admin/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  }) as Promise<{
    ok: boolean;
    item: AdminChatMessage;
  }>;
}