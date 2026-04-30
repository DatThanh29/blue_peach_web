"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, API_BASE_URL } from "@/lib/api";
import { formatShortCode } from "@/utils/formatCode";
import { supabase } from "@/lib/supabase";

type Category = {
  ma_danh_muc: string;
  ten_danh_muc: string;
};

type ProductDetail = {
  ma_san_pham: string;
  sku: string;
  ten_san_pham: string;
  mo_ta_san_pham?: string | null;
  gia_ban: number;
  gia_goc?: number | null;
  so_luong_ton: number;
  primary_image?: string | null;
  url_san_pham?: string | null;
  ma_danh_muc?: string | null;
  trang_thai_hien_thi: boolean;
  is_available: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
};

type ProductImage = {
  ma_hinh_anh: string;
  ma_san_pham: string;
  duong_dan_anh: string;
  la_anh_chinh: boolean;
  thu_tu: number;
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

export default function AdminProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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

  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mainPreviewIndex, setMainPreviewIndex] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
    setMainPreviewIndex(0);
  }

  async function uploadSingleImage(file: File) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/admin/upload?folder=products`, {
      method: "POST",
      headers: {
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error || "Upload image failed");
    }

    return json.url as string;
  }

  async function handleUploadSelectedImages() {
    if (!id || selectedFiles.length === 0) return;

    try {
      setUploadingImages(true);
      setError(null);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = await uploadSingleImage(file);

        await adminFetch("/admin/product-images", {
          method: "POST",
          body: JSON.stringify({
            ma_san_pham: id,
            duong_dan_anh: url,
            la_anh_chinh: i === mainPreviewIndex,
          }),
        });
      }

      setSelectedFiles([]);
      setPreviewUrls([]);
      setMainPreviewIndex(0);

      await loadImages();
    } catch (e: any) {
      setError(e?.message || "Upload ảnh thất bại.");
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    const confirmed = window.confirm("Xóa ảnh này?");
    if (!confirmed) return;

    try {
      setError(null);

      await adminFetch(`/admin/product-images/${imageId}`, {
        method: "DELETE",
      });

      await loadImages();
    } catch (e: any) {
      setError(e?.message || "Xóa ảnh thất bại.");
    }
  }

  async function handleSetPrimaryImage(imageId: string) {
    try {
      setError(null);

      await adminFetch(`/admin/product-images/${imageId}/set-primary`, {
        method: "PATCH",
      });

      await Promise.all([loadImages(), load()]);
    } catch (e: any) {
      setError(e?.message || "Đặt ảnh chính thất bại.");
    }
  }

  async function loadImages() {
    if (!id) return;

    try {
      setImagesLoading(true);

      const res = await adminFetch(`/admin/product-images/${id}`);
      setImages(res.items ?? []);
    } catch (e) {
      console.error("Load product images failed:", e);
      setImages([]);
    } finally {
      setImagesLoading(false);
    }
  }

  async function load() {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [product, categoryRes] = await Promise.all([
        adminFetch(`/admin/products/${id}`) as Promise<ProductDetail>,
        adminFetch("/admin/products/meta/categories") as Promise<CategoryResponse>,
      ]);

      setCategories(categoryRes.items ?? []);
      setForm({
        sku: product.sku || "",
        ten_san_pham: product.ten_san_pham || "",
        mo_ta_san_pham: product.mo_ta_san_pham || "",
        gia_ban: String(product.gia_ban ?? ""),
        gia_goc: product.gia_goc ? String(product.gia_goc) : "",
        so_luong_ton: String(product.so_luong_ton ?? 0),
        primary_image: product.primary_image || "",
        url_san_pham: product.url_san_pham || "",
        ma_danh_muc: product.ma_danh_muc || "",
        trang_thai_hien_thi: !!product.trang_thai_hien_thi,
        is_available: !!product.is_available,
        is_bestseller: !!product.is_bestseller,
        is_on_sale: !!product.is_on_sale,
      });
    } catch (e: any) {
      setError(e?.message || "Không tải được sản phẩm.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadImages();
  }, [id]);

  async function submit() {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await adminFetch(`/admin/products/${id}`, {
        method: "PATCH",
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
      setError(e?.message || "Cập nhật sản phẩm thất bại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
          Product Form
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Edit Product</h1>
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
              Category
            </label>
            <select
              value={form.ma_danh_muc}
              onChange={(e) => update("ma_danh_muc", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              <option value="">Chọn category</option>
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
              Primary image URL
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

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">Product Images</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Upload nhiều ảnh cho sản phẩm và chọn ảnh chính.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSelectImages}
                  className="block w-full text-sm text-zinc-700"
                />
              </div>

              {previewUrls.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Ảnh sắp upload
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {previewUrls.map((url, index) => (
                      <button
                        key={`${url}-${index}`}
                        type="button"
                        onClick={() => setMainPreviewIndex(index)}
                        className={[
                          "overflow-hidden rounded-xl border bg-white p-2 text-left transition",
                          mainPreviewIndex === index
                            ? "border-zinc-900"
                            : "border-zinc-200 hover:border-zinc-400",
                        ].join(" ")}
                      >
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          className="h-28 w-full rounded-lg object-cover"
                        />
                        <p className="mt-2 text-xs text-zinc-600">
                          {mainPreviewIndex === index ? "Main image" : "Click để chọn ảnh chính"}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleUploadSelectedImages}
                      disabled={uploadingImages}
                      className="rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                    >
                      {uploadingImages ? "Đang upload..." : "Upload selected images"}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Ảnh hiện tại
                </p>

                {imagesLoading ? (
                  <p className="text-sm text-zinc-500">Đang tải ảnh...</p>
                ) : images.length === 0 ? (
                  <p className="text-sm text-zinc-500">Chưa có ảnh nào trong gallery.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
                    {images.map((img) => (
                      <div
                        key={img.ma_hinh_anh}
                        className={[
                          "overflow-hidden rounded-2xl border bg-white p-2 shadow-sm transition",
                          img.la_anh_chinh
                            ? "border-zinc-900 ring-1 ring-zinc-900/10"
                            : "border-zinc-200",
                        ].join(" ")}
                      >
                        <div className="relative">
                          <img
                            src={img.duong_dan_anh}
                            alt="product"
                            className="h-32 w-full rounded-xl object-cover"
                          />

                          {img.la_anh_chinh ? (
                            <span className="absolute left-2 top-2 inline-flex rounded-full bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white">
                              Primary
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="text-[11px] text-zinc-500">
                            Thứ tự: {img.thu_tu ?? 0}
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(img.ma_hinh_anh)}
                              disabled={img.la_anh_chinh}
                              className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {img.la_anh_chinh ? "Đang là ảnh chính" : "Set primary"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteImage(img.ma_hinh_anh)}
                              className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
            Best seller
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.is_on_sale}
              onChange={(e) => update("is_on_sale", e.target.checked)}
            />
            On sale
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
            {saving ? "Đang lưu..." : "Save Changes"}
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}