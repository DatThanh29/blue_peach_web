"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiAdminGet } from "@/lib/api";

type Order = {
  ma_don_hang: string;
  ngay_dat_hang: string;
  tong_thanh_toan: number;
  trang_thai_don: string;
  trang_thai_thanh_toan: string;
  hinh_thuc_thanh_toan: string;
  dia_chi_giao_hang_snapshot: any;
};

type ListResponse =
  | { items: Order[]; total?: number; limit?: number; offset?: number }
  | { data: Order[]; paging?: { page: number; limit: number; total: number } };

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        map[status] ?? "bg-zinc-50 text-zinc-700 border-zinc-200",
      ].join(" ")}
    >
      {status}
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

      // endpoint list admin: /api/admin/orders
      const res = await apiAdminGet<ListResponse>(`/api/admin/orders?${params.toString()}`);

      // hỗ trợ 2 kiểu response (để không kẹt nếu backend trả khác format)
      const list = "items" in res ? res.items : res.data;
      const t =
        "items" in res
          ? res.total ?? list.length
          : res.paging?.total ?? list.length;

      setItems(list ?? []);
      setTotal(t ?? 0);
    } catch (e: any) {
      setErr(e?.message ?? "Load failed");
    } finally {
      setLoading(false);
    }
  }

  // debounce search nhẹ
  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-zinc-500">Tìm kiếm, lọc trạng thái, phân trang và xem chi tiết đơn.</p>
        </div>

        <button
          onClick={load}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Reload"}
        </button>
      </div>

      {/* Controls */}
      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Status</div>
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
          <div className="text-xs font-semibold text-zinc-600">Search</div>
          <input
            value={q}
            onChange={(e) => setQuery({ q: e.target.value, page: 1 })}
            placeholder="Tìm theo mã đơn / tên / SĐT..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          ❌ {err}
        </div>
      ) : null}

      {/* Table */}
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
                <th className="px-4 py-3">Tổng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => {
                const snap = o.dia_chi_giao_hang_snapshot || {};
                return (
                  <tr key={o.ma_don_hang} className="border-t border-zinc-100">
                    <td className="px-4 py-3 font-semibold">#{o.ma_don_hang}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{snap.customer_name ?? "—"}</div>
                      <div className="text-xs text-zinc-500">{snap.phone ?? "—"} • {snap.address ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {Number(o.tong_thanh_toan).toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={o.trang_thai_don} />
                      <div className="mt-1 text-xs text-zinc-500">
                        TT: {o.trang_thai_thanh_toan} • {o.hinh_thuc_thanh_toan}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {o.ngay_dat_hang ? new Date(o.ngay_dat_hang).toLocaleString("vi-VN") : "—"}
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
                  <td className="px-4 py-8 text-center text-zinc-500" colSpan={6}>
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
          <div className="text-xs text-zinc-500">
            Trang <span className="font-semibold text-zinc-900">{page}</span> / {totalPages}
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
