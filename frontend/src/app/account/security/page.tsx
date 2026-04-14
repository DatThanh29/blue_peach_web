"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
};

export default function AccountSecurityPage() {
    const router = useRouter();
    const pathname = usePathname();

    const {
        user,
        profile,
        isLoading,
        isAuthenticated,
        isEmailVerified,
        signOut,
    } = useCustomerAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const displayName = useMemo(() => {
        if (profile?.full_name?.trim()) return profile.full_name.trim();
        if (user?.email) return user.email;
        return "Khách hàng Blue Peach";
    }, [profile?.full_name, user?.email]);

    const avatarText = useMemo(() => {
        if (profile?.full_name?.trim()) {
            const parts = profile.full_name.trim().split(/\s+/);
            const first = parts[0]?.[0] || "";
            const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
            return `${first}${last}`.toUpperCase();
        }

        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }

        return "BP";
    }, [profile?.full_name, user?.email]);

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
            badge: "Soon",
        },
        {
            label: "Yêu thích",
            href: "/account/wishlist",
            icon: <HeartIcon />,
            badge: "Soon",
        },
        {
            label: "AI tư vấn",
            href: "/account/ai-assistant",
            icon: <SparklesIcon />,
            badge: "Soon",
        },
        {
            label: "Chat với Admin",
            href: "/account/chat-admin",
            icon: <ChatIcon />,
            badge: "Soon",
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
            console.error("[AccountSecurityPage] signOut failed:", error);
            setToast({
                message: "Không thể đăng xuất lúc này.",
                type: "error",
            });
        } finally {
            setLoggingOut(false);
        }
    }

    async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!currentPassword.trim()) {
            setToast({
                message: "Vui lòng nhập mật khẩu hiện tại.",
                type: "error",
            });
            return;
        }

        if (!newPassword.trim()) {
            setToast({
                message: "Vui lòng nhập mật khẩu mới.",
                type: "error",
            });
            return;
        }

        if (newPassword.length < 6) {
            setToast({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
                type: "error",
            });
            return;
        }

        if (currentPassword === newPassword) {
            setToast({
                message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
                type: "error",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setToast({
                message: "Mật khẩu nhập lại không khớp.",
                type: "error",
            });
            return;
        }

        try {
            setSubmitting(true);
            setToast(null);

            const { error } = await supabase.auth.updateUser({
                current_password: currentPassword,
                password: newPassword,
            });

            if (error) {
                const normalized = (error.message || "").toLowerCase();

                if (
                    normalized.includes("invalid") ||
                    normalized.includes("current password") ||
                    normalized.includes("password")
                ) {
                    setToast({
                        message: "Mật khẩu hiện tại không đúng.",
                        type: "error",
                    });
                    return;
                }

                setToast({
                    message: error.message || "Không thể đổi mật khẩu.",
                    type: "error",
                });
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setToast({
                message: "Đổi mật khẩu thành công.",
                type: "success",
            });
        } catch (error) {
            console.error("[AccountSecurityPage] update password failed:", error);
            setToast({
                message: "Không thể đổi mật khẩu lúc này.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (isLoading || !isAuthenticated || !isEmailVerified) {
        return (
            <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
                <section className="bp-container py-16">
                    <div className="mx-auto max-w-[520px] text-center">
                        <p className="text-sm text-black/60">Đang tải bảo mật tài khoản...</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
            <section className="bp-container py-8 md:py-12">
                <div className="rounded-[34px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6">
                    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                        <aside className="rounded-[28px] border border-black/8 bg-[#f8f4ed] p-4 md:p-5">
                            <div className="rounded-[24px] border border-black/8 bg-white/70 px-4 py-6 text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#efe6d8] text-lg font-semibold tracking-[0.08em] text-black/78">
                                    {profile?.avatar ? (
                                        <img
                                            src={profile.avatar}
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
                                            Bảo mật tài khoản
                                        </h1>

                                        <p className="mt-4 max-w-[760px] text-sm leading-7 text-black/65">
                                            Quản lý thông tin đăng nhập và cập nhật mật khẩu để bảo vệ
                                            tài khoản khách hàng của bạn một cách an toàn hơn.
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

                            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                                <div className="space-y-6">
                                    <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                                            Thông tin bảo mật
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-black">
                                            Tài khoản đăng nhập
                                        </h2>

                                        <div className="mt-6 space-y-3">
                                            <InfoRow label="Email đăng nhập" value={user?.email || "Chưa có"} />
                                            <InfoRow label="Xác minh email" value="Đã xác minh" />
                                            <InfoRow
                                                label="Tình trạng tài khoản"
                                                value={profile?.is_blocked ? "Bị khóa" : "Đang hoạt động"}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] border border-[#ead7b5] bg-[#fff8eb] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.03)] md:p-8">
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#9b6a18]">
                                            Lưu ý
                                        </p>
                                        <h3 className="mt-2 text-xl font-semibold text-[#6a4c18]">
                                            Gợi ý bảo mật
                                        </h3>

                                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6a4c18]">
                                            <li>• Nên dùng mật khẩu có ít nhất 6 ký tự trở lên.</li>
                                            <li>• Không dùng chung mật khẩu với các dịch vụ khác.</li>
                                            <li>• Nếu quên mật khẩu, hãy dùng chức năng quên mật khẩu.</li>
                                        </ul>

                                        <div className="mt-6">
                                            <Link href="/forgot-password" className="bp-btn bp-btn--ghost">
                                                Quên mật khẩu
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                                        Đổi mật khẩu
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-black">
                                        Cập nhật mật khẩu mới
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-black/60">
                                        Để đổi mật khẩu, vui lòng xác nhận đúng mật khẩu hiện tại trước khi đặt mật khẩu mới cho tài khoản này.
                                    </p>

                                    <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
                                        <FormField label="Mật khẩu hiện tại">
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Nhập mật khẩu hiện tại"
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 pr-14 text-sm outline-none transition focus:border-black/25"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                                    aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                                                >
                                                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </FormField>

                                        <FormField label="Mật khẩu mới">
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Tối thiểu 6 ký tự"
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 pr-14 text-sm outline-none transition focus:border-black/25"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                                    aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                                                >
                                                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </FormField>

                                        <FormField label="Nhập lại mật khẩu mới">
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 pr-14 text-sm outline-none transition focus:border-black/25"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                                                >
                                                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </FormField>

                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={[
                                                    "bp-btn bp-btn--solid border-black",
                                                    "disabled:cursor-not-allowed disabled:opacity-60",
                                                ].join(" ")}
                                            >
                                                {submitting ? "Đang cập nhật..." : "Đổi mật khẩu"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCurrentPassword("");
                                                    setNewPassword("");
                                                    setConfirmPassword("");
                                                    setToast(null);
                                                }}
                                                className="bp-btn bp-btn--ghost"
                                            >
                                                Làm mới
                                            </button>
                                        </div>
                                    </form>
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
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8h12l-1 12H7L6 8Z" />
            <path d="M9 8V6a3 3 0 1 1 6 0v2" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
            <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18Z" />
            <path d="M19 15l1.1 2.4L22.5 18l-2.4 1.1L19 21.5l-1.1-2.4L15.5 18l2.4-1.1L19 15Z" />
        </svg>
    );
}

function ChatIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a3 3 0 0 0 4 4" />
            <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c6 0 9.5 7 9.5 7a17.6 17.6 0 0 1-3.2 4.2" />
            <path d="M6.2 6.3C3.9 8 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.5-1.1" />
        </svg>
    );
}