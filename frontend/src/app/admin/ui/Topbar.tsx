"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearAdminDemoAuthed } from "./AdminGuard";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title =
    pathname?.startsWith("/admin/orders") ? "Orders" :
    pathname?.startsWith("/admin/login") ? "Login" :
    "Admin";

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div>
        <div className="text-sm text-zinc-500">Admin</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>

      <button
        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
        onClick={() => {
          clearAdminDemoAuthed();
          router.replace("/admin/login");
        }}
      >
        Logout (demo)
      </button>
    </header>
  );
}
