"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { CartItem, clearCart, getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneOrderId, setDoneOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.gia_ban) * x.qty, 0),
    [items]
  );

  async function submit() {
    setError(null);

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError("Vui lòng nhập đầy đủ Họ tên / SĐT / Địa chỉ.");
      return;
    }
    if (items.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim() || undefined,
          items: items.map((x) => ({ ma_san_pham: x.ma_san_pham, qty: x.qty })),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Đặt hàng thất bại");

      clearCart();
      setItems([]);
      setDoneOrderId(json.order_id);
    } catch (e: any) {
      setError(e.message ?? "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  if (doneOrderId) {
    return (
      <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
        <h1>✅ Đặt hàng thành công</h1>
        <p>Mã đơn: <b>{doneOrderId}</b></p>
        <a href="/">Về trang chủ</a>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Checkout</h1>
      <a href="/cart">← Quay lại giỏ</a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <h3>Thông tin nhận hàng</h3>

          <label>Họ tên</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", margin: "6px 0 12px" }} />

          <label>Số điện thoại</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", margin: "6px 0 12px" }} />

          <label>Địa chỉ</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", margin: "6px 0 12px" }} />

          <label>Ghi chú</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", margin: "6px 0 12px" }} />

          {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

          <button
            disabled={loading}
            onClick={submit}
            style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #ddd" }}
          >
            {loading ? "Đang đặt..." : "Đặt hàng (COD)"}
          </button>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <h3>Đơn hàng</h3>
          {items.length === 0 ? (
            <p>Giỏ hàng trống.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((x) => (
                <div key={x.ma_san_pham} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ maxWidth: 320 }}>
                    {x.ten_san_pham} <span style={{ opacity: 0.7 }}>x{x.qty}</span>
                  </div>
                  <div>{(Number(x.gia_ban) * x.qty).toLocaleString("vi-VN")}đ</div>
                </div>
              ))}

              <hr />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
                <b>Tổng</b>
                <b>{total.toLocaleString("vi-VN")}đ</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
