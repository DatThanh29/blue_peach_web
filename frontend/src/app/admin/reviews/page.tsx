"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/api";

type ReviewStatus = "pending" | "approved" | "hidden";
type ReviewFilterStatus = ReviewStatus | "deleted" | "all";

type ReviewItem = {
    ma_danh_gia: string;
    ma_san_pham: string;
    ten_nguoi_danh_gia: string;
    so_sao: number;
    noi_dung: string;
    trang_thai: ReviewStatus;
    is_featured: boolean;
    la_xoa_mem: boolean;
    ngay_tao: string;
    ngay_cap_nhat?: string;
    products?: {
        ten_san_pham?: string | null;
        sku?: string | null;
        primary_image?: string | null;
    } | null;
};

type ReviewListResponse = {
    items?: ReviewItem[];
    total?: number;
    limit?: number;
    offset?: number;
};

const STATUS_OPTIONS: Array<{ label: string; value: ReviewFilterStatus }> = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
    { label: "Đã ẩn", value: "hidden" },
    { label: "Đã xóa mềm", value: "deleted" },
];

function formatDate(value?: string) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function reviewStatusLabel(status: ReviewStatus) {
    const map: Record<ReviewStatus, string> = {
        pending: "Chờ duyệt",
        approved: "Đã duyệt",
        hidden: "Đã ẩn",
    };
    return map[status];
}

function isActionLoading(id: string, currentId: string | null) {
    return id === currentId;
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
    const styles: Record<ReviewStatus, string> = {
        pending: "border-amber-200 bg-amber-50 text-amber-700",
        approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
        hidden: "border-zinc-200 bg-zinc-50 text-zinc-700",
    };

    return (
        <span
            className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                styles[status],
            ].join(" ")}
        >
            {reviewStatusLabel(status)}
        </span>
    );
}

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < value;
                return (
                    <span key={idx} className={filled ? "text-zinc-900" : "text-zinc-300"}>
                        ★
                    </span>
                );
            })}
        </div>
    );
}

