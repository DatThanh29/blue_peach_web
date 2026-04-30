"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type NewsItem = {
  ma_bai_viet: string;
  slug: string;
  tieu_de: string;
  tom_tat?: string | null;
  noi_dung: string;
  anh_bia?: string | null;
  danh_muc: string;
  tac_gia: string;
  trang_thai: "draft" | "published";
  noi_bat: boolean;
  luot_xem: number;
  ngay_dang?: string | null;
  ngay_tao?: string | null;
};

type NewsListResponse = {
  items: NewsItem[];
  total: number;
};

const emptyForm = {
  tieu_de: "",
  slug: "",
  tom_tat: "",
  noi_dung: "",
  anh_bia: "",
  danh_muc: "Tin tức",
  tac_gia: "Blue Peach",
  trang_thai: "draft" as "draft" | "published",
  noi_bat: false,
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "published";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        published
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-600",
      ].join(" ")}
    >
      {published ? "Đã xuất bản" : "Bản nháp"}
    </span>
  );
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadNews() {
    try {
      setLoading(true);
      setErr(null);

      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("offset", "0");
      if (status !== "all") params.set("status", status);
      if (q.trim()) params.set("q", q.trim());

      const res = (await adminFetch(`/admin/news?${params.toString()}`)) as NewsListResponse;
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (error: any) {
      setErr(error?.message || "Không tải được danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      void loadNews();
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setErr(null);
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item.ma_bai_viet);
    setForm({
      tieu_de: item.tieu_de || "",
      slug: item.slug || "",
      tom_tat: item.tom_tat || "",
      noi_dung: item.noi_dung || "",
      anh_bia: item.anh_bia || "",
      danh_muc: item.danh_muc || "Tin tức",
      tac_gia: item.tac_gia || "Blue Peach",
      trang_thai: item.trang_thai || "draft",
      noi_bat: Boolean(item.noi_bat),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setErr(null);

      const payload = {
        ...form,
        tieu_de: form.tieu_de.trim(),
        slug: form.slug.trim(),
        tom_tat: form.tom_tat.trim(),
        noi_dung: form.noi_dung.trim(),
        anh_bia: form.anh_bia.trim(),
        danh_muc: form.danh_muc.trim() || "Tin tức",
        tac_gia: form.tac_gia.trim() || "Blue Peach",
      };

      if (!payload.tieu_de) throw new Error("Vui lòng nhập tiêu đề.");
      if (!payload.noi_dung) throw new Error("Vui lòng nhập nội dung.");

      if (editingId) {
        await adminFetch(`/admin/news/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/admin/news", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadNews();
    } catch (error: any) {
      setErr(error?.message || "Lưu bài viết thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!ok) return;

    try {
      setErr(null);
      await adminFetch(`/admin/news/${id}`, { method: "DELETE" });
      if (editingId === id) resetForm();
      await loadNews();
    } catch (error: any) {
      setErr(error?.message || "Xóa bài viết thất bại.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <button
          onClick={resetForm}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          + Tạo bài mới
        </button>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {err}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">
              {editingId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>

            {editingId ? (
              <button
                onClick={resetForm}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                Hủy
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
                onChange={(e) => setForm((prev) => ({ ...prev, tieu_de: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="Ví dụ: Trang sức bạc có bị đen không?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="Tự tạo nếu để trống"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Danh mục
                </label>
                <input
                  value={form.danh_muc}
                  onChange={(e) => setForm((prev) => ({ ...prev, danh_muc: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Phong cách"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Tác giả
                </label>
                <input
                  value={form.tac_gia}
                  onChange={(e) => setForm((prev) => ({ ...prev, tac_gia: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Blue Peach"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Ảnh bìa URL
              </label>
              <input
                value={form.anh_bia}
                onChange={(e) => setForm((prev) => ({ ...prev, anh_bia: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="/news/news1.jpg hoặc URL ảnh"
              />
            </div>

            {form.anh_bia ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                <img
                  src={form.anh_bia}
                  alt="Preview"
                  className="h-[180px] w-full object-cover"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tóm tắt
              </label>
              <textarea
                rows={3}
                value={form.tom_tat}
                onChange={(e) => setForm((prev) => ({ ...prev, tom_tat: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="Mô tả ngắn cho bài viết..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Nội dung
              </label>
              <textarea
                rows={10}
                value={form.noi_dung}
                onChange={(e) => setForm((prev) => ({ ...prev, noi_dung: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm leading-7 outline-none focus:border-zinc-500"
                placeholder="Nội dung bài viết..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.noi_bat}
                  onChange={(e) => setForm((prev) => ({ ...prev, noi_bat: e.target.checked }))}
                />
                Bài viết nổi bật
              </label>

              <select
                value={form.trang_thai}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    trang_thai: e.target.value as "draft" | "published",
                  }))
                }
                className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật bài viết"
                : "Tạo bài viết"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Danh sách bài viết
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Tổng: <span className="font-semibold text-zinc-900">{total}</span> bài viết
              </p>
            </div>

            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-[180px] rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                placeholder="Tìm bài viết..."
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              >
                <option value="all">Tất cả</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 text-sm text-zinc-500">Đang tải bài viết...</div>
          ) : items.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
              Chưa có bài viết nào.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <article
                  key={item.ma_bai_viet}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                      {item.anh_bia ? (
                        <img
                          src={item.anh_bia}
                          alt={item.tieu_de}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.trang_thai} />

                        {item.noi_bat ? (
                          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Nổi bật
                          </span>
                        ) : null}

                        <span className="text-xs text-zinc-500">
                          {item.danh_muc}
                        </span>
                      </div>

                      <h3 className="mt-2 line-clamp-2 font-semibold text-zinc-900">
                        {item.tieu_de}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600">
                        {item.tom_tat || item.slug}
                      </p>

                      <div className="mt-2 text-xs text-zinc-500">
                        {formatDate(item.ngay_tao)} · {item.luot_xem || 0} lượt xem
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.trang_thai === "published" ? (
                          <a
                            href={`/news/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                          >
                            Xem
                          </a>
                        ) : null}

                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleDelete(item.ma_bai_viet)}
                          className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}