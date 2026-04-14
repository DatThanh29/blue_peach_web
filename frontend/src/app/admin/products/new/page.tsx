"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api";

type Category = {
  ma_danh_muc: string;
  ten_danh_muc: string;
};

type CategoryResponse = {
  items: Category[];
};

type ProductForm = {
  sku: string;
  ten_san_pham: string;
  mo_ta_san_pham: string;
  gia_ban: string;
  gia_goc: string;
  so_luong_ton: string;
  primary_image: string;
  url_san_pham: string;
  ma_danh_muc: string;
  trang_thai_hien_thi: boolean;
  is_available: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
};

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>({
    sku: "",
    ten_san_pham: "",
    mo_ta_san_pham: "",
    gia_ban: "",
    gia_goc: "",
    so_luong_ton: "0",
    primary_image: "",
    url_san_pham: "",
    ma_danh_muc: "",
    trang_thai_hien_thi: true,
    is_available: true,
    is_bestseller: false,
    is_on_sale: false,
  });

  useEffect(() => {
    adminFetch("/admin/products/meta/categories")
      .then((res: CategoryResponse) => setCategories(res.items ?? []))
      .catch(() => setCategories([]));
  }, []);

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setError(null);
    setSaving(true);

    try {
      await adminFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          sku: form.sku,
          ten_san_pham: form.ten_san_pham,
          mo_ta_san_pham: form.mo_ta_san_pham || null,
          gia_ban: Number(form.gia_ban || 0),
          gia_goc: form.gia_goc ? Number(form.gia_goc) : null,
          so_luong_ton: Number(form.so_luong_ton || 0),
          primary_image: form.primary_image || null,
          url_san_pham: form.url_san_pham || null,
          ma_danh_muc: form.ma_danh_muc || null,
          trang_thai_hien_thi: form.trang_thai_hien_thi,
          is_available: form.is_available,
          is_bestseller: form.is_bestseller,
          is_on_sale: form.is_on_sale,
        }),
      });

      router.push("/admin/products");
    } catch (e: any) {
      setError(e?.message || "Tạo sản phẩm thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
          Biểu mẫu sản phẩm
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Sản phẩm mới</h1>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">SKU</label>
            <input
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Danh mục
            </label>
            <select
              value={form.ma_danh_muc}
              onChange={(e) => update("ma_danh_muc", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>
                  {cat.ten_danh_muc}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Tên sản phẩm
            </label>
            <input
              value={form.ten_san_pham}
              onChange={(e) => update("ten_san_pham", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={4}
              value={form.mo_ta_san_pham}
              onChange={(e) => update("mo_ta_san_pham", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Giá bán</label>
            <input
              type="number"
              value={form.gia_ban}
              onChange={(e) => update("gia_ban", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Giá gốc</label>
            <input
              type="number"
              value={form.gia_goc}
              onChange={(e) => update("gia_goc", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Số lượng tồn
            </label>
            <input
              type="number"
              value={form.so_luong_ton}
              onChange={(e) => update("so_luong_ton", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              URL ảnh chính
            </label>
            <input
              value={form.primary_image}
              onChange={(e) => update("primary_image", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              URL sản phẩm
            </label>
            <input
              value={form.url_san_pham}
              onChange={(e) => update("url_san_pham", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.trang_thai_hien_thi}
              onChange={(e) => update("trang_thai_hien_thi", e.target.checked)}
            />
            Hiển thị
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) => update("is_available", e.target.checked)}
            />
            Có sẵn
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.is_bestseller}
              onChange={(e) => update("is_bestseller", e.target.checked)}
            />
            Bán chạy
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.is_on_sale}
              onChange={(e) => update("is_on_sale", e.target.checked)}
            />
            Đang giảm giá
          </label>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Tạo sản phẩm"}
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}