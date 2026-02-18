"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] border-r border-zinc-200 bg-white p-4 md:block">
      <div className="mb-6">
        <div className="text-lg font-bold">Blue Peach • Admin</div>
        <div className="text-xs text-zinc-500">Quản trị cửa hàng</div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavItem href="/admin/orders" label="Orders" />
        {/* Bạn có thể thêm: Products, Customers, Dashboard... */}
      </nav>

      <div className="mt-6 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-500">
        Tip: Trang /admin/orders là phần “ăn điểm” nhất.
      </div>
    </aside>
  );
}
