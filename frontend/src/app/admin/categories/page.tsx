"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/api";

type Category = {
  ma_danh_muc: string;
  ten_danh_muc: string;
  mo_ta?: string | null;
  trang_thai_hien_thi: boolean;
  ngay_tao?: string;
};

type CategoryListResponse = {
  items: Category[];
  total: number;
  limit: number;
  offset: number;
};

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

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminCategoriesPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const q = sp.get("q") ?? "";
  const visible = sp.get("visible") ?? "all";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = 12;
  const offset = useMemo(() => (page - 1) * limit, [page]);

  const [items, setItems] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [isComposing, setIsComposing] = useState(false);

  function setQuery(
    next: Partial<{ q: string; visible: string; page: number }>
  ) {
    const params = new URLSearchParams(sp.toString());
    if (next.q !== undefined) params.set("q", next.q);
    if (next.visible !== undefined) params.set("visible", next.visible);
    if (next.page !== undefined) params.set("page", String(next.page));
    router.push(`/admin/categories?${params.toString()}`);
  }

  async function loadCategories() {
    setLoading(true);
    setErr(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (q.trim()) params.set("q", q.trim());
      if (visible !== "all") params.set("visible", visible);

      const res = (await adminFetch(
        `/admin/categories?${params.toString()}`
      )) as CategoryListResponse;

      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e: any) {
      setErr(e?.message ?? "Không tải được danh sách categories.");
    } finally {
      setLoading(false);
    }
  }

  async function softDelete(id: string) {
    const confirmed = window.confirm("Ẩn category này?");
    if (!confirmed) return;

    try {
      await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (e: any) {
      alert(e?.message ?? "Ẩn category thất bại.");
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      loadCategories();
    }, 200);
    return () => clearTimeout(t);
  }, [q, visible, page]);

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

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh mục</h1>
          <p className="text-sm text-zinc-500">
            Quản lý danh mục sản phẩm và trạng thái hiển thị.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + Danh mục mới
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-3">
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
            placeholder="Tìm theo tên danh mục..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
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
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {err}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-500">
          Tổng: <span className="font-semibold text-zinc-900">{total}</span> danh mục
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-600">
              <tr>
                <th className="px-4 py-3">Tên danh mục</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Hiển thị</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {items.map((cat) => (
                <tr key={cat.ma_danh_muc} className="border-t border-zinc-100">
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    {cat.ten_danh_muc}
                  </td>

                  <td className="px-4 py-3 text-zinc-600">
                    {cat.mo_ta || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <BoolBadge
                      value={cat.trang_thai_hien_thi}
                      trueLabel="Hiển thị"
                      falseLabel="Đã ẩn"
                    />
                  </td>

                  <td className="px-4 py-3 text-zinc-600">
                    {formatDate(cat.ngay_tao)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.ma_danh_muc}`}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => softDelete(cat.ma_danh_muc)}
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
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    Chưa có danh mục nào.
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
              ← Trước
            </button>
            <button
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setQuery({ page: page + 1 })}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}