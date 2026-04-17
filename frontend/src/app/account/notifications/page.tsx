"use client";

import Link from "next/link";
import AccountShell from "@/components/account/AccountShell";
import Toast from "@/components/Toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Không xác định";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function NotificationTypePill({ type }: { type: string }) {
  const labelMap: Record<string, string> = {
    order_created: "Đơn hàng",
    payment: "Thanh toán",
    promotion: "Ưu đãi",
    account: "Tài khoản",
  };

  return (
    <span className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/50">
      {labelMap[type] || "Thông báo"}
    </span>
  );
}

export default function AccountNotificationsPage() {
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
  } = useNotifications();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  async function handleMarkRead(id: string) {
    try {
      await markRead(id);
      setToast({
        message: "Đã đánh dấu thông báo là đã đọc",
        type: "success",
      });
    } catch (error) {
      console.error("[AccountNotificationsPage] markRead failed:", error);
      setToast({
        message: "Không thể cập nhật thông báo lúc này.",
        type: "error",
      });
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead();
      setToast({
        message: "Đã đánh dấu tất cả thông báo là đã đọc",
        type: "success",
      });
    } catch (error) {
      console.error("[AccountNotificationsPage] markAllRead failed:", error);
      setToast({
        message: "Không thể cập nhật thông báo lúc này.",
        type: "error",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeNotification(id);
      setToast({
        message: "Đã xóa thông báo",
        type: "success",
      });
    } catch (error) {
      console.error("[AccountNotificationsPage] delete failed:", error);
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
      console.error("[AccountNotificationsPage] deleteAll failed:", error);
      setToast({
        message: "Không thể xóa tất cả thông báo lúc này.",
        type: "error",
      });
    }
  }

  return (
    <AccountShell
      title="Thông báo"
      description="Khu vực này hiển thị các cập nhật liên quan đến đơn hàng, tài khoản, ưu đãi và các hoạt động mới từ Blue Peach."
    >
      <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
              Notification Center
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              Thông báo của bạn
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/62">
              {unreadCount > 0
                ? `Bạn hiện có ${unreadCount} thông báo chưa đọc.`
                : "Bạn đã đọc hết tất cả thông báo."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll || unreadCount === 0}
              className="bp-btn bp-btn--ghost disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markingAll ? "Đang cập nhật..." : "Đánh dấu tất cả đã đọc"}
            </button>

            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={deletingAll || items.length === 0}
              className="bp-btn bp-btn--ghost disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingAll ? "Đang xoá..." : "Xóa tất cả"}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-black/60">Đang tải thông báo...</p>
          ) : items.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-[#fbfaf7] px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-black">Chưa có thông báo</h3>
              <p className="mx-auto mt-3 max-w-[620px] text-sm leading-7 text-black/60">
                Các cập nhật về đơn hàng, ưu đãi và tài khoản sẽ xuất hiện tại đây khi có hoạt động mới.
              </p>

              <div className="mt-6">
                <Link href="/products" className="bp-btn bp-btn--solid border-black">
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className={[
                  "rounded-[24px] border p-5 transition md:p-6",
                  item.is_read
                    ? "border-black/8 bg-[#fbfaf7]"
                    : "border-[#e8dccb] bg-[#fff8ef]",
                ].join(" ")}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <NotificationTypePill type={item.type} />
                      {!item.is_read ? (
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#D14B5A]" />
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-[18px] font-semibold text-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-black/66">
                      {item.message}
                    </p>

                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-black/38">
                      {formatTime(item.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-3">
                    {item.link ? (
                      <Link href={item.link} className="bp-btn bp-btn--ghost !px-4 !py-2">
                        Mở liên kết
                      </Link>
                    ) : null}

                    {!item.is_read ? (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        disabled={markingId === item.id}
                        className="bp-btn bp-btn--ghost !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {markingId === item.id ? "Đang cập nhật..." : "Đánh dấu đã đọc"}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="bp-btn bp-btn--ghost !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </AccountShell>
  );
}