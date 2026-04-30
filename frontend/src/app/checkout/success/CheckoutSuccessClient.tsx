"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { authFetch } from "@/lib/api";
import { formatShortCode } from "@/utils/formatCode";

type PaymentMethod = "cod" | "vnpay";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function paymentLabel(method: PaymentMethod) {
  if (method === "cod") return "Thanh toán khi nhận hàng";
  return "Thanh toán VNPay";
}

function paymentMessage(method: PaymentMethod, status: string) {
  if (method === "cod") {
    return "Bạn sẽ thanh toán khi nhận hàng.";
  }

  if (status === "success") {
    return "Thanh toán VNPay đã được ghi nhận thành công.";
  }

  if (status === "failed") {
    return "Thanh toán VNPay chưa thành công. Bạn có thể thử lại hoặc chọn phương thức khác.";
  }

  if (status === "error") {
    return "Có lỗi xảy ra khi xử lý kết quả thanh toán VNPay.";
  }

  return "Đang chờ xác nhận thanh toán.";
}

function titleByStatus(payment: PaymentMethod, status: string) {
  if (payment === "vnpay") {
    if (status === "failed") return "Thanh toán chưa thành công";
    if (status === "error") return "Có lỗi thanh toán";
  }

  return "Đặt hàng thành công";
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("order_id") ||
    searchParams.get("vnp_TxnRef") ||
    "";

  const payment = (searchParams.get("payment") || "cod") as PaymentMethod;

  const totalFromQuery = Number(
    searchParams.get("amount") ||
      searchParams.get("total") ||
      searchParams.get("vnp_Amount") ||
      0
  );

  const normalizedTotal =
    searchParams.get("vnp_Amount") ? totalFromQuery / 100 : totalFromQuery;

  const status = searchParams.get("status") || "success";
  const code = searchParams.get("code") || "";
  const message = searchParams.get("message") || "";

  const [orderCode, setOrderCode] = useState<string>(orderId || "—");
  const [totalAmount, setTotalAmount] = useState<number>(normalizedTotal);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (payment === "cod") {
      clearCart();
      return;
    }

    if (payment === "vnpay" && status === "success") {
      clearCart();
    }
  }, [payment, status]);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await authFetch(`/orders/${orderId}`);

        const order = data?.order || data;
        setOrder(order || null);

        if (cancelled) return;

        setOrderCode(order?.ma_don_hang || orderId || "—");
        setTotalAmount(Number(order?.tong_thanh_toan || normalizedTotal || 0));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch order details:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, normalizedTotal]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
          Blue Peach Checkout
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-stone-900">
          {titleByStatus(payment, status)}
        </h1>

        <p className="mt-3 text-sm leading-6 text-stone-600">
          Cảm ơn bạn đã đặt hàng tại Blue Peach. Vui lòng kiểm tra thông tin đơn
          hàng và trạng thái thanh toán bên dưới.
        </p>

        <div className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm text-stone-700">
          <p>
            Mã đơn hàng:{" "}
            <span className="font-medium text-stone-900">
              {formatShortCode(order?.ma_don_hang || orderId, "#", 8)}
            </span>
          </p>
          <p className="mt-2">
            Phương thức thanh toán:{" "}
            <span className="font-medium text-stone-900">
              {paymentLabel(payment)}
            </span>
          </p>
          <p className="mt-2">
            Tổng thanh toán:{" "}
            <span className="font-medium text-stone-900">
              {formatCurrency(totalAmount)}
            </span>
          </p>
          {payment === "vnpay" && code ? (
            <p className="mt-2">
              Mã phản hồi VNPay:{" "}
              <span className="font-medium text-stone-900">{code}</span>
            </p>
          ) : null}
        </div>

        <div
          className={[
            "mt-6 rounded-2xl border p-5 text-sm",
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : status === "failed"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-rose-200 bg-rose-50 text-rose-800",
          ].join(" ")}
        >
          {message || paymentMessage(payment, status)}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Về trang chủ
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Tiếp tục mua sắm
          </Link>

          <Link
            href="/account/orders"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    </main>
  );
}