"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getForgotPasswordErrorMessage(error?: string | null) {
  if (!error) return "Không thể gửi email đặt lại mật khẩu.";

  const normalized = error.toLowerCase();

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && !submitting;
  }, [email, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setToast({
        message: "Vui lòng nhập email.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      setToast(null);

      const redirectTo = `${getBaseUrl()}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        setToast({
          message: getForgotPasswordErrorMessage(error.message),
          type: "error",
        });
        return;
      }

      setSent(true);
      setToast({
        message: "Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.",
        type: "success",
      });
    } catch (error) {
      console.error("[ForgotPasswordPage] resetPasswordForEmail failed:", error);
      setToast({
        message: "Không thể gửi email lúc này. Vui lòng thử lại.",
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
        title="Quên mật khẩu"
        subtitle="Nhập email tài khoản để nhận liên kết đặt lại mật khẩu từ Blue Peach."
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

          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              Email đặt lại mật khẩu đã được gửi. Hãy mở hộp thư và bấm vào liên kết trong email để tiếp tục.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="auth-submit mt-2"
          >
            {submitting ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-black/60">
          Đã nhớ mật khẩu?{" "}
          <Link
            href="/login"
            className="font-medium text-black transition hover:opacity-70"
          >
            Quay lại đăng nhập
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