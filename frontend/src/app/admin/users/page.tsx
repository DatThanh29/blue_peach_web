"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api";

type AppRole = "customer" | "staff" | "admin";
type StatusFilter = "" | "active" | "inactive" | "blocked";
type SortValue = "created_desc" | "updated_desc" | "name_asc";

type UserItem = {
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

type UsersResponse = {
  items: UserItem[];
  total: number;
  limit: number;
  offset: number;
  search?: string;
  roleFilter?: "" | AppRole;
  statusFilter?: StatusFilter;
  sort?: SortValue;
  stats?: {
    totalUsers: number;
    totalAdmins: number;
    totalStaff: number;
    totalCustomers: number;
    totalBlocked: number;
    totalInactive: number;
  };
};

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UsersResponse["stats"]>({
    totalUsers: 0,
    totalAdmins: 0,
    totalStaff: 0,
    totalCustomers: 0,
    totalBlocked: 0,
    totalInactive: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | AppRole>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [sort, setSort] = useState<SortValue>("created_desc");
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const currentPage = useMemo(() => Math.floor(offset / PAGE_SIZE) + 1, [offset]);
  const hasActiveFilter = Boolean(search || roleFilter || statusFilter || sort !== "created_desc");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
        sort,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (roleFilter) {
        params.set("role", roleFilter);
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const res = (await adminFetch(`/admin/users?${params.toString()}`)) as UsersResponse;

      setItems(res.items || []);
      setTotal(res.total || 0);
      setStats(
        res.stats || {
          totalUsers: 0,
          totalAdmins: 0,
          totalStaff: 0,
          totalCustomers: 0,
          totalBlocked: 0,
          totalInactive: 0,
        }
      );
    } catch (err: any) {
      setError(err?.message || "Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [offset, roleFilter, search, statusFilter, sort]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleChangeRole(userId: string, nextRole: AppRole) {
    const targetUser = items.find((item) => item.user_id === userId);
    if (!targetUser) return;
    if (targetUser.role === nextRole) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn đổi role của "${targetUser.full_name || targetUser.email || userId}" thành "${nextRole}" không?`
    );

    if (!confirmed) return;

    try {
      setUpdatingUserId(userId);
      setError("");

      await adminFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });

      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Cập nhật role thất bại");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleToggleStatus(
    user: UserItem,
    field: "is_active" | "is_blocked",
    nextValue: boolean
  ) {
    const label =
      field === "is_active"
        ? nextValue
          ? "kích hoạt"
          : "chuyển sang inactive"
        : nextValue
        ? "block"
        : "bỏ block";

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${label} user "${user.full_name || user.email || user.user_id}" không?`
    );

    if (!confirmed) return;

    try {
      setUpdatingUserId(user.user_id);
      setError("");

      await adminFetch(`/admin/users/${user.user_id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          [field]: nextValue,
        }),
      });

      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingUserId(null);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setSearch(searchInput.trim());
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setSort("created_desc");
    setOffset(0);
  }

  function formatDate(value: string | null | undefined) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("vi-VN");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-500">Admin / Quản lý người dùng</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Người dùng
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
              Quản lý người dùng, phân quyền, trạng thái tài khoản và truy cập nhanh vào
              hồ sơ chi tiết trong hệ thống Blue Peach.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            Tổng kết quả hiện tại: <span className="font-semibold text-zinc-900">{total}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard label="Tổng người dùng" value={stats?.totalUsers ?? 0} />
          <StatCard label="Quản trị viên" value={stats?.totalAdmins ?? 0} />
          <StatCard label="Nhân viên" value={stats?.totalStaff ?? 0} />
          <StatCard label="Khách hàng" value={stats?.totalCustomers ?? 0} />
          <StatCard label="Đã chặn" value={stats?.totalBlocked ?? 0} />
          <StatCard label="Không hoạt động" value={stats?.totalInactive ?? 0} />
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_220px_220px_220px_auto]">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại, vai trò hoặc user_id..."
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
            />
            <button
              type="submit"
              className="h-12 rounded-2xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Tìm
            </button>
          </form>

          <select
            value={roleFilter}
            onChange={(e) => {
              setOffset(0);
              setRoleFilter(e.target.value as "" | AppRole);
            }}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setOffset(0);
              setStatusFilter(e.target.value as StatusFilter);
            }}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="blocked">Đã chặn</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setOffset(0);
              setSort(e.target.value as SortValue);
            }}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="created_desc">Mới tạo gần nhất</option>
            <option value="updated_desc">Mới cập nhật gần nhất</option>
            <option value="name_asc">Tên A-Z</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilter}
            className="h-12 rounded-2xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xóa bộ lọc
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          {search ? (
            <Chip label={`Tìm: ${search}`} />
          ) : null}

          {roleFilter ? (
            <Chip label={`Vai trò: ${roleFilter}`} />
          ) : null}

          {statusFilter ? (
            <Chip label={`Trạng thái: ${statusFilter}`} />
          ) : null}

          <Chip
            label={
              sort === "updated_desc"
                ? "Sort: updated desc"
                : sort === "name_asc"
                ? "Sort: name A-Z"
                : "Sort: created desc"
            }
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-medium">Họ tên</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Số điện thoại</th>
                <th className="px-5 py-4 font-medium">Vai trò</th>
                <th className="px-5 py-4 font-medium">Trạng thái</th>
                <th className="px-5 py-4 font-medium">User ID</th>
                <th className="px-5 py-4 font-medium">Ngày tạo</th>
                <th className="px-5 py-4 font-medium">Ngày cập nhật</th>
                <th className="px-5 py-4 font-medium text-center">Chi tiết</th>
                <th className="px-5 py-4 font-medium text-right">Thao tác nhanh</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-zinc-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-zinc-500">
                    {hasActiveFilter
                      ? "Không có người dùng phù hợp với bộ lọc hiện tại."
                      : "Chưa có dữ liệu người dùng."}
                  </td>
                </tr>
              ) : (
                items.map((user) => {
                  const isUpdating = updatingUserId === user.user_id;

                  return (
                    <tr key={user.user_id} className="border-t border-zinc-100 align-top">
                      <td className="px-5 py-4">
                        <div className="font-medium text-zinc-900">
                          {user.full_name || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-zinc-600">{user.email || "-"}</td>

                      <td className="px-5 py-4 text-zinc-600">{user.phone || "-"}</td>

                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge
                            label={user.is_active ? "active" : "inactive"}
                            tone={user.is_active ? "success" : "neutral"}
                          />
                          <StatusBadge
                            label={user.is_blocked ? "blocked" : "normal"}
                            tone={user.is_blocked ? "danger" : "neutral"}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                        {user.user_id}
                      </td>

                      <td className="px-5 py-4 text-zinc-600">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="px-5 py-4 text-zinc-600">
                        {formatDate(user.updated_at)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/admin/users/${user.user_id}`}
                          className="inline-flex rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                          Xem
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col items-end gap-2">
                          {isUpdating ? (
                            <span className="text-xs font-medium text-amber-600">
                              Đang cập nhật...
                            </span>
                          ) : null}

                          <div className="flex flex-wrap justify-end gap-2">
                            <select
                              value={user.role}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleChangeRole(user.user_id, e.target.value as AppRole)
                              }
                              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400 disabled:opacity-60"
                            >
                              <option value="customer">customer</option>
                              <option value="staff">staff</option>
                              <option value="admin">admin</option>
                            </select>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleToggleStatus(
                                  user,
                                  "is_blocked",
                                  !Boolean(user.is_blocked)
                                )
                              }
                              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
                            >
                                {user.is_blocked ? "Bỏ chặn" : "Chặn"}
                            </button>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleToggleStatus(
                                  user,
                                  "is_active",
                                  !Boolean(user.is_active)
                                )
                              }
                              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
                            >
                              {user.is_active ? "Tắt hoạt động" : "Kích hoạt"}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-500">
            Trang <span className="font-medium text-zinc-900">{currentPage}</span> /{" "}
            <span className="font-medium text-zinc-900">{totalPages}</span>
            <span className="ml-3">
              Hiển thị <span className="font-medium text-zinc-900">{items.length}</span> /{" "}
              <span className="font-medium text-zinc-900">{total}</span> kết quả
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={offset === 0 || loading}
              onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={loading || offset + PAGE_SIZE >= total}
              onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1">
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: AppRole }) {
  const className =
    role === "admin"
      ? "bg-violet-100 text-violet-700"
      : role === "staff"
      ? "bg-blue-100 text-blue-700"
      : "bg-zinc-100 text-zinc-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {role}
    </span>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "danger" | "neutral";
}) {
  const className =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "danger"
      ? "bg-red-100 text-red-700"
      : "bg-zinc-100 text-zinc-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}