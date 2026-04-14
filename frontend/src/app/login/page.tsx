"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

function getLoginErrorMessage(error?: string | null) {
    if (!error) return "Đăng nhập thất bại. Vui lòng thử lại.";

    const normalized = error.toLowerCase();

    if (normalized.includes("email not confirmed")) {
        return "Tài khoản chưa xác minh email. Vui lòng kiểm tra hộp thư của bạn.";
    }

    if (
        normalized.includes("invalid login credentials") ||
        normalized.includes("invalid credentials")
    ) {
        return "Email hoặc mật khẩu không đúng.";
    }

    if (normalized.includes("too many requests")) {
        return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
    }

    return error;
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, isEmailVerified, isLoading, profile } =
        useCustomerAuth();
    const redirectTo = searchParams.get("redirect") || "/account";

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
    } | null>(null);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length > 0 && !submitting;
    }, [email, password, submitting]);

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        if (profile?.is_blocked) {
            router.replace("/verify-email");
            return;
        }

        if (isEmailVerified) {
            router.replace(redirectTo);
            return;
        }

        router.replace("/verify-email");
    }, [isLoading, isAuthenticated, isEmailVerified, profile, router, redirectTo]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email.trim()) {
            setToast({ message: "Vui lòng nhập email.", type: "error" });
            return;
        }

        if (!password.trim()) {
            setToast({ message: "Vui lòng nhập mật khẩu.", type: "error" });
            return;
        }

        try {
            setSubmitting(true);
            setToast(null);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                const normalized = error.message.toLowerCase();

                if (normalized.includes("email not confirmed")) {
                    setToast({
                        message:
                            "Tài khoản chưa xác minh email. Đang chuyển tới trang xác minh...",
                        type: "info",
                    });

                    router.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
                    return;
                }

                setToast({
                    message: getLoginErrorMessage(error.message),
                    type: "error",
                });
                return;
            }

            const nextUser = data.user;
            const isVerified = !!nextUser?.email_confirmed_at;

            setToast({
                message: isVerified
                    ? "Đăng nhập thành công."
                    : "Tài khoản chưa xác minh email.",
                type: isVerified ? "success" : "info",
            });

            if (isVerified) {
                router.replace(redirectTo);
            } else {
                router.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
            }
        } catch (error) {
            console.error("[LoginPage] signInWithPassword failed:", error);
            setToast({
                message: "Không thể đăng nhập lúc này. Vui lòng thử lại.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setSubmitting(true);
            setToast(null);

            const redirectTarget = searchParams.get("redirect") || "/account";
            const origin =
                typeof window !== "undefined"
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}`,
                },
            });

            if (error) {
                setToast({
                    message: error.message || "Không thể đăng nhập với Google.",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("[LoginPage] Google sign in failed:", error);
            setToast({
                message: "Không thể đăng nhập với Google lúc này.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <AuthSplitLayout
                mode="login"
                title="Đăng nhập"
                subtitle="Đăng nhập để quản lý tài khoản, theo dõi đơn hàng và tiếp tục trải nghiệm mua sắm cùng Blue Peach."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-black/80"
                            >
                                Mật khẩu
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-black/55 transition hover:text-black"
                            >
                                Quên mật khẩu
                            </Link>
                        </div>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                                <LockIcon />
                            </span>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="auth-input pl-14 pr-14"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="auth-submit mt-2"
                    >
                        {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-black/60">
                    Chưa có tài khoản?{" "}
                    <Link
                        href={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="font-medium text-black transition hover:opacity-70"
                    >
                        Tạo tài khoản
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