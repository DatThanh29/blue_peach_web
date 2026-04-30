"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
};

const AVATAR_BUCKET = "avatars";

function extractStoragePathFromPublicUrl(publicUrl: string, bucket: string) {
    try {
        const url = new URL(publicUrl);
        const marker = `/storage/v1/object/public/${bucket}/`;
        const index = url.pathname.indexOf(marker);

        if (index === -1) return null;

        const encodedPath = url.pathname.slice(index + marker.length);
        return decodeURIComponent(encodedPath);
    } catch {
        return null;
    }
}

async function deleteOldAvatarIfNeeded(oldAvatarUrl?: string | null) {
    if (!oldAvatarUrl) return;

    const oldPath = extractStoragePathFromPublicUrl(oldAvatarUrl, AVATAR_BUCKET);

    if (!oldPath) return;

    const { error } = await supabase.storage.from(AVATAR_BUCKET).remove([oldPath]);

    if (error) {
        console.warn("[AccountProfilePage] delete old avatar failed:", error.message);
    }
}

export default function AccountProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const {
        user,
        profile,
        isLoading,
        isAuthenticated,
        isEmailVerified,
        signOut,
        refreshProfile,
    } = useCustomerAuth();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [gioiTinh, setGioiTinh] = useState("");

    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
    } | null>(null);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (!isEmailVerified) {
            router.replace(
                `/verify-email${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`
            );
        }
    }, [isLoading, isAuthenticated, isEmailVerified, router, user?.email]);

    useEffect(() => {
        if (!profile) return;

        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
        setNgaySinh(profile.ngay_sinh || "");
        setGioiTinh(profile.gioi_tinh || "");
        setAvatarUrl(profile.avatar || "");
        setAvatarPreview(profile.avatar || "");
        setAvatarFile(null);
    }, [profile]);

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const displayName = useMemo(() => {
        if (profile?.full_name?.trim()) return profile.full_name.trim();
        if (user?.email) return user.email;
        return "Khách hàng Blue Peach";
    }, [profile?.full_name, user?.email]);

    const avatarText = useMemo(() => {
        if (fullName.trim()) {
            const parts = fullName.trim().split(/\s+/);
            const first = parts[0]?.[0] || "";
            const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
            return `${first}${last}`.toUpperCase();
        }

        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }

        return "BP";
    }, [fullName, user?.email]);

    const memberSince = useMemo(() => {
        if (!profile?.created_at) return "Chưa xác định";
        const date = new Date(profile.created_at);
        if (Number.isNaN(date.getTime())) return "Chưa xác định";

        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, [profile?.created_at]);

    const navItems: NavItem[] = [
        {
            label: "Thông tin chung",
            href: "/account",
            icon: <DashboardIcon />,
        },
        {
            label: "Hồ sơ cá nhân",
            href: "/account/profile",
            icon: <UserIcon />,
        },
        {
            label: "Sổ địa chỉ",
            href: "/account/addresses",
            icon: <LocationIcon />,
        },
        {
            label: "Đơn hàng",
            href: "/account/orders",
            icon: <BagIcon />,
        },
        {
            label: "Thông báo",
            href: "/account/notifications",
            icon: <BellIcon />,
        },
        {
            label: "Yêu thích",
            href: "/account/wishlist",
            icon: <HeartIcon />,
        },
        {
            label: "AI tư vấn",
            href: "/account/ai-assistant",
            icon: <SparklesIcon />,
        },
        {
            label: "Chat với Admin",
            href: "/account/chat-admin",
            icon: <ChatIcon />,
        },
        {
            label: "Bảo mật tài khoản",
            href: "/account/security",
            icon: <ShieldIcon />,
        },
    ];

    async function handleLogout() {
        try {
            setLoggingOut(true);
            setToast(null);

            const result = await signOut();

            if (result.error) {
                setToast({
                    message: result.error,
                    type: "error",
                });
                return;
            }

            router.replace("/login");
        } catch (error) {
            console.error("[AccountProfilePage] signOut failed:", error);
            setToast({
                message: "Không thể đăng xuất lúc này.",
                type: "error",
            });
        } finally {
            setLoggingOut(false);
        }
    }

    function handleChooseAvatar() {
        fileInputRef.current?.click();
    }

    function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setToast({
                message: "Vui lòng chọn một tệp hình ảnh hợp lệ.",
                type: "error",
            });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setToast({
                message: "Ảnh đại diện nên nhỏ hơn 2MB.",
                type: "error",
            });
            return;
        }

        if (avatarPreview && avatarPreview.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
    }

    function handleRemoveSelectedAvatar() {
        if (avatarPreview && avatarPreview.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
        }

        setAvatarFile(null);
        setAvatarPreview(avatarUrl || "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function uploadAvatar(file: File, userId: string) {
        const safeFileName = file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
        const filePath = `customers/${userId}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
            .from(AVATAR_BUCKET)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(uploadError.message || "Không thể tải ảnh đại diện lên.");
        }

        const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

        return data.publicUrl;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!user?.id) {
            setToast({
                message: "Không xác định được người dùng hiện tại.",
                type: "error",
            });
            return;
        }

        if (!fullName.trim()) {
            setToast({
                message: "Vui lòng nhập họ và tên.",
                type: "error",
            });
            return;
        }

        try {
            setSubmitting(true);
            setToast(null);

            const oldAvatarUrl = avatarUrl || null;
            let nextAvatarUrl = oldAvatarUrl;

            if (avatarFile) {
                nextAvatarUrl = await uploadAvatar(avatarFile, user.id);
            }

            const payload = {
                full_name: fullName.trim(),
                phone: phone.trim() || null,
                ngay_sinh: ngaySinh || null,
                gioi_tinh: gioiTinh || null,
                avatar: nextAvatarUrl,
            };

            const { error } = await supabase
                .from("profiles")
                .update(payload)
                .eq("user_id", user.id);

            if (error) {
                setToast({
                    message: error.message || "Không thể cập nhật hồ sơ.",
                    type: "error",
                });
                return;
            }

            await supabase.auth.updateUser({
                data: {
                    full_name: fullName.trim(),
                    phone: phone.trim() || null,
                },
            });

            if (avatarFile && oldAvatarUrl && oldAvatarUrl !== nextAvatarUrl) {
                await deleteOldAvatarIfNeeded(oldAvatarUrl);
            }

            setAvatarUrl(nextAvatarUrl || "");
            setAvatarFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await refreshProfile();

            setToast({
                message: "Cập nhật hồ sơ thành công.",
                type: "success",
            });
        } catch (error: any) {
            console.error("[AccountProfilePage] update profile failed:", error);
            setToast({
                message: error?.message || "Không thể cập nhật hồ sơ lúc này.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (isLoading || !isAuthenticated || !isEmailVerified) {
        return (
            <main className="bp-surface bp-surface-plain min-h-screen">
                <PageBreadcrumb
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Tài khoản", href: "/account" },
                        { label: "Hồ sơ cá nhân", active: true },
                    ]}
                />
                <section className="bp-container py-16">
                    <div className="mx-auto max-w-[520px] text-center">
                        <p className="text-sm text-black/60">Đang tải hồ sơ...</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bp-surface bp-surface-plain min-h-screen">
            <PageBreadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Tài khoản", href: "/account" },
                    { label: "Hồ sơ cá nhân", active: true },
                ]}
            />
            <section className="bp-container py-8 md:py-12">
                <div className="rounded-[34px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6">
                    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                        <aside className="rounded-[28px] border border-black/8 bg-[#f8f4ed] p-4 md:p-5">
                            <div className="rounded-[24px] border border-black/8 bg-white/70 px-4 py-6 text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#efe6d8] text-lg font-semibold tracking-[0.08em] text-black/78">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        avatarText
                                    )}
                                </div>

                                <p className="mt-4 truncate text-lg font-semibold text-black">
                                    {displayName}
                                </p>
                            </div>

                            <nav className="mt-4 space-y-2">
                                {navItems.map((item) => {
                                    const active = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "flex items-center justify-between rounded-[18px] px-4 py-3 text-sm transition",
                                                active
                                                    ? "bg-black text-white shadow-sm"
                                                    : "bg-white/70 text-black/75 hover:bg-white",
                                            ].join(" ")}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={active ? "text-white" : "text-black/65"}>
                                                    {item.icon}
                                                </span>
                                                <span className="font-medium">{item.label}</span>
                                            </span>

                                            {item.badge ? (
                                                <span
                                                    className={[
                                                        "rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.12em]",
                                                        active
                                                            ? "bg-white/16 text-white"
                                                            : "bg-black/6 text-black/45",
                                                    ].join(" ")}
                                                >
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        <div className="space-y-6">
                            <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#f7f1e7_0%,#f2eadf_100%)] p-6 md:p-8">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45">
                                            Tài khoản Blue Peach
                                        </p>

                                        <h1 className="font-heading text-4xl leading-tight text-black md:text-5xl">
                                            Hồ sơ cá nhân
                                        </h1>

                                        <p className="mt-4 max-w-[760px] text-sm leading-7 text-black/65">
                                            Cập nhật thông tin cá nhân và ảnh đại diện để tài khoản của
                                            bạn đầy đủ hơn cho các bước tiếp theo như địa chỉ, đơn hàng
                                            và bảo mật tài khoản.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Link href="/account" className="bp-btn bp-btn--ghost">
                                            Về thông tin chung
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="bp-btn bp-btn--ghost disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                                <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                                        Ảnh đại diện
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-black">
                                        Cập nhật avatar
                                    </h2>

                                    <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-black/8 bg-[#efe6d8] text-xl font-semibold text-black/78">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                avatarText
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleChooseAvatar}
                                                    className="bp-btn bp-btn--solid border-black"
                                                >
                                                    Chọn ảnh
                                                </button>

                                                {avatarFile ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveSelectedAvatar}
                                                        className="bp-btn bp-btn--ghost"
                                                    >
                                                        Xóa ảnh đã chọn
                                                    </button>
                                                ) : null}
                                            </div>

                                            <p className="text-sm leading-6 text-black/58">
                                                Chấp nhận ảnh JPG, PNG hoặc WEBP. Kích thước khuyến nghị nhỏ hơn 2MB.
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField label="Họ và tên">
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    placeholder="Nguyễn Văn A"
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                                                />
                                            </FormField>

                                            <FormField label="Số điện thoại">
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="0123 456 789"
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                                                />
                                            </FormField>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField label="Ngày sinh">
                                                <input
                                                    type="date"
                                                    value={ngaySinh}
                                                    onChange={(e) => setNgaySinh(e.target.value)}
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                                                />
                                            </FormField>

                                            <FormField label="Giới tính">
                                                <select
                                                    value={gioiTinh}
                                                    onChange={(e) => setGioiTinh(e.target.value)}
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                                                >
                                                    <option value="">Chọn giới tính</option>
                                                    <option value="nam">Nam</option>
                                                    <option value="nữ">Nữ</option>
                                                    <option value="khác">Khác</option>
                                                </select>
                                            </FormField>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={[
                                                    "bp-btn bp-btn--solid border-black",
                                                    "disabled:cursor-not-allowed disabled:opacity-60",
                                                ].join(" ")}
                                            >
                                                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                                            </button>

                                            <Link href="/account" className="bp-btn bp-btn--ghost">
                                                Hủy
                                            </Link>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                                            Thông tin hiện tại
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-black">
                                            Dữ liệu tài khoản
                                        </h2>

                                        <div className="mt-6 space-y-3">
                                            <InfoRow label="Email" value={user?.email || profile?.email || "Chưa có"} />
                                            <InfoRow label="Vai trò" value={profile?.role || "customer"} />
                                            <InfoRow label="Ngày tham gia" value={memberSince} />
                                            <InfoRow label="Xác minh email" value="Đã xác minh" />
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] border border-[#ead7b5] bg-[#fff8eb] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.03)] md:p-8">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#9b6a18]">
                                            Gợi ý
                                        </p>
                                        <h3 className="mt-2 text-xl font-semibold text-[#6a4c18]">
                                            Hoàn thiện hồ sơ tốt hơn
                                        </h3>

                                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6a4c18]">
                                            <li>• Cập nhật đầy đủ họ tên và số điện thoại.</li>
                                            <li>• Chọn ảnh đại diện để tài khoản chuyên nghiệp hơn.</li>
                                            <li>• Sau bước này, bạn có thể tiếp tục sang Sổ địa chỉ.</li>
                                        </ul>

                                        <div className="mt-6">
                                            <Link href="/account/addresses" className="bp-btn bp-btn--ghost">
                                                Tới Sổ địa chỉ
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {toast ? (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            ) : null}
        </main>
    );
}

function FormField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-black/75">{label}</span>
            {children}
        </label>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-[18px] border border-black/8 bg-[#fbfaf7] px-4 py-3">
            <span className="text-sm text-black/55">{label}</span>
            <span className="text-right text-sm font-medium text-black/82">{value}</span>
        </div>
    );
}

function DashboardIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8h12l-1 12H7L6 8Z" />
            <path d="M9 8V6a3 3 0 1 1 6 0v2" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
            <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18Z" />
            <path d="M19 15l1.1 2.4L22.5 18l-2.4 1.1L19 21.5l-1.1-2.4L15.5 18l2.4-1.1L19 15Z" />
        </svg>
    );
}

function ChatIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        </svg>
    );
}