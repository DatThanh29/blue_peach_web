"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/api";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

type PaymentStatus =
  | "unpaid"
  | "pending_payment"
  | "paid"
  | "payment_failed";

type PaymentMethod = "cod" | "vnpay" | string;

type AddressSnapshot = {
  customer_name?: string;
  phone?: string;
  address?: string;
};

type OrderHandler = {
  user_id: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
};

type Order = {
  ma_don_hang: string;
  stt_hien_thi?: number | null;
  ma_nhan_vien_xu_ly?: string | null;
  nhan_vien_xu_ly?: OrderHandler | null;
  ngay_dat_hang: string;
  tong_thanh_toan: number;
  trang_thai_don: OrderStatus;
  trang_thai_thanh_toan: PaymentStatus;
  hinh_thuc_thanh_toan: PaymentMethod;
  dia_chi_giao_hang_snapshot?: AddressSnapshot | null;
};

type OrderListResponse = {
  items?: Order[];
  total?: number;
  data?: Order[];
  paging?: {
    total?: number;
  };
};

const STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDisplayOrderCode(stt?: number | null) {
  if (!stt) return "—";
  return `#${String(stt).padStart(4, "0")}`;
}

function orderStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return map[status] ?? status;
}

function paymentStatusLabel(status: string) {
  const map: Record<string, string> = {
    unpaid: "Chưa thanh toán",
    pending_payment: "Chờ thanh toán",
    paid: "Đã thanh toán",
    payment_failed: "Thanh toán lỗi",
  };
  return map[status] ?? status;
}

function paymentMethodLabel(method: string) {
  const map: Record<string, string> = {
    cod: "COD",
    vnpay: "VNPay",
  };
  return map[method] ?? method;
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-sky-200 bg-sky-50 text-sky-700",
    processing: "border-indigo-200 bg-indigo-50 text-indigo-700",
    shipped: "border-violet-200 bg-violet-50 text-violet-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status] ?? "border-zinc-200 bg-zinc-50 text-zinc-700",
      ].join(" ")}
    >
      {orderStatusLabel(status)}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    unpaid: "border-zinc-200 bg-zinc-50 text-zinc-700",
    pending_payment: "border-amber-200 bg-amber-50 text-amber-700",
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    payment_failed: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[status] ?? "border-zinc-200 bg-zinc-50 text-zinc-700",
      ].join(" ")}
    >
      {paymentStatusLabel(status)}
    </span>
  );
}

function PaymentMethodBadge({ method }: { method: string }) {
  const styles: Record<string, string> = {
    cod: "border-stone-200 bg-stone-50 text-stone-700",
    vnpay: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[method] ?? "border-zinc-200 bg-zinc-50 text-zinc-700",
      ].join(" ")}
    >
      {paymentMethodLabel(method)}
    </span>
  );
}

export default function AdminOrdersPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const status = sp.get("status") ?? "all";
  const q = sp.get("q") ?? "";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = 10;

  const [items, setItems] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [isComposing, setIsComposing] = useState(false);

  const offset = useMemo(() => (page - 1) * limit, [page]);

  function setQuery(next: Partial<{ status: string; q: string; page: number }>) {
    const params = new URLSearchParams(sp.toString());
    if (next.status !== undefined) params.set("status", next.status);
    if (next.q !== undefined) params.set("q", next.q);
    if (next.page !== undefined) params.set("page", String(next.page));
    router.push(`/admin/orders?${params.toString()}`);
  }

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (status !== "all") params.set("status", status);
      if (q.trim()) params.set("q", q.trim());

      const res = (await adminFetch(`/admin/orders?${params.toString()}`, {
        cache: "no-store",
      })) as OrderListResponse;

      const list = "items" in res ? res.items ?? [] : res.data ?? [];
      const t =
        "items" in res
          ? (res.total ?? list.length)
          : (res.paging?.total ?? list.length);

      setItems(list);
      setTotal(t);
    } catch (e: any) {
      setErr(e?.message ?? "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, page]);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (isComposing || searchInput === q) return;

    const t = setTimeout(() => {
      setQuery({ q: searchInput, page: 1 });
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, isComposing, q]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={load}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Trạng thái</div>
          <select
            value={status}
            onChange={(e) => setQuery({ status: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <div className="text-xs font-semibold text-zinc-600">Tìm kiếm</div>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setSearchInput(e.currentTarget.value);
            }}
            placeholder="Tìm theo mã đơn / mã hiển thị / tên khách / SĐT / nhân viên..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          ❌ {err}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-500">
          Tổng: <span className="font-semibold text-zinc-900">{total}</span> đơn
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-600">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách</th>
                <th className="px-4 py-3">Nhân viên xử lý</th>
                <th className="px-4 py-3">Tổng</th>
                <th className="px-4 py-3">Trạng thái đơn</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Phương thức</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {items.map((o) => {
                const customerName =
                  o.dia_chi_giao_hang_snapshot?.customer_name || "—";
                const phone = o.dia_chi_giao_hang_snapshot?.phone || "";
                const handlerName = o.nhan_vien_xu_ly?.full_name || "Chưa gán";
                const handlerRole = o.nhan_vien_xu_ly?.role || "";

                return (
                  <tr key={o.ma_don_hang} className="border-t border-zinc-100">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-900">
                        {formatDisplayOrderCode(o.stt_hien_thi)}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {o.ma_don_hang.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900">{customerName}</div>
                      <div className="text-xs text-zinc-500">{phone || "—"}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900">{handlerName}</div>
                      <div className="text-xs capitalize text-zinc-500">
                        {handlerRole || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {formatCurrency(o.tong_thanh_toan)}
                    </td>

                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.trang_thai_don} />
                    </td>

                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={o.trang_thai_thanh_toan} />
                    </td>

                    <td className="px-4 py-3">
                      <PaymentMethodBadge method={o.hinh_thuc_thanh_toan} />
                    </td>

                    <td className="px-4 py-3 text-zinc-600">
                      {formatDate(o.ngay_dat_hang)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.ma_don_hang}`}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {!loading && items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-zinc-500" colSpan={9}>
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
          <div className="text-xs text-zinc-500">
            Trang <span className="font-semibold text-zinc-900">{page}</span> /{" "}
            {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setQuery({ page: page - 1 })}
            >
              ← Prev
            </button>
            <button
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setQuery({ page: page + 1 })}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}