export default function AdminReviewsPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const status = (sp.get("status") ?? "all") as ReviewFilterStatus;
    const q = sp.get("q") ?? "";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
    const limit = 10;

    const [items, setItems] = useState<ReviewItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState(q);
    const [isComposing, setIsComposing] = useState(false);

    const offset = useMemo(() => (page - 1) * limit, [page]);

    function setQuery(next: Partial<{ status: string; q: string; page: number }>) {
        const params = new URLSearchParams(sp.toString());
        if (next.status !== undefined) params.set("status", next.status);
        if (next.q !== undefined) params.set("q", next.q);
        if (next.page !== undefined) params.set("page", String(next.page));
        router.push(`/admin/reviews?${params.toString()}`);
    }

    async function load() {
        setLoading(true);
        setErr(null);

        try {
            const params = new URLSearchParams();
            params.set("limit", String(limit));
            params.set("offset", String(offset));
            if (status !== "all") params.set("status", status);
            if (q.trim()) params.set("q", q.trim());

            const res = (await adminFetch(`/admin/reviews?${params.toString()}`, {
                cache: "no-store",
            })) as ReviewListResponse;

            setItems(res.items ?? []);
            setTotal(res.total ?? 0);
        } catch (e: any) {
            setErr(e?.message ?? "Tải dữ liệu thất bại");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, nextStatus: ReviewStatus) {
        try {
            setActionLoadingId(id);
            await adminFetch(`/admin/reviews/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ trang_thai: nextStatus }),
            });
            await load();
        } catch (e: any) {
            alert(e?.message ?? "Cập nhật trạng thái thất bại");
        } finally {
            setActionLoadingId(null);
        }
    }

    async function toggleFeatured(id: string, current: boolean) {
        try {
            setActionLoadingId(id);
            await adminFetch(`/admin/reviews/${id}/feature`, {
                method: "PATCH",
                body: JSON.stringify({ is_featured: !current }),
            });
            await load();
        } catch (e: any) {
            alert(e?.message ?? "Cập nhật trạng thái nổi bật thất bại");
        } finally {
            setActionLoadingId(null);
        }
    }

    async function softDelete(id: string) {
        const confirmed = window.confirm("Bạn có chắc muốn xóa mềm đánh giá này?");
        if (!confirmed) return;

        try {
            setActionLoadingId(id);
            await adminFetch(`/admin/reviews/${id}`, {
                method: "DELETE",
            });
            await load();
        } catch (e: any) {
            alert(e?.message ?? "Xóa đánh giá thất bại");
        } finally {
            setActionLoadingId(null);
        }
    }

    useEffect(() => {
        const t = setTimeout(() => load(), 250);
        return () => clearTimeout(t);
    }, [status, q, page]);

    useEffect(() => {
        setSearchInput(q);
    }, [q]);

    useEffect(() => {
        if (isComposing || searchInput === q) return;

        const t = setTimeout(() => {
            setQuery({ q: searchInput, page: 1 });
        }, 250);

        return () => clearTimeout(t);
    }, [searchInput, isComposing, q]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Đánh giá</h1>
                    <p className="text-sm text-zinc-500">
                        Duyệt, ẩn, gắn nổi bật và quản lý đánh giá sản phẩm.
                    </p>
                </div>

                <button
                    onClick={load}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Đang tải..." : "Tải lại"}
                </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-3">
                <div className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-600">Trạng thái</div>
                    <select
                        value={status}
                        onChange={(e) => setQuery({ status: e.target.value, page: 1 })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

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
                        placeholder="Tìm theo tên người đánh giá hoặc nội dung..."
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
            </div>

            {err ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    ❌ {err}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-500">
                    Tổng: <span className="font-semibold text-zinc-900">{total}</span> đánh giá
                </div>

                <div className="divide-y divide-zinc-100">
                    {items.map((item) => {
                        const disabled = isActionLoading(item.ma_danh_gia, actionLoadingId);

                        return (
                            <div key={item.ma_danh_gia} className="p-4 md:p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="font-semibold text-zinc-900">
                                                {item.ten_nguoi_danh_gia}
                                            </div>

                                            <ReviewStatusBadge status={item.trang_thai} />

                                            {item.is_featured ? (
                                                <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 shadow-sm">
                                                    Nổi bật
                                                </span>
                                            ) : null}

                                            {item.la_xoa_mem ? (
                                                <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                    Đã xóa mềm
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                                            <StarRating value={item.so_sao} />
                                            <span>{formatDate(item.ngay_tao)}</span>
                                            <span>•</span>
                                            <span className="font-medium text-zinc-700">
                                                {item.products?.ten_san_pham || "Sản phẩm"}
                                            </span>
                                            {item.products?.sku ? (
                                                <>
                                                    <span>•</span>
                                                    <span>SKU: {item.products.sku}</span>
                                                </>
                                            ) : null}
                                        </div>

                                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-700 md:line-clamp-3">
                                            {item.noi_dung}
                                        </p>
                                    </div>

                                    {!item.la_xoa_mem ? (
                                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[320px] lg:justify-end">
                                            <button
                                                disabled={disabled}
                                                onClick={() => updateStatus(item.ma_danh_gia, "approved")}
                                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                                            >
                                                {disabled ? "Đang xử lý..." : "Duyệt"}
                                            </button>

                                            <button
                                                disabled={disabled}
                                                onClick={() => updateStatus(item.ma_danh_gia, "hidden")}
                                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
                                            >
                                                {disabled ? "Đang xử lý..." : "Ẩn"}
                                            </button>

                                            <button
                                                disabled={disabled}
                                                onClick={() => toggleFeatured(item.ma_danh_gia, item.is_featured)}
                                                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-60"
                                            >
                                                {disabled
                                                    ? "Đang xử lý..."
                                                    : item.is_featured
                                                        ? "Bỏ nổi bật"
                                                        : "Đặt nổi bật"}
                                            </button>

                                            <button
                                                disabled={disabled}
                                                onClick={() => softDelete(item.ma_danh_gia)}
                                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                            >
                                                {disabled ? "Đang xử lý..." : "Xóa mềm"}
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}

                    {!loading && items.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                            <p className="text-sm font-medium text-zinc-900">Chưa có đánh giá phù hợp</p>
                            <p className="mt-2 text-sm text-zinc-500">
                                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                            </p>
                        </div>
                    ) : null}
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