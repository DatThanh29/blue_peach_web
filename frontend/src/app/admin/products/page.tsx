"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/api";

type Category = {
  ma_danh_muc: string;
  ten_danh_muc: string;
};

type Product = {
  ma_san_pham: string;
  sku: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number | null;
  phan_tram_giam?: number | null;
  so_luong_ton: number;
  primary_image?: string | null;
  ma_danh_muc?: string | null;
  trang_thai_hien_thi: boolean;
  is_available: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
  categories?: Category | null;
};

type ProductListResponse = {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
};

type CategoryResponse = {
  items: Category[];
};

const LOW_STOCK_THRESHOLD = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function BoolBadge({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        value
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600",
      ].join(" ")}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        Hết hàng
      </span>
    );
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Tồn thấp
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      Còn hàng
    </span>
  );
}

export default function AdminProductsPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const q = sp.get("q") ?? "";
  const categoryId = sp.get("categoryId") ?? "";
  const visible = sp.get("visible") ?? "all";
  const stock = sp.get("stock") ?? "all";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = 12;
  const offset = useMemo(() => (page - 1) * limit, [page]);

  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [isComposing, setIsComposing] = useState(false);

  function setQuery(
    next: Partial<{
      q: string;
      categoryId: string;
      visible: string;
      stock: string;
      page: number;
    }>
  ) {
    const params = new URLSearchParams(sp.toString());
    if (next.q !== undefined) params.set("q", next.q);
    if (next.categoryId !== undefined) {
      if (next.categoryId) params.set("categoryId", next.categoryId);
      else params.delete("categoryId");
    }
    if (next.visible !== undefined) params.set("visible", next.visible);
    if (next.stock !== undefined) params.set("stock", next.stock);
    if (next.page !== undefined) params.set("page", String(next.page));
    router.push(`/admin/products?${params.toString()}`);
  }

  async function loadCategories() {
    const res = (await adminFetch("/admin/products/meta/categories")) as CategoryResponse;
    setCategories(res.items ?? []);
  }

  async function loadProducts() {
    setLoading(true);
    setErr(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (q.trim()) params.set("q", q.trim());
      if (categoryId) params.set("categoryId", categoryId);
      if (visible !== "all") params.set("visible", visible);
      if (stock !== "all") params.set("stock", stock);

      const res = (await adminFetch(
        `/admin/products?${params.toString()}`
      )) as ProductListResponse;

      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e: any) {
      setErr(e?.message ?? "Không tải được danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }

  async function softDelete(id: string) {
    const confirmed = window.confirm("Ẩn sản phẩm này khỏi storefront?");
    if (!confirmed) return;

    try {
      await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
      await loadProducts();
    } catch (e: any) {
      alert(e?.message ?? "Xóa sản phẩm thất bại.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

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

  useEffect(() => {
    const t = setTimeout(() => {
      loadProducts();
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoryId, visible, stock, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-sm text-zinc-500">
            Quản lý danh sách sản phẩm, tạo mới, chỉnh sửa, cảnh báo tồn kho và ẩn khỏi website.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + Sản phẩm mới
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-5">
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
            placeholder="Tìm theo tên, SKU..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Danh mục</div>
          <select
            value={categoryId}
            onChange={(e) => setQuery({ categoryId: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>
                {cat.ten_danh_muc}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Hiển thị</div>
          <select
            value={visible}
            onChange={(e) => setQuery({ visible: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <option value="all">Tất cả</option>
            <option value="true">Đang hiển thị</option>
            <option value="false">Đã ẩn</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Tồn kho</div>
          <select
            value={stock}
            onChange={(e) => setQuery({ stock: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <option value="all">Tất cả tồn kho</option>
            <option value="low">Tồn thấp</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {err}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-500">
          Tổng: <span className="font-semibold text-zinc-900">{total}</span> sản phẩm
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-600">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Tồn kho</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.ma_san_pham}
                  className={[
                    "border-t border-zinc-100",
                    p.so_luong_ton === 0
                      ? "bg-rose-50/40"
                      : p.so_luong_ton <= LOW_STOCK_THRESHOLD
                      ? "bg-amber-50/40"
                      : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                        {p.primary_image ? (
                          <img
                            src={p.primary_image}
                            alt={p.ten_san_pham}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-zinc-400">No image</span>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-zinc-900">{p.ten_san_pham}</div>
                        <div className="text-xs text-zinc-500">SKU: {p.sku || "-"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-zinc-600">
                    {p.categories?.ten_danh_muc || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900">
                      {formatCurrency(p.gia_ban)}
                    </div>
                    {p.gia_goc ? (
                      <div className="text-xs text-zinc-500">
                        Gốc: {formatCurrency(p.gia_goc)}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900">{p.so_luong_ton}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <BoolBadge
                        value={p.is_available}
                        trueLabel="Còn hàng"
                        falseLabel="Hết hàng"
                      />
                      <StockBadge stock={p.so_luong_ton} />
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <BoolBadge
                        value={p.trang_thai_hien_thi}
                        trueLabel="Hiển thị"
                        falseLabel="Đã ẩn"
                      />
                      <BoolBadge
                        value={p.is_bestseller}
                        trueLabel="Bán chạy"
                        falseLabel="Thường"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.ma_san_pham}`}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => softDelete(p.ma_san_pham)}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Ẩn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

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