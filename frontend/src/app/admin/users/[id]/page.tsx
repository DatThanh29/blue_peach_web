"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type AppRole = "customer" | "staff" | "admin";

type UserDetail = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: AppRole;
  ma_role?: string | null;
  is_active?: boolean;
  is_blocked?: boolean;
  ngay_sinh?: string | null;
  gioi_tinh?: string | null;
  avatar?: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

type AddressItem = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  postal_code?: string | null;
  is_default: boolean;
  address_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type UserLogItem = {
  id: string;
  action: string;
  field_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  note?: string | null;
  performed_by?: string | null;
  performed_by_role?: string | null;
  created_at?: string | null;
};

type UserDetailResponse = {
  user: UserDetail;
};

type UserAddressesResponse = {
  items: AddressItem[];
};

type UserLogsResponse = {
  items: UserLogItem[];
};

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [user, setUser] = useState<UserDetail | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [logs, setLogs] = useState<UserLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    ngay_sinh: "",
    gioi_tinh: "",
    avatar: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [userRes, addressRes, logRes] = await Promise.all([
        adminFetch(`/admin/users/${id}`) as Promise<UserDetailResponse>,
        adminFetch(`/admin/users/${id}/addresses`) as Promise<UserAddressesResponse>,
        adminFetch(`/admin/users/${id}/logs`) as Promise<UserLogsResponse>,
      ]);

      setUser(userRes.user || null);
      setAddresses(addressRes.items || []);
      setLogs(logRes.items || []);
    } catch (err: any) {
      setError(err?.message || "Không tải được chi tiết người dùng");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      full_name: user.full_name || "",
      phone: user.phone || "",
      ngay_sinh: user.ngay_sinh ? String(user.ngay_sinh).slice(0, 10) : "",
      gioi_tinh: user.gioi_tinh || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  async function handleToggleStatus(field: "is_active" | "is_blocked", value: boolean) {
    if (!user) return;

    const label =
      field === "is_active"
        ? value
          ? "kích hoạt"
          : "chuyển sang inactive"
        : value
        ? "block"
        : "bỏ block";

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${label} user "${user.full_name || user.email || user.user_id}" không?`
    );

    if (!confirmed) return;

    try {
      setStatusLoading(true);
      setError("");

      await adminFetch(`/admin/users/${user.user_id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          [field]: value,
        }),
      });

      await loadData();
    } catch (err: any) {
      setError(err?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      setProfileSaving(true);
      setError("");

      await adminFetch(`/admin/users/${user.user_id}/profile`, {
        method: "PATCH",
        body: JSON.stringify({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
          ngay_sinh: profileForm.ngay_sinh || null,
          gioi_tinh: profileForm.gioi_tinh || null,
          avatar: profileForm.avatar || null,
        }),
      });

      await loadData();
      setIsEditingProfile(false);
    } catch (err: any) {
      setError(err?.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setProfileSaving(false);
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("vi-VN");
  }

  function formatAddress(address: AddressItem) {
    return [
      address.address_line1,
      address.address_line2,
      address.ward,
      address.district,
      address.city,
      address.postal_code,
    ]
      .filter(Boolean)
      .join(", ");
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-zinc-500">Đang tải chi tiết người dùng...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← Quay lại Users
        </Link>

        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← Quay lại Users
        </Link>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
          Không tìm thấy người dùng.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          ← Quay lại Users
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-500">Admin / Users / Detail</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {user.full_name || user.email || "User Detail"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Thông tin hồ sơ, trạng thái và lịch sử quản trị của người dùng.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={[
                "inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium",
                user.role === "admin"
                  ? "bg-violet-100 text-violet-700"
                  : user.role === "staff"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-zinc-100 text-zinc-700",
              ].join(" ")}
            >
              {user.role}
            </span>

            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-700",
              ].join(" ")}
            >
              {user.is_active ? "active" : "inactive"}
            </span>

            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                user.is_blocked ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700",
              ].join(" ")}
            >
              {user.is_blocked ? "blocked" : "not blocked"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsEditingProfile((prev) => !prev)}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            {isEditingProfile ? "Đóng chỉnh sửa hồ sơ" : "Chỉnh sửa hồ sơ"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard label="Full name" value={user.full_name || "-"} />
          <InfoCard label="Email" value={user.email || "-"} />
          <InfoCard label="Phone" value={user.phone || "-"} />
          <InfoCard label="Role" value={user.role || "-"} />
          <InfoCard label="ma_role" value={user.ma_role || "-"} />
          <InfoCard label="User ID" value={user.user_id} mono />
          <InfoCard
            label="Ngày sinh"
            value={user.ngay_sinh ? formatDate(user.ngay_sinh) : "-"}
          />
          <InfoCard label="Giới tính" value={user.gioi_tinh || "-"} />
          <InfoCard label="Avatar" value={user.avatar || "-"} />
          <InfoCard label="Created at" value={formatDate(user.created_at)} />
          <InfoCard label="Updated at" value={formatDate(user.updated_at)} />
        </div>

        {isEditingProfile ? (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50 p-5"
          >
            <div className="mb-4">
              <div className="text-lg font-semibold text-zinc-900">Chỉnh sửa hồ sơ</div>
              <p className="mt-2 text-sm text-zinc-500">
                Chỉ chỉnh các trường an toàn, không ảnh hưởng đến auth và phân quyền.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Full name</span>
                <input
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="Nhập họ tên"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Phone</span>
                <input
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="Nhập số điện thoại"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Ngày sinh</span>
                <input
                  type="date"
                  value={profileForm.ngay_sinh}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, ngay_sinh: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Giới tính</span>
                <select
                  value={profileForm.gioi_tinh}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, gioi_tinh: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                >
                  <option value="">Chưa chọn</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-zinc-700">Avatar URL</span>
                <input
                  value={profileForm.avatar}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="https://..."
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={profileSaving}
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {profileSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                type="button"
                disabled={profileSaving}
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfileForm({
                    full_name: user.full_name || "",
                    phone: user.phone || "",
                    ngay_sinh: user.ngay_sinh ? String(user.ngay_sinh).slice(0, 10) : "",
                    gioi_tinh: user.gioi_tinh || "",
                    avatar: user.avatar || "",
                  });
                }}
                className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : null}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            disabled={statusLoading}
            onClick={() => handleToggleStatus("is_active", !Boolean(user.is_active))}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
          >
            {statusLoading
              ? "Đang cập nhật..."
              : user.is_active
              ? "Chuyển sang inactive"
              : "Kích hoạt lại user"}
          </button>

          <button
            type="button"
            disabled={statusLoading}
            onClick={() => handleToggleStatus("is_blocked", !Boolean(user.is_blocked))}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
          >
            {statusLoading
              ? "Đang cập nhật..."
              : user.is_blocked
              ? "Bỏ block user"
              : "Block user"}
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">User Addresses</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Danh sách địa chỉ của người dùng. Địa chỉ mặc định được ưu tiên hiển thị đầu tiên.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            Tổng địa chỉ: <span className="font-semibold text-zinc-900">{addresses.length}</span>
          </div>
        </div>

        {addresses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
            Người dùng này chưa có địa chỉ nào.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-zinc-900">
                      {address.full_name || user.full_name || "Người nhận"}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {address.phone || user.phone || "-"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {address.address_type ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                        {address.address_type}
                      </span>
                    ) : null}

                    {address.is_default ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Default
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 text-sm leading-6 text-zinc-700">
                  {formatAddress(address) || "-"}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MiniInfo label="Created at" value={formatDate(address.created_at)} />
                  <MiniInfo label="Updated at" value={formatDate(address.updated_at)} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Admin Logs</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Lịch sử thao tác quản trị trên tài khoản người dùng này.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            Tổng log: <span className="font-semibold text-zinc-900">{logs.length}</span>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
            Chưa có lịch sử quản trị nào cho người dùng này.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-left text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Field</th>
                  <th className="px-4 py-3 font-medium">Old value</th>
                  <th className="px-4 py-3 font-medium">New value</th>
                  <th className="px-4 py-3 font-medium">Admin role</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-600">{formatDate(log.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{log.action}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.field_name || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.old_value || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.new_value || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.performed_by_role || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </div>
      <div
        className={[
          "mt-2 break-words text-sm text-zinc-900",
          mono ? "font-mono text-xs" : "font-medium",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-sm text-zinc-700">{value}</div>
    </div>
  );
}