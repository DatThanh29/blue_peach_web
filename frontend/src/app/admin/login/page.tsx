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
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-zinc-900">Admin Login</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Đăng nhập bằng tài khoản staff hoặc admin.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
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
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
        </button>
      </form>

      <p className="mt-5 text-sm text-zinc-500">
        Chưa có tài khoản?{" "}
        <Link href="/admin/register" className="font-medium text-zinc-900 underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}