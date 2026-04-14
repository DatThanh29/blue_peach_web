"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api";

type CategoryDetail = {
  ma_danh_muc: string;
  ten_danh_muc: string;
  mo_ta?: string | null;
  trang_thai_hien_thi: boolean;
};

type CategoryForm = {
  ten_danh_muc: string;
  mo_ta: string;
  trang_thai_hien_thi: boolean;
};

export default function AdminCategoryEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CategoryForm>({
    ten_danh_muc: "",
    mo_ta: "",
    trang_thai_hien_thi: true,
  });

  function update<K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function load() {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const category = (await adminFetch(
        `/admin/categories/${id}`
      )) as CategoryDetail;

      setForm({
        ten_danh_muc: category.ten_danh_muc || "",
        mo_ta: category.mo_ta || "",
        trang_thai_hien_thi: !!category.trang_thai_hien_thi,
      });
    } catch (e: any) {
      setError(e?.message || "Không tải được category.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submit() {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await adminFetch(`/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ten_danh_muc: form.ten_danh_muc,
          mo_ta: form.mo_ta || null,
          trang_thai_hien_thi: form.trang_thai_hien_thi,
        }),
      });

      router.push("/admin/categories");
    } catch (e: any) {
      setError(e?.message || "Cập nhật category thất bại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">Đang tải category...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
          Category Form
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Edit Category</h1>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Tên danh mục
            </label>
            <input
              value={form.ten_danh_muc}
              onChange={(e) => update("ten_danh_muc", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={form.mo_ta}
              onChange={(e) => update("mo_ta", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.trang_thai_hien_thi}
              onChange={(e) => update("trang_thai_hien_thi", e.target.checked)}
            />
            Hiển thị category này trên website
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
            onClick={() => router.push("/admin/categories")}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}