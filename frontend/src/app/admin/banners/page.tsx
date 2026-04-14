"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, adminFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type BannerItem = {
  ma_banner: string;
  vi_tri: string;
  tieu_de?: string | null;
  mo_ta_ngan?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url: string;
  thu_tu: number;
  trang_thai_hien_thi: boolean;
  ngay_tao?: string | null;
};

type BannerListResponse = {
  items: BannerItem[];
};

const emptyForm = {
  vi_tri: "home_hero",
  tieu_de: "",
  mo_ta_ngan: "",
  cta_text: "",
  cta_link: "",
  image_url: "",
  thu_tu: 1,
  trang_thai_hien_thi: true,
};

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

export default function AdminBannersPage() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadBanners() {
    try {
      setLoading(true);
      setError(null);
      const res = (await adminFetch("/admin/banners")) as BannerListResponse;
      setItems(res.items ?? []);
    } catch (err: any) {
      setError(err?.message || "Không tải được danh sách banner.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  async function handleUpload(file: File) {
    try {
      setUploading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/admin/upload?folder=banners`, {
        method: "POST",
        headers: {
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload banner thất bại.");
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.url,
      }));
    } catch (err: any) {
      setError(err?.message || "Upload banner thất bại.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        thu_tu: Number(form.thu_tu || 1),
      };

      if (editingId) {
        await adminFetch(`/admin/banners/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/admin/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadBanners();
    } catch (err: any) {
      setError(err?.message || "Lưu banner thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Bạn có chắc muốn xóa banner này?");
    if (!ok) return;

    try {
      setError(null);
      await adminFetch(`/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadBanners();
    } catch (err: any) {
      setError(err?.message || "Xóa banner thất bại.");
    }
  }

  function handleEdit(item: BannerItem) {
    setEditingId(item.ma_banner);
    setForm({
      vi_tri: item.vi_tri || "home_hero",
      tieu_de: item.tieu_de || "",
      mo_ta_ngan: item.mo_ta_ngan || "",
      cta_text: item.cta_text || "",
      cta_link: item.cta_link || "",
      image_url: item.image_url || "",
      thu_tu: item.thu_tu || 1,
      trang_thai_hien_thi: Boolean(item.trang_thai_hien_thi),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Banners</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Quản lý banner cho HomeCampaign ở trang chủ.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">
              {editingId ? "Chỉnh sửa banner" : "Tạo banner mới"}
            </h2>

            {editingId ? (
              <button
                onClick={handleReset}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Hủy chỉnh sửa
              </button>
            ) : null}
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tiêu đề
              </label>
              <input
                value={form.tieu_de}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tieu_de: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="Everyday shine, refined."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Mô tả ngắn
              </label>
              <textarea
                rows={4}
                value={form.mo_ta_ngan}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, mo_ta_ngan: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="Mô tả ngắn cho banner..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  CTA text
                </label>
                <input
                  value={form.cta_text}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cta_text: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Shop now"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  CTA link
                </label>
                <input
                  value={form.cta_link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cta_link: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="/products"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Vị trí
                </label>
                <select
                  value={form.vi_tri}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, vi_tri: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                >
                  <option value="home_hero">Home Hero</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Thứ tự
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.thu_tu}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      thu_tu: Number(e.target.value || 1),
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={form.trang_thai_hien_thi}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        trang_thai_hien_thi: e.target.checked,
                      }))
                    }
                  />
                  Hiển thị
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Ảnh banner
              </label>

              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  className="block w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm"
                />

                {uploading ? (
                  <div className="text-sm text-zinc-500">Đang upload ảnh...</div>
                ) : null}

                {form.image_url ? (
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                    <img
                      src={form.image_url}
                      alt="Banner preview"
                      className="h-[220px] w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploading || !form.image_url}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật banner"
                : "Tạo banner"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">
              Danh sách banner
            </h2>
            <button
              onClick={loadBanners}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Tải lại
            </button>
          </div>

          {loading ? (
            <div className="mt-5 text-sm text-zinc-500">Đang tải banner...</div>
          ) : items.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
              Chưa có banner nào.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.ma_banner}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                >
                  <img
                    src={item.image_url}
                    alt={item.tieu_de || "Banner"}
                    className="h-[180px] w-full object-cover"
                  />

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                          {item.vi_tri}
                        </div>
                        <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                          {item.tieu_de || "Banner không tiêu đề"}
                        </h3>
                      </div>

                      <span
                        className={[
                          "rounded-full border px-3 py-1 text-xs font-semibold",
                          item.trang_thai_hien_thi
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-zinc-200 bg-zinc-100 text-zinc-600",
                        ].join(" ")}
                      >
                        {item.trang_thai_hien_thi ? "Đang hiển thị" : "Đã ẩn"}
                      </span>
                    </div>

                    {item.mo_ta_ngan ? (
                      <p className="text-sm leading-6 text-zinc-600">
                        {item.mo_ta_ngan}
                      </p>
                    ) : null}

                    <div className="grid gap-2 text-xs text-zinc-500 md:grid-cols-2">
                      <div>Thứ tự: {item.thu_tu}</div>
                      <div>Tạo lúc: {formatDate(item.ngay_tao)}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Chỉnh sửa
                      </button>

                      <button
                        onClick={() => handleDelete(item.ma_banner)}
                        className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}