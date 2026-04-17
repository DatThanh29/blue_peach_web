"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
    deleteNotification,
  deleteAllNotifications,
  type NotificationItem,
} from "@/lib/notifications.api";

const NOTIFICATIONS_SYNC_EVENT = "bp:notifications-sync";
const NOTIFICATIONS_POLL_MS = 15000;

function emitNotificationsSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_SYNC_EVENT));
  }
}

export function useNotifications() {
  const { isAuthenticated, isLoading } = useCustomerAuth();

  const [items, setItems] = useState<NotificationItem[]>([]);
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
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await getNotifications();
      setItems(res.items || []);
    } catch (error: any) {
      console.error("[useNotifications] load failed:", error);

      if (error?.status === 401) {
        setItems([]);
        return;
      }

      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;
    void loadNotifications();
  }, [isLoading, loadNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, NOTIFICATIONS_POLL_MS);

    function handleSync() {
      void loadNotifications();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    }

    function handleWindowFocus() {
      void loadNotifications();
    }

    window.addEventListener(NOTIFICATIONS_SYNC_EVENT, handleSync);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(NOTIFICATIONS_SYNC_EVENT, handleSync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [isAuthenticated, loadNotifications]);

  const markRead = useCallback(async (id: string) => {
    try {
      setMarkingId(id);
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
      emitNotificationsSync();
    } catch (error: any) {
      console.error("[useNotifications] markRead failed:", error);

      if (error?.status === 401) {
        setItems([]);
        return;
      }

      throw error;
    } finally {
      setMarkingId(null);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsRead();
      setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
      emitNotificationsSync();
    } catch (error: any) {
      console.error("[useNotifications] markAllRead failed:", error);

      if (error?.status === 401) {
        setItems([]);
        return;
      }

      throw error;
    } finally {
      setMarkingAll(false);
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      await deleteNotification(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      emitNotificationsSync();
    } catch (error: any) {
      console.error("[useNotifications] removeNotification failed:", error);

      if (error?.status === 401) {
        setItems([]);
        return;
      }

      throw error;
    } finally {
      setDeletingId(null);
    }
  }, []);

  const removeAllNotifications = useCallback(async () => {
    try {
      setDeletingAll(true);
      await deleteAllNotifications();
      setItems([]);
      emitNotificationsSync();
    } catch (error: any) {
      console.error("[useNotifications] removeAllNotifications failed:", error);

      if (error?.status === 401) {
        setItems([]);
        return;
      }

      throw error;
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