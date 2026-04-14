"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type OrderItem = {
  ma_san_pham?: string;
  sku?: string;
  ten_san_pham?: string;
  so_luong_mua: number;
  don_gia_snapshot: number;
  thanh_tien: number;
};

type HandlerProfile = {
  user_id: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
};

type OrderDetail = {
  ma_don_hang: string;
  stt_hien_thi?: number | null;
  ma_nhan_vien_xu_ly?: string | null;
  nhan_vien_xu_ly?: HandlerProfile | null;
  ngay_dat_hang?: string;
  tong_tien_hang?: number;
  giam_gia?: number;
  phi_van_chuyen?: number;
  tong_thanh_toan: number;
  trang_thai_don: OrderStatus;
  trang_thai_thanh_toan: PaymentStatus;
  hinh_thuc_thanh_toan: PaymentMethod;
  dia_chi_giao_hang_snapshot?: AddressSnapshot | null;
  ghi_chu?: string | null;
  ma_tham_chieu_thanh_toan?: string | null;
  ma_giao_dich_cong?: string | null;
  ma_ngan_hang?: string | null;
  ngay_thanh_toan?: string | null;
  items?: OrderItem[];
};

type HandlerListResponse = {
  items: HandlerProfile[];
};

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
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

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "pending_payment", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "payment_failed", label: "Thanh toán lỗi" },
];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [handlers, setHandlers] = useState<HandlerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingAssignee, setSavingAssignee] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapshot = useMemo(
    () => order?.dia_chi_giao_hang_snapshot ?? {},
    [order]
  );

  async function loadOrder() {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const [orderData, handlerData] = await Promise.all([
        adminFetch(`/admin/orders/${id}`),
        adminFetch(`/admin/orders/handlers`),
      ]);

      setOrder(orderData);
      setHandlers((handlerData as HandlerListResponse).items ?? []);
    } catch (err: any) {
      setError(err?.message || "Không tải được chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function updateOrderStatus(trang_thai_don: string) {
    if (!order) return;

    setSavingStatus(true);
    setError(null);

    try {
      const res = await adminFetch(`/admin/orders/${order.ma_don_hang}/status`, {
        method: "PATCH",
        body: JSON.stringify({ trang_thai_don }),
      });

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              trang_thai_don: res.order?.trang_thai_don ?? trang_thai_don,
            }
          : prev
      );
    } catch (err: any) {
      setError(err?.message || "Cập nhật trạng thái đơn hàng thất bại.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function updatePaymentStatus(trang_thai_thanh_toan: string) {
    if (!order) return;

    setSavingPayment(true);
    setError(null);

    try {
      const res = await adminFetch(
        `/admin/orders/${order.ma_don_hang}/payment-status`,
        {
          method: "PATCH",
          body: JSON.stringify({ trang_thai_thanh_toan }),
        }
      );

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              trang_thai_thanh_toan:
                res.order?.trang_thai_thanh_toan ?? trang_thai_thanh_toan,
            }
          : prev
      );
    } catch (err: any) {
      setError(err?.message || "Cập nhật trạng thái thanh toán thất bại.");
    } finally {
      setSavingPayment(false);
    }
  }

  async function updateAssignee(ma_nhan_vien_xu_ly: string) {
    if (!order) return;

    setSavingAssignee(true);
    setError(null);

    try {
      const payload = {
        ma_nhan_vien_xu_ly: ma_nhan_vien_xu_ly || null,
      };

      const res = await adminFetch(`/admin/orders/${order.ma_don_hang}/assignee`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              ma_nhan_vien_xu_ly: res.order?.ma_nhan_vien_xu_ly ?? null,
              nhan_vien_xu_ly: res.order?.nhan_vien_xu_ly ?? null,
            }
          : prev
      );
    } catch (err: any) {
      setError(err?.message || "Gán nhân viên xử lý thất bại.");
    } finally {
      setSavingAssignee(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <button
          onClick={() => router.push("/admin/orders")}
          className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Quay lại danh sách đơn
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
            Order Detail
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">
            {formatDisplayOrderCode(order.stt_hien_thi)}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            UUID: {order.ma_don_hang}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Đặt lúc {formatDate(order.ngay_dat_hang)}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/orders")}
          className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Quay lại
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Mã hiển thị
          </p>
          <div className="mt-3 text-lg font-semibold text-stone-900">
            {formatDisplayOrderCode(order.stt_hien_thi)}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Trạng thái đơn
          </p>
          <div className="mt-3">
            <OrderStatusBadge status={order.trang_thai_don} />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Thanh toán
          </p>
          <div className="mt-3">
            <PaymentStatusBadge status={order.trang_thai_thanh_toan} />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Phương thức
          </p>
          <div className="mt-3">
            <PaymentMethodBadge method={order.hinh_thuc_thanh_toan} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Sản phẩm trong đơn
            </h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50 text-left text-stone-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Sản phẩm</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 font-medium">SL</th>
                    <th className="px-4 py-3 font-medium">Đơn giá</th>
                    <th className="px-4 py-3 font-medium">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {(order.items ?? []).map((item, idx) => (
                    <tr key={`${item.ma_san_pham || idx}-${idx}`}>
                      <td className="px-4 py-3 text-stone-800">
                        {item.ten_san_pham || item.ma_san_pham || "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {item.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {item.so_luong_mua}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {formatCurrency(item.don_gia_snapshot)}
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {formatCurrency(item.thanh_tien)}
                      </td>
                    </tr>
                  ))}

                  {(order.items ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                        Chưa có dữ liệu sản phẩm.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Cập nhật trạng thái & xử lý
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Trạng thái đơn hàng
                </label>
                <select
                  value={order.trang_thai_don}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={savingStatus}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 disabled:opacity-60"
                >
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Trạng thái thanh toán
                </label>
                <select
                  value={order.trang_thai_thanh_toan}
                  onChange={(e) => updatePaymentStatus(e.target.value)}
                  disabled={savingPayment}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 disabled:opacity-60"
                >
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Nhân viên xử lý
                </label>
                <select
                  value={order.ma_nhan_vien_xu_ly ?? ""}
                  onChange={(e) => updateAssignee(e.target.value)}
                  disabled={savingAssignee}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 disabled:opacity-60"
                >
                  <option value="">Chưa gán</option>
                  {handlers.map((handler) => (
                    <option key={handler.user_id} value={handler.user_id}>
                      {handler.full_name || handler.user_id} ({handler.role || "staff"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Khách hàng & giao hàng
            </h2>

            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Khách hàng
                </p>
                <p className="mt-1 font-medium text-stone-900">
                  {snapshot.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Số điện thoại
                </p>
                <p className="mt-1">{snapshot.phone || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Địa chỉ
                </p>
                <p className="mt-1">{snapshot.address || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Ghi chú
                </p>
                <p className="mt-1">{order.ghi_chu || "—"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Nhân viên xử lý
            </h2>

            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Người đang xử lý
                </p>
                <p className="mt-1 font-medium text-stone-900">
                  {order.nhan_vien_xu_ly?.full_name || "Chưa gán"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Vai trò
                </p>
                <p className="mt-1 capitalize">
                  {order.nhan_vien_xu_ly?.role || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Số điện thoại
                </p>
                <p className="mt-1">{order.nhan_vien_xu_ly?.phone || "—"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Thanh toán
            </h2>

            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-4">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.tong_tien_hang)}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Giảm giá</span>
                <span>{formatCurrency(order.giam_gia)}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.phi_van_chuyen)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                <span>Tổng thanh toán</span>
                <span>{formatCurrency(order.tong_thanh_toan)}</span>
              </div>

              <div className="border-t border-stone-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-stone-500">Phương thức</span>
                  <PaymentMethodBadge method={order.hinh_thuc_thanh_toan} />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-stone-500">Trạng thái</span>
                  <PaymentStatusBadge status={order.trang_thai_thanh_toan} />
                </div>
              </div>

              {(order.ma_tham_chieu_thanh_toan ||
                order.ma_giao_dich_cong ||
                order.ma_ngan_hang ||
                order.ngay_thanh_toan) && (
                <div className="space-y-2 border-t border-stone-200 pt-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-400">
                      Mã tham chiếu thanh toán
                    </p>
                    <p className="mt-1 break-all">
                      {order.ma_tham_chieu_thanh_toan || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-400">
                      Mã giao dịch cổng
                    </p>
                    <p className="mt-1">{order.ma_giao_dich_cong || "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-400">
                      Mã ngân hàng
                    </p>
                    <p className="mt-1">{order.ma_ngan_hang || "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-400">
                      Ngày thanh toán
                    </p>
                    <p className="mt-1">{formatDate(order.ngay_thanh_toan)}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}