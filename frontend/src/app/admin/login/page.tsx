"use client";

import { useRouter } from "next/navigation";
import { setAdminDemoAuthed } from "../ui/AdminGuard";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">Admin Login (demo)</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Chưa cần auth thật. Nhấn nút để vào Admin.
      </p>

      <button
        className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setAdminDemoAuthed();
          router.replace("/admin/orders");
        }}
      >
        {loading ? "Đang vào..." : "Vào Admin"}
      </button>
    </div>
  );
}
