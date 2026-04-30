"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type CouponItem = {
  ma_giam_gia: string;
  code: string;
  loai_giam_gia: "percent" | "fixed";
  gia_tri_giam: number;
  don_hang_toi_thieu: number;
  giam_toi_da?: number | null;
  so_lan_su_dung_toi_da?: number | null;
  so_lan_da_dung: number;
  trang_thai: boolean;
  ngay_bat_dau?: string | null;
  ngay_ket_thuc?: string | null;
};

type CouponListResponse = {
  items: CouponItem[];
};

const emptyForm = {
  code: "",
  loai_giam_gia: "percent",
  gia_tri_giam: 10,
  don_hang_toi_thieu: 0,
  giam_toi_da: "",
  so_lan_su_dung_toi_da: "",
  trang_thai: true,
  ngay_bat_dau: "",
  ngay_ket_thuc: "",
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

export default function AdminCouponsPage() {
  const [items, setItems] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadCoupons() {
    try {
      setLoading(true);
      setError(null);
      const res = (await adminFetch("/admin/coupons")) as CouponListResponse;
      setItems(res.items ?? []);
    } catch (err: any) {
      setError(err?.message || "Không tải được danh sách coupon.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
      };

      if (editingId) {
        await adminFetch(`/admin/coupons/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/admin/coupons", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadCoupons();
    } catch (err: any) {
      setError(err?.message || "Lưu coupon thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Bạn có chắc muốn vô hiệu hóa mã giảm giá này?");
    if (!ok) return;

    try {
      setError(null);
      await adminFetch(`/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadCoupons();
    } catch (err: any) {
      setError(err?.message || "Xóa coupon thất bại.");
    }
  }

  function handleEdit(item: CouponItem) {
    setEditingId(item.ma_giam_gia);
    setForm({
      code: item.code,
      loai_giam_gia: item.loai_giam_gia,
      gia_tri_giam: item.gia_tri_giam,
      don_hang_toi_thieu: item.don_hang_toi_thieu,
      giam_toi_da:
        item.giam_toi_da !== null && item.giam_toi_da !== undefined
          ? String(item.giam_toi_da)
          : "",
      so_lan_su_dung_toi_da:
        item.so_lan_su_dung_toi_da !== null &&
        item.so_lan_su_dung_toi_da !== undefined
          ? String(item.so_lan_su_dung_toi_da)
          : "",
      trang_thai: Boolean(item.trang_thai),
      ngay_bat_dau: item.ngay_bat_dau ? item.ngay_bat_dau.slice(0, 16) : "",
      ngay_ket_thuc: item.ngay_ket_thuc ? item.ngay_ket_thuc.slice(0, 16) : "",
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
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">
              {editingId ? "Chỉnh sửa coupon" : "Tạo coupon mới"}
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
                Mã giảm giá
              </label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                }
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                placeholder="BLUE10"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Loại giảm giá
                </label>
                <select
                  value={form.loai_giam_gia}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      loai_giam_gia: e.target.value as "percent" | "fixed",
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Giá trị giảm
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.gia_tri_giam}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      gia_tri_giam: Number(e.target.value || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Đơn tối thiểu
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.don_hang_toi_thieu}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      don_hang_toi_thieu: Number(e.target.value || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Giảm tối đa
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.giam_toi_da}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      giam_toi_da: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Lượt dùng tối đa
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.so_lan_su_dung_toi_da}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      so_lan_su_dung_toi_da: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={form.ngay_bat_dau}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ngay_bat_dau: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={form.ngay_ket_thuc}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ngay_ket_thuc: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.trang_thai}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      trang_thai: e.target.checked,
                    }))
                  }
                />
                Kích hoạt mã giảm giá
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật coupon"
                : "Tạo coupon"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">Danh sách coupon</h2>
            <button
              onClick={loadCoupons}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Tải lại
            </button>
          </div>

          {loading ? (
            <div className="mt-5 text-sm text-zinc-500">Đang tải coupon...</div>
          ) : items.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">
              Chưa có coupon nào.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.ma_giam_gia}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Coupon
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                        {item.code}
                      </h3>
                    </div>

                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        item.trang_thai
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-zinc-100 text-zinc-600",
                      ].join(" ")}
                    >
                      {item.trang_thai ? "Đang hoạt động" : "Đã tắt"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                    <div>
                      Loại:{" "}
                      <strong>
                        {item.loai_giam_gia === "percent"
                          ? `${item.gia_tri_giam}%`
                          : `${Number(item.gia_tri_giam).toLocaleString("vi-VN")}đ`}
                      </strong>
                    </div>
                    <div>
                      Đơn tối thiểu:{" "}
                      <strong>{Number(item.don_hang_toi_thieu).toLocaleString("vi-VN")}đ</strong>
                    </div>
                    <div>
                      Đã dùng: <strong>{item.so_lan_da_dung}</strong>
                      {item.so_lan_su_dung_toi_da !== null &&
                      item.so_lan_su_dung_toi_da !== undefined
                        ? ` / ${item.so_lan_su_dung_toi_da}`
                        : ""}
                    </div>
                    <div>Bắt đầu: {formatDate(item.ngay_bat_dau)}</div>
                    <div>Kết thúc: {formatDate(item.ngay_ket_thuc)}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Chỉnh sửa
                    </button>

                    <button
                      onClick={() => handleDelete(item.ma_giam_gia)}
                      className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Vô hiệu hóa
                    </button>
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