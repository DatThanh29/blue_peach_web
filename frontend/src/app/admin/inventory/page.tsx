"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api";

type InventoryItem = {
  ma_san_pham: string;
  sku: string;
  ten_san_pham: string;
  so_luong_ton: number;
  is_available: boolean;
  trang_thai_hien_thi: boolean;
  primary_image?: string | null;
  ngay_cap_nhat?: string | null;
};

type MovementItem = {
  ma_bien_dong: string;
  ma_san_pham: string;
  loai_bien_dong: "initial_stock" | "manual_adjust" | "order_deduct" | "cancel_refund";
  so_luong_thay_doi: number;
  so_luong_truoc: number;
  so_luong_sau: number;
  ghi_chu?: string | null;
  ngay_tao?: string | null;
  products?: {
    ten_san_pham?: string | null;
    sku?: string | null;
  } | null;
  nguoi_thuc_hien?: {
    full_name?: string | null;
    role?: string | null;
  } | null;
};

const LOW_STOCK_THRESHOLD = 5;

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function movementLabel(type: string) {
  const map: Record<string, string> = {
    initial_stock: "Khởi tạo tồn",
    manual_adjust: "Điều chỉnh tay",
    order_deduct: "Trừ do đơn hàng",
    cancel_refund: "Hoàn kho",
  };
  return map[type] || type;
}

