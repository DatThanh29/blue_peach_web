"use client";

import Link from "next/link";
import { useState } from "react";
import Toast from "@/components/Toast";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Không xác định";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function NotificationIcon({ type }: { type: string }) {
  const common =
    "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-sky-50 text-sky-600";

  if (type === "order_created") {
    return (
      <span className={common}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8V6a3 3 0 1 1 6 0v2" />
        </svg>
      </span>
    );
  }

  return (
    <span className={common}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </svg>
    </span>
  );
}

export default function AdminNotificationsPage() {
  const {
    items,
    loading,
    unreadCount,
    markingId,
    markingAll,
    deletingId,
    deletingAll,
    markRead,
    markAllRead,
    removeNotification,
    removeAllNotifications,
  } = useAdminNotifications();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  async function handleDelete(id: string) {
    try {
      await removeNotification(id);
      setToast({
        message: "Đã xóa thông báo",
        type: "success",
      });
    } catch (error) {
      console.error("[AdminNotificationsPage] delete failed:", error);
      setToast({
        message: "Không thể xóa thông báo lúc này.",
        type: "error",
      });
    }
  }

  async function handleDeleteAll() {
    try {
      await removeAllNotifications();
      setToast({
        message: "Đã xóa tất cả thông báo",
        type: "success",
      });
    } catch (error) {
      console.error("[AdminNotificationsPage] deleteAll failed:", error);
      setToast({
        message: "Không thể xóa tất cả thông báo lúc này.",
        type: "error",
      });
    }
  }

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Admin Center
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Thông báo
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500">
                Trung tâm thông báo dành cho quản trị viên và nhân viên vận hành.
                Các cập nhật như đơn hàng mới, đánh giá mới, hỗ trợ mới hoặc hoạt động quan trọng của hệ thống sẽ xuất hiện tại đây.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await markAllRead();
                    setToast({
                      message: "Đã đánh dấu tất cả thông báo là đã đọc",
                      type: "success",
                    });
                  } catch (error) {
                    console.error("[AdminNotificationsPage] markAllRead failed:", error);
                    setToast({
                      message: "Không thể cập nhật thông báo lúc này.",
                      type: "error",
                    });
                  }
                }}
                disabled={markingAll || unreadCount === 0}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {markingAll ? "Đang cập nhật..." : "Đánh dấu tất cả đã đọc"}
              </button>

              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deletingAll || items.length === 0}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingAll ? "Đang xóa..." : "Xóa tất cả"}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
              {loading
                ? "Đang tải thông báo..."
                : unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : "Tất cả thông báo đã được đọc"}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Danh sách thông báo
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Hiển thị các cập nhật mới nhất của hệ thống.
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-200">
            {loading ? (
              <div className="px-6 py-8 text-sm text-zinc-500">
                Đang tải thông báo...
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Chưa có thông báo
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Khi có đơn hàng mới hoặc hoạt động quan trọng, thông báo sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className={[
                    "px-5 py-5 transition sm:px-6",
                    item.is_read ? "bg-white" : "bg-sky-50/40",
                  ].join(" ")}
                >
                  <div className="flex gap-4">
                    <div className="pt-1">
                      <NotificationIcon type={item.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-semibold text-zinc-900">
                              {item.title}
                            </h3>

                            {!item.is_read ? (
                              <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                                Mới
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-zinc-600">
                            {item.message}
                          </p>

                          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-zinc-400">
                            {formatTime(item.created_at)}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-3">
                          {item.link ? (
                            <Link
                              href={item.link}
                              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                            >
                              Mở liên kết
                            </Link>
                          ) : null}

                          {!item.is_read ? (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await markRead(item.id);
                                  setToast({
                                    message: "Đã đánh dấu thông báo là đã đọc",
                                    type: "success",
                                  });
                                } catch (error) {
                                  console.error("[AdminNotificationsPage] markRead failed:", error);
                                  setToast({
                                    message: "Không thể cập nhật thông báo lúc này.",
                                    type: "error",
                                  });
                                }
                              }}
                              disabled={markingId === item.id}
                              className="rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {markingId === item.id ? "Đang cập nhật..." : "Đánh dấu đã đọc"}
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}