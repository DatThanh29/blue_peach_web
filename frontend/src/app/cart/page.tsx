"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItem, getCart, updateQty, removeItem, clearCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.gia_ban) * x.qty, 0),
    [items]
  );

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Giỏ hàng</h1>
      <a href="/">← Tiếp tục mua</a>

      {items.length === 0 ? (
        <p style={{ marginTop: 16 }}>Giỏ hàng đang trống.</p>
      ) : (
        <>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {items.map((x) => (
              <div
                key={x.ma_san_pham}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 140px 120px 90px",
                  gap: 12,
                  alignItems: "center",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", background: "#fafafa" }}>
                  {x.primary_image ? (
                    <img
                      src={x.primary_image}
                      alt={x.ten_san_pham}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>{x.ten_san_pham}</div>
                  <div style={{ opacity: 0.7 }}>
                    {Number(x.gia_ban).toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      const next = updateQty(x.ma_san_pham, x.qty - 1);
                      setItems(next);
                    }}
                  >
                    -
                  </button>
                  <span style={{ margin: "0 10px" }}>{x.qty}</span>
                  <button
                    onClick={() => {
                      const next = updateQty(x.ma_san_pham, x.qty + 1);
                      setItems(next);
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ textAlign: "right" }}>
                  {(Number(x.gia_ban) * x.qty).toLocaleString("vi-VN")}đ
                </div>

                <button
                  onClick={() => {
                    const next = removeItem(x.ma_san_pham);
                    setItems(next);
                  }}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => {
                clearCart();
                setItems([]);
              }}
            >
              Xóa giỏ
            </button>

            <div style={{ fontSize: 18 }}>
              <b>Tổng: {total.toLocaleString("vi-VN")}đ</b>
            </div>
          </div>

          <a
            href="/checkout"
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Đặt hàng →
          </a>
        </>
      )}
    </main>
  );
}