export default function AdminInventoryPage() {
  const [q, setQ] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<MovementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [movementLoading, setMovementLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [adjustMode, setAdjustMode] = useState<"absolute" | "delta">("absolute");
  const [soLuongMoi, setSoLuongMoi] = useState("");
  const [soLuongThayDoi, setSoLuongThayDoi] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (stockFilter !== "all") params.set("stock", stockFilter);

      const res = await adminFetch(`/admin/inventory?${params.toString()}`);
      setItems(res.items ?? []);
    } catch (err: any) {
      setError(err?.message || "Không tải được dữ liệu kho.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMovements() {
    try {
      setMovementLoading(true);
      const res = await adminFetch("/admin/inventory/movements?limit=20");
      setMovements(res.items ?? []);
    } catch (err: any) {
      setError(err?.message || "Không tải được lịch sử kho.");
    } finally {
      setMovementLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      loadInventory();
    }, 200);
    return () => clearTimeout(t);
  }, [q, stockFilter]);

  useEffect(() => {
    loadMovements();
  }, []);

  const summary = useMemo(() => {
    const total = items.length;
    const out = items.filter((item) => Number(item.so_luong_ton) === 0).length;
    const low = items.filter(
      (item) =>
        Number(item.so_luong_ton) > 0 &&
        Number(item.so_luong_ton) <= LOW_STOCK_THRESHOLD
    ).length;

    return { total, out, low };
  }, [items]);

  function openAdjust(product: InventoryItem) {
    setSelectedProduct(product);
    setAdjustMode("absolute");
    setSoLuongMoi(String(product.so_luong_ton ?? 0));
    setSoLuongThayDoi("");
    setGhiChu("");
  }

  function closeAdjust() {
    setSelectedProduct(null);
    setSoLuongMoi("");
    setSoLuongThayDoi("");
    setGhiChu("");
  }

  async function submitAdjust() {
    if (!selectedProduct) return;

    try {
      setSaving(true);
      setError(null);

      const payload =
        adjustMode === "absolute"
          ? {
              so_luong_moi: Number(soLuongMoi || 0),
              ghi_chu: ghiChu || null,
            }
          : {
              so_luong_thay_doi: Number(soLuongThayDoi || 0),
              ghi_chu: ghiChu || null,
            };

      await adminFetch(`/admin/inventory/${selectedProduct.ma_san_pham}/adjust`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      closeAdjust();
      await Promise.all([loadInventory(), loadMovements()]);
    } catch (err: any) {
      setError(err?.message || "Điều chỉnh kho thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Tồn kho</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Theo dõi tồn kho, điều chỉnh số lượng và xem lịch sử biến động.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Tổng sản phẩm
          </div>
          <div className="mt-3 text-3xl font-semibold text-zinc-900">
            {summary.total}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.18em] text-amber-600">
            Tồn thấp
          </div>
          <div className="mt-3 text-3xl font-semibold text-amber-700">
            {summary.low}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.18em] text-rose-600">
            Hết hàng
          </div>
          <div className="mt-3 text-3xl font-semibold text-rose-700">
            {summary.out}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Tồn kho sản phẩm</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Lọc theo tên, SKU và trạng thái tồn kho.
              </p>
            </div>

            <button
              onClick={loadInventory}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Tải lại
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU..."
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            >
              <option value="all">Tất cả tồn kho</option>
              <option value="low">Tồn thấp</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="text-sm text-zinc-500">Đang tải dữ liệu kho...</div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
                Không có sản phẩm phù hợp.
              </div>
            ) : (
              items.map((item) => {
                const stock = Number(item.so_luong_ton || 0);
                const isOut = stock === 0;
                const isLow = stock > 0 && stock <= LOW_STOCK_THRESHOLD;

                return (
                  <div
                    key={item.ma_san_pham}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
                        {item.primary_image ? (
                          <img
                            src={item.primary_image}
                            alt={item.ten_san_pham}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-zinc-400">Chưa có ảnh</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900">
                          {item.ten_san_pham}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          SKU: {item.sku || "-"}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={[
                              "rounded-full border px-2.5 py-1 text-xs font-semibold",
                              isOut
                                ? "border-rose-200 bg-rose-50 text-rose-700"
                                : isLow
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            ].join(" ")}
                          >
                            {isOut ? "Hết hàng" : isLow ? "Tồn thấp" : "Còn hàng"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:min-w-[240px] md:justify-end">
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                          Tồn kho
                        </div>
                        <div className="mt-1 text-2xl font-semibold text-zinc-900">
                          {stock}
                        </div>
                      </div>

                      <button
                        onClick={() => openAdjust(item)}
                        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Điều chỉnh
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Lịch sử biến động kho
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                20 thay đổi gần nhất của tồn kho.
              </p>
            </div>

            <button
              onClick={loadMovements}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Tải lại
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {movementLoading ? (
              <div className="text-sm text-zinc-500">Đang tải lịch sử kho...</div>
            ) : movements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
                Chưa có biến động kho nào.
              </div>
            ) : (
              movements.map((mv) => (
                <div
                  key={mv.ma_bien_dong}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {mv.products?.ten_san_pham || mv.ma_san_pham}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        SKU: {mv.products?.sku || "-"}
                      </div>
                    </div>

                    <div
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        mv.so_luong_thay_doi > 0
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : mv.so_luong_thay_doi < 0
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-zinc-200 bg-zinc-100 text-zinc-600",
                      ].join(" ")}
                    >
                      {mv.so_luong_thay_doi > 0 ? "+" : ""}
                      {mv.so_luong_thay_doi}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                    <div>
                      Loại: <strong>{movementLabel(mv.loai_bien_dong)}</strong>
                    </div>
                    <div>
                      Từ <strong>{mv.so_luong_truoc}</strong> →{" "}
                      <strong>{mv.so_luong_sau}</strong>
                    </div>
                    <div>
                      Người thực hiện:{" "}
                      <strong>{mv.nguoi_thuc_hien?.full_name || "Hệ thống"}</strong>
                    </div>
                    <div>Thời gian: {formatDate(mv.ngay_tao)}</div>
                    {mv.ghi_chu ? <div>Ghi chú: {mv.ghi_chu}</div> : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900">
                  Điều chỉnh tồn kho
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {selectedProduct.ten_san_pham} — hiện tại:{" "}
                  <strong>{selectedProduct.so_luong_ton}</strong>
                </p>
              </div>

              <button
                onClick={closeAdjust}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Đóng
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700">
                  <input
                    type="radio"
                    checked={adjustMode === "absolute"}
                    onChange={() => setAdjustMode("absolute")}
                  />
                  Nhập số lượng mới
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700">
                  <input
                    type="radio"
                    checked={adjustMode === "delta"}
                    onChange={() => setAdjustMode("delta")}
                  />
                  Cộng / trừ theo chênh lệch
                </label>
              </div>

              {adjustMode === "absolute" ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Số lượng tồn mới
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={soLuongMoi}
                    onChange={(e) => setSoLuongMoi(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Số lượng thay đổi
                  </label>
                  <input
                    type="number"
                    value={soLuongThayDoi}
                    onChange={(e) => setSoLuongThayDoi(e.target.value)}
                    placeholder="Ví dụ: 10 hoặc -3"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  placeholder="Ví dụ: nhập hàng mới, kiểm kho cuối ngày..."
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeAdjust}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Hủy
              </button>

              <button
                onClick={submitAdjust}
                disabled={saving}
                className="rounded-xl bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu điều chỉnh"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}