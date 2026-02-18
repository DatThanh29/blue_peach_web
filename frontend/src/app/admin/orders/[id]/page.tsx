"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiAdminGet, apiAdminPatch, apiGet } from "@/lib/api";

const STATUS = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"] as const;

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
    <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", map[status] ?? "bg-zinc-50 text-zinc-700 border-zinc-200"].join(" ")}>
      {status}
    </span>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("pending");
  const [note, setNote] = useState<string>("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const snap = useMemo(() => order?.dia_chi_giao_hang_snapshot || {}, [order]);

  async function load() {
    if (!orderId) return;
    setMsg(null);

    // ưu tiên admin endpoint
    try {
      const res = await apiAdminGet<{ order: any; items: any[]; logs?: any[] }>(`/api/admin/orders/${orderId}`);
      setOrder(res.order);
      setItems(res.items ?? []);
      setLogs(res.logs ?? []);
      setStatus(res.order?.trang_thai_don ?? "pending");
      return;
    } catch {
      // fallback nếu backend chưa có admin detail
    }

    // fallback public
    const res = await apiGet<any>(`/api/orders/${orderId}`);
    setOrder(res);
    setItems(res.items ?? []);
    setLogs([]);
    setStatus(res.trang_thai_don ?? "pending");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function saveStatus() {
    if (!orderId) return;

    setLoading(true);
    setMsg(null);
    try {
      // backend của bạn hiện đang nhận body { trang_thai_don: status }
      await apiAdminPatch(`/api/admin/orders/${orderId}/status`, {
        trang_thai_don: status,
        note,
      });

      setMsg({ type: "ok", text: "✅ Cập nhật trạng thái thành công" });
      setNote("");
      await load();
    } catch (e: any) {
      setMsg({ type: "err", text: `❌ ${e?.message ?? "Update failed"}` });
    } finally {
      setLoading(false);
    }
  }

  if (!orderId) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm text-zinc-600 hover:underline">
            ← Back to orders
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Order <span className="text-zinc-500">#{order.ma_don_hang}</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge status={order.trang_thai_don} />
            <div className="text-sm text-zinc-500">
              {order.ngay_dat_hang ? new Date(order.ngay_dat_hang).toLocaleString("vi-VN") : "—"}
            </div>
          </div>
        </div>
      </div>

      {msg ? (
        <div
          className={[
            "rounded-2xl border p-4 text-sm",
            msg.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800",
          ].join(" ")}
        >
          {msg.text}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Customer */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-semibold">Thông tin khách</div>
          <div className="mt-3 space-y-2 text-sm">
            <div><span className="text-zinc-500">Họ tên:</span> <span className="font-medium">{snap.customer_name ?? "—"}</span></div>
            <div><span className="text-zinc-500">SĐT:</span> <span className="font-medium">{snap.phone ?? "—"}</span></div>
            <div><span className="text-zinc-500">Địa chỉ:</span> <span className="font-medium">{snap.address ?? "—"}</span></div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-semibold">Thanh toán</div>
          <div className="mt-3 space-y-2 text-sm">
            <div><span className="text-zinc-500">Tổng:</span> <span className="font-bold">{Number(order.tong_thanh_toan).toLocaleString("vi-VN")}đ</span></div>
            <div><span className="text-zinc-500">Trạng thái:</span> <span className="font-medium">{order.trang_thai_thanh_toan ?? "—"}</span></div>
            <div><span className="text-zinc-500">Hình thức:</span> <span className="font-medium">{order.hinh_thuc_thanh_toan ?? "—"}</span></div>
          </div>
        </div>

        {/* Status control */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-semibold">Cập nhật trạng thái</div>

          <div className="mt-3 space-y-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú (tuỳ chọn)..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />

            <button
              onClick={saveStatus}
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu trạng thái"}
            </button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold">
          Items
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-600">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">SL</th>
                <th className="px-4 py-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} className="border-t border-zinc-100">
                  <td className="px-4 py-3">
                    <div className="font-medium">{it.ten_san_pham ?? it.ma_san_pham ?? "—"}</div>
                    <div className="text-xs text-zinc-500">{it.bien_the ?? it.ma_bien_the ?? ""}</div>
                  </td>
                  <td className="px-4 py-3">x{it.so_luong_mua ?? it.so_luong ?? 0}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {Number(it.thanh_tien ?? it.gia_tien ?? 0).toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-zinc-500">
                    Không có items.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs (optional) */}
      {logs.length > 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-semibold">Lịch sử trạng thái</div>
          <div className="mt-3 space-y-2 text-sm">
            {logs.map((l, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Badge status={l.new_status ?? l.trang_thai_moi ?? "—"} />
                  <span className="text-zinc-600">
                    {l.note ?? l.ghi_chu ?? ""}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  {l.created_at ? new Date(l.created_at).toLocaleString("vi-VN") : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
