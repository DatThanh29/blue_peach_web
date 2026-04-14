"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: "staff",
          },
        },
      });

      if (error) throw error;

      setMessage(
        "Đăng ký thành công. Nếu project đang bật xác nhận email, hãy xác nhận email trước khi đăng nhập."
      );

      setTimeout(() => {
        router.replace("/admin/login");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-zinc-900">Admin Register</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Tạo tài khoản quản trị. Role mặc định sau đăng ký là staff.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleRegister}>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Họ tên
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Số điện thoại
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            placeholder="09xxxxxxxx"
          />
        </div>

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
            placeholder="staff@bluepeach.com"
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
            minLength={6}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
        </button>
      </form>

      <p className="mt-5 text-sm text-zinc-500">
        Đã có tài khoản?{" "}
        <Link href="/admin/login" className="font-medium text-zinc-900 underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}