import { authFetch } from "./api";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
};

export async function getNotifications() {
  return authFetch("/notifications") as Promise<{
    items: NotificationItem[];
    unread_count: number;
  }>;
}

export async function markNotificationRead(id: string) {
  return authFetch("/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ id }),
  }) as Promise<{ ok: boolean }>;
}

export async function markAllNotificationsRead() {
  return authFetch("/notifications/mark-all-read", {
    method: "POST",
  }) as Promise<{ ok: boolean }>;
}

export async function deleteNotification(id: string) {
  return authFetch(`/notifications/${id}`, {
    method: "DELETE",
  }) as Promise<{ ok: boolean }>;
}

export async function deleteAllNotifications() {
  return authFetch("/notifications", {
    method: "DELETE",
  }) as Promise<{ ok: boolean }>;
}