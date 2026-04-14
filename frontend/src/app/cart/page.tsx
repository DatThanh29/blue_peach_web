"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const VAT_RATE = 0.1; // 10% VAT
const SHIPPING_COST = 30000; // 30k shipping

export default function CartPage() {
  const { items, updateItemQty, removeItemById } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.gia_ban) * item.qty,
    0
  );
  const vat = subtotal * VAT_RATE;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const grandTotal = subtotal + vat + shipping;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-zinc-200">
        <div className="bp-container py-6">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Tiếp tục mua
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Giỏ hàng</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bp-container py-16 text-center">
          <p className="text-lg text-zinc-600">Giỏ hàng đang trống.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="bp-container grid grid-cols-3 gap-10 py-12">
          {/* Left - Danh sách sản phẩm */}
          <div className="col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.ma_san_pham}
                className="flex gap-6 border-b border-zinc-200 pb-6"
              >
                {/* Ảnh sản phẩm */}
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                  {item.primary_image ? (
                    <img
                      src={item.primary_image}
                      alt={item.ten_san_pham}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {item.ten_san_pham}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {Number(item.gia_ban).toLocaleString("vi-VN")}đ
                  </p>

                  {/* Quantity controls */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => updateItemQty(item.ma_san_pham, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-zinc-300 text-sm hover:bg-zinc-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateItemQty(item.ma_san_pham, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-zinc-300 text-sm hover:bg-zinc-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {(Number(item.gia_ban) * item.qty).toLocaleString("vi-VN")}đ
                    </span>
                    <button
                      onClick={() => removeItemById(item.ma_san_pham)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Order Summary */}
          <div className="col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-zinc-600">Tạm tính</span>
                <span className="font-semibold text-zinc-900">
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* VAT */}
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-zinc-600">VAT (10%)</span>
                <span className="font-semibold text-zinc-900">
                  {vat.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-4 text-sm pb-4 border-b border-zinc-300">
                <span className="text-zinc-600">Vận chuyển</span>
                <span className="font-semibold text-zinc-900">
                  {shipping.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between mb-8">
                <span className="font-semibold text-zinc-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-zinc-900">
                  {grandTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full rounded-xl bg-zinc-900 py-3 text-center font-semibold text-white hover:bg-zinc-800 transition"
              >
                Tiến hành thanh toán
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="mt-3 block w-full rounded-xl border border-zinc-300 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

