"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
  type AdminNotificationItem,
} from "@/lib/admin-notifications.api";

export function useAdminNotifications() {
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.is_read).length,
    [items]
  );

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminNotifications();
      setItems(res.items || []);
    } catch (error) {
      console.error("[useAdminNotifications] load failed:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const markRead = useCallback(async (id: string) => {
    try {
      setMarkingId(id);
      await markAdminNotificationRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
    } finally {
      setMarkingId(null);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      setMarkingAll(true);
      await markAllAdminNotificationsRead();
      setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
    } finally {
      setMarkingAll(false);
    }
  }, []);

    const removeNotification = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAdminNotification(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  }, []);

  const removeAllNotifications = useCallback(async () => {
    try {
      setDeletingAll(true);
      await deleteAllAdminNotifications();
      setItems([]);
    } finally {
      setDeletingAll(false);
    }
  }, []);

    return {
    items,
    loading,
    unreadCount,
    markingId,
    markingAll,
    deletingId,
    deletingAll,
    refreshNotifications: loadNotifications,
    markRead,
    markAllRead,
    removeNotification,
    removeAllNotifications,
  };
}