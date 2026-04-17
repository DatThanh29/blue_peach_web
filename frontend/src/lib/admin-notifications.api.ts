import { adminFetch } from "./api";

export type AdminNotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export async function getAdminNotifications() {
  return adminFetch("/admin/notifications") as Promise<{
    items: AdminNotificationItem[];
    unread_count: number;
  }>;
}

export async function markAdminNotificationRead(id: string) {
  return adminFetch("/admin/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ id }),
  }) as Promise<{ ok: boolean }>;
}

export async function markAllAdminNotificationsRead() {
  return adminFetch("/admin/notifications/mark-all-read", {
    method: "POST",
  }) as Promise<{ ok: boolean }>;
}

export async function deleteAdminNotification(id: string) {
  return adminFetch(`/admin/notifications/${id}`, {
    method: "DELETE",
  }) as Promise<{ ok: boolean }>;
}

export async function deleteAllAdminNotifications() {
  return adminFetch("/admin/notifications", {
    method: "DELETE",
  }) as Promise<{ ok: boolean }>;
}