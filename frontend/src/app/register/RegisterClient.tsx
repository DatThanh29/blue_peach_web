"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getAuthErrorMessage(error?: string | null) {
    if (!error) return "Đã có lỗi xảy ra. Vui lòng thử lại.";

    const normalized = error.toLowerCase();

    if (normalized.includes("user already registered")) {
        return "Email này đã được đăng ký.";
    }

    if (normalized.includes("password should be at least")) {
        return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (normalized.includes("invalid email")) {
        return "Email không hợp lệ.";
    }

    if (
        normalized.includes("email rate limit exceeded") ||
        normalized.includes("too many requests")
    ) {
        return "Bạn thao tác quá nhanh. Vui lòng chờ ít phút rồi thử lại.";
    }

    return error;
}

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isEmailVerified, isLoading } = useCustomerAuth();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/account";
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
    } | null>(null);

    const canSubmit = useMemo(() => {
        return (
            fullName.trim().length > 0 &&
            email.trim().length > 0 &&
            password.length >= 6 &&
            confirmPassword.length >= 6 &&
            !submitting
        );
    }, [fullName, email, password, confirmPassword, submitting]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        if (isEmailVerified) {
            router.replace(redirectTo);
            return;
        }

        router.replace("/verify-email");
    }, [isLoading, isAuthenticated, isEmailVerified, router, redirectTo]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!fullName.trim()) {
            setToast({ message: "Vui lòng nhập họ và tên.", type: "error" });
            return;
        }

        if (!email.trim()) {
            setToast({ message: "Vui lòng nhập email.", type: "error" });
            return;
        }

        if (password.length < 6) {
            setToast({
                message: "Mật khẩu phải có ít nhất 6 ký tự.",
                type: "error",
            });
            return;
        }

        if (password !== confirmPassword) {
            setToast({
                message: "Mật khẩu nhập lại không khớp.",
                type: "error",
            });
            return;
        }

        try {
            setSubmitting(true);
            setToast(null);

            const emailRedirectTo = `${getBaseUrl()}/verify-email`;

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo,
                    data: {
                        full_name: fullName.trim(),
                        phone: phone.trim() || null,
                    },
                },
            });

            if (error) {
                setToast({
                    message: getAuthErrorMessage(error.message),
                    type: "error",
                });
                return;
            }

            const nextEmail = data.user?.email || email.trim();

            await supabase.auth.signOut();

            setToast({
                message: "Đăng ký thành công. Vui lòng kiểm tra email để xác minh.",
                type: "success",
            });

            router.replace(`/verify-email?email=${encodeURIComponent(nextEmail)}`);
        } catch (error) {
            console.error("[RegisterPage] signUp failed:", error);
            setToast({
                message: "Không thể đăng ký lúc này. Vui lòng thử lại.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <AuthSplitLayout
                mode="register"
                title="Tạo tài khoản"
                subtitle="Điền thông tin để bắt đầu trải nghiệm mua sắm và quản lý tài khoản cùng Blue Peach."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-medium text-black/80"
                        >
                            Họ và tên
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <UserIcon />
                            </span>

                            <input
                                id="fullName"
                                type="text"
                                autoComplete="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="auth-input pl-14"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-black/80"
                        >
                            Số điện thoại
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <PhoneIcon />
                            </span>

                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="0123 456 789"
                                className="auth-input pl-14"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-black/80"
                        >
                            Email
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <MailIcon />
                            </span>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="auth-input pl-14"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-black/80"
                        >
                            Mật khẩu
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <LockIcon />
                            </span>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tối thiểu 6 ký tự"
                                className="auth-input pl-14 pr-14"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-black/80"
                        >
                            Nhập lại mật khẩu
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <LockIcon />
                            </span>

                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                className="auth-input pl-14 pr-14"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="auth-submit mt-2"
                    >
                        {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-black/60">
                    Đã có tài khoản?{" "}
                    <Link
                        href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="font-medium text-black transition hover:opacity-70"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </AuthSplitLayout>

            {toast ? (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            ) : null}
        </>
    );
}

function UserIcon() {
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
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
        </svg>
    );
}

function PhoneIcon() {
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
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
        </svg>
    );
}

function MailIcon() {
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
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}

function LockIcon() {
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
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" />
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