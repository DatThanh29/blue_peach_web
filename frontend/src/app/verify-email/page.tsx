"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getResendErrorMessage(error?: string | null) {
  if (!error) return "Không thể gửi lại email xác minh.";

  const normalized = error.toLowerCase();

  if (normalized.includes("security purposes")) {
    return "Bạn vừa thao tác gần đây. Vui lòng chờ một chút rồi thử lại.";
  }

  if (normalized.includes("email rate limit exceeded")) {
    return "Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau.";
  }

  return error;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAuthenticated, isEmailVerified } = useCustomerAuth();

  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const emailFromQuery = searchParams.get("email") || "";
  const email = useMemo(() => user?.email || emailFromQuery || "", [user?.email, emailFromQuery]);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && isEmailVerified) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, isEmailVerified, router]);

  async function handleResendEmail() {
    if (!email) {
      setToast({
        message: "Không tìm thấy email để gửi lại xác minh.",
        type: "error",
      });
      return;
    }

    try {
      setResending(true);
      setToast(null);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${getBaseUrl()}/verify-email`,
        },
      });

      if (error) {
        setToast({
          message: getResendErrorMessage(error.message),
          type: "error",
        });
        return;
      }

      setToast({
        message: "Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư của bạn.",
        type: "success",
      });
    } catch (error) {
      console.error("[VerifyEmailPage] resend failed:", error);
      setToast({
        message: "Không thể gửi lại email xác minh lúc này.",
        type: "error",
      });
    } finally {
      setResending(false);
    }
  }

  async function handleRefreshStatus() {
    try {
      setChecking(true);
      setToast(null);

      const {
        data: { user: refreshedUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setToast({
          message: error.message || "Không thể kiểm tra trạng thái xác minh.",
          type: "error",
        });
        return;
      }

      if (refreshedUser?.email_confirmed_at) {
        setToast({
          message: "Email đã được xác minh. Đang chuyển đến tài khoản...",
          type: "success",
        });
        router.replace("/account");
        return;
      }

      setToast({
        message: "Email của bạn vẫn chưa được xác minh.",
        type: "info",
      });
    } catch (error) {
      console.error("[VerifyEmailPage] refresh status failed:", error);
      setToast({
        message: "Không thể kiểm tra trạng thái xác minh lúc này.",
        type: "error",
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
      <section className="bp-container py-10 md:py-14">
        <div className="mx-auto max-w-[620px] rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)] md:p-8">
          <div className="text-center">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/55">
              Blue Peach Account
            </p>
            <h1 className="font-heading text-4xl text-black md:text-5xl">
              Xác minh email
            </h1>
            <p className="mt-4 text-sm leading-7 text-black/65">
              Chúng tôi đã gửi email xác minh để kích hoạt tài khoản của bạn.
              Vui lòng mở hộp thư và bấm vào liên kết xác minh trước khi tiếp tục.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-black/8 bg-[#f8f6f1] px-5 py-4 text-sm leading-7 text-black/75">
            <p className="font-medium text-black/85">Email đang chờ xác minh:</p>
            <p className="mt-1 break-all font-semibold text-black">
              {email || "Chưa xác định được email"}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={checking}
              className={[
                "bp-btn bp-btn--solid w-full border-black",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {checking ? "Đang kiểm tra..." : "Tôi đã xác minh, kiểm tra lại"}
            </button>

            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resending || !email}
              className={[
                "bp-btn bp-btn--ghost w-full",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {resending ? "Đang gửi lại..." : "Gửi lại email xác minh"}
            </button>
          </div>

          <div className="mt-8 space-y-3 text-center text-sm text-black/65">
            <p>
              Đã có tài khoản khác?{" "}
              <Link href="/login" className="bp-link font-semibold text-black">
                Đăng nhập lại
              </Link>
            </p>

            <p>
              Chưa nhận được email? Hãy kiểm tra mục spam hoặc quảng cáo trong hộp thư.
            </p>
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