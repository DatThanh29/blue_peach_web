"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const res = await adminFetch("/admin/me");
      const role = res?.user?.role;

      if (role !== "admin" && role !== "staff") {
        await supabase.auth.signOut();
        throw new Error("Tài khoản này không có quyền truy cập admin.");
      }

      router.replace("/admin");
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[1100px] gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Blue Peach
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
            Admin
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Khu vực quản trị dành cho staff và admin, dùng để vận hành đơn hàng,
            sản phẩm, nội dung, kho, thông báo và hỗ trợ khách hàng.
          </p>

          <div className="mt-8 rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-semibold text-zinc-900">Đăng nhập bảo mật</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Chỉ tài khoản có quyền staff hoặc admin mới có thể truy cập khu vực này.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Blue Peach Admin
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
              Đăng nhập
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Đăng nhập bằng tài khoản staff hoặc admin.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="admin@bluepeach.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="••••••••"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}