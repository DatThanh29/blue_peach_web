"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const canSubmit = useMemo(() => {
    return (
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      !submitting &&
      ready
    );
  }, [newPassword, confirmPassword, submitting, ready]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const hash = window.location.hash || "";
        const search = new URLSearchParams(hash.replace(/^#/, ""));

        const accessToken = search.get("access_token");
        const refreshToken = search.get("refresh_token");
        const type = search.get("type");

        if (accessToken && refreshToken && type === "recovery") {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            if (mounted) {
              setToast({
                message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
                type: "error",
              });
            }
          } else {
            if (mounted) {
              setReady(true);
            }
          }

          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setReady(true);
          return;
        }

        setToast({
          message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
          type: "error",
        });
      } catch (error) {
        console.error("[ResetPasswordPage] init failed:", error);

        if (!mounted) return;

        setToast({
          message: "Không thể xác thực liên kết đặt lại mật khẩu.",
          type: "error",
        });
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ready) {
      setToast({
        message: "Liên kết đặt lại mật khẩu chưa sẵn sàng.",
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
        password: newPassword,
      });

      if (error) {
        setToast({
          message: error.message || "Không thể đặt lại mật khẩu.",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Đặt lại mật khẩu thành công. Đang chuyển về trang đăng nhập...",
        type: "success",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 1200);
    } catch (error) {
      console.error("[ResetPasswordPage] updateUser failed:", error);
      setToast({
        message: "Không thể đặt lại mật khẩu lúc này.",
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
        title="Đặt lại mật khẩu"
        subtitle="Tạo mật khẩu mới cho tài khoản Blue Peach của bạn."
      >
        {!ready ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-600">
            Đang xác thực liên kết đặt lại mật khẩu...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-black/80"
              >
                Mật khẩu mới
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-black/45">
                  <LockIcon />
                </span>

                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="auth-input pl-14 pr-14"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-black/45 transition hover:text-black/75"
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-black/80"
              >
                Nhập lại mật khẩu mới
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
                  placeholder="Nhập lại mật khẩu mới"
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
              {submitting ? "Đang cập nhật..." : "Xác nhận mật khẩu mới"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-black/60">
          Quay lại{" "}
          <Link
            href="/login"
            className="font-medium text-black transition hover:opacity-70"
          >
            đăng nhập
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