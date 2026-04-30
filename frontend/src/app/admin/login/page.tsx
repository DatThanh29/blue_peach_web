"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      try {
        const res = await adminFetch("/admin/me");
        const role = res?.user?.role;

        if (role !== "admin" && role !== "staff") {
          await supabase.auth.signOut();
          setToast({
            message: "Tài khoản này không có quyền truy cập trang quản trị.",
            type: "error",
          });
          return;
        }

        router.replace("/admin");
      } catch (adminError: any) {
        if (adminError?.status === 403) {
          await supabase.auth.signOut();
          setToast({
            message: "Tài khoản này không có quyền truy cập trang quản trị.",
            type: "error",
          });
          return;
        }

        throw adminError;
      }
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f3ee] px-4 py-8 text-zinc-900 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/admin-login-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[3px]" />
      <div className="pointer-events-none absolute -left-28 top-[-120px] h-80 w-80 rounded-full bg-[#e7d6c3]/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-[#dbe8ee]/80 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(92,74,57,0.16)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden min-h-[640px] flex-col justify-between bg-[#201b18] p-10 text-white lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,211,180,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(180,212,226,0.2),transparent_30%)]" />

            <div className="relative">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 transition hover:bg-white/15"
              >
                Blue Peach
              </Link>

              <div className="mt-20">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75">
                  <Sparkles size={14} />
                  Admin Workspace
                </div>

                <h1 className="max-w-md text-5xl font-semibold leading-tight tracking-[-0.04em]">
                  Quản trị cửa hàng trang sức bạc Blue Peach.
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
                  Khu vực dành cho admin và staff để vận hành sản phẩm, đơn
                  hàng, đánh giá, tồn kho và nội dung hiển thị trên website.
                </p>
              </div>
            </div>

            <div className="relative grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#f3d6bd]" size={22} />
                  <div>
                    <p className="text-sm font-semibold">Phân quyền bảo mật</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Chỉ tài khoản có role admin hoặc staff mới được truy cập.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="text-[#cfe4ed]" size={22} />
                  <div>
                    <p className="text-sm font-semibold">Supabase Auth</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      Đăng nhập bằng email và mật khẩu đã được cấp quyền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-[640px] items-center justify-center px-5 py-10 sm:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <Link
                  href="/"
                  className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400"
                >
                  Blue Peach
                </Link>
              </div>

              <div className="rounded-[32px] border border-[#eadfd2] bg-white p-7 shadow-sm sm:p-8">
                <div className="mb-8">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3ece5] text-[#8a6646]">
                    <ShieldCheck size={24} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a18b75]">
                    Blue Peach Admin
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
                    Đăng nhập quản trị
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    Sử dụng tài khoản admin hoặc staff để tiếp tục vào khu vực
                    vận hành hệ thống.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-2xl border border-[#ded3c7] bg-[#fffdfb] px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-350 focus:border-[#9f7b5b] focus:bg-white focus:ring-4 focus:ring-[#9f7b5b]/10"
                      placeholder="admin@bluepeach.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-[#ded3c7] bg-[#fffdfb] px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-350 focus:border-[#9f7b5b] focus:bg-white focus:ring-4 focus:ring-[#9f7b5b]/10"
                      placeholder="••••••••"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-zinc-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2c2119] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading ? "Đang xác thực..." : "Đăng nhập Admin"}
                    </span>
                  </button>
                </form>

                <div className="mt-7 rounded-2xl bg-[#f7f3ee] px-4 py-3 text-xs leading-5 text-zinc-500">
                  Nếu bạn là nhân viên mới, hãy liên hệ admin để được cấp quyền
                  staff trước khi đăng nhập.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

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