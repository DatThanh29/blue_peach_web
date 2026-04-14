"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type Role = "admin" | "staff" | "customer";

type MeResponse = {
  user?: {
    role?: Role;
    profile?: {
      full_name?: string | null;
    };
  };
};

type NavSection = {
  group: string;
  items: Array<{ href: string; label: string }>;
};

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();

  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={[
        "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-white hover:text-zinc-900",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "h-2 w-2 rounded-full transition",
          active ? "bg-white/90" : "bg-zinc-300 group-hover:bg-zinc-500",
        ].join(" ")}
      />
    </Link>
  );
}

export default function Sidebar() {
  const [role, setRole] = useState<Role>("staff");
  const [fullName, setFullName] = useState("Blue Peach User");

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      try {
        const res = (await adminFetch("/admin/me")) as MeResponse;
        if (!mounted) return;

        setRole((res?.user?.role as Role) || "staff");
        setFullName(res?.user?.profile?.full_name || "Blue Peach User");
      } catch {
        if (!mounted) return;
        setRole("staff");
        setFullName("Blue Peach User");
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  const staffSections: NavSection[] = [
    {
      group: "Tổng quan",
      items: [{ href: "/admin", label: "Tổng quan" }],
    },
    {
      group: "Vận hành",
      items: [
        { href: "/admin/orders", label: "Đơn hàng" },
        { href: "/admin/products", label: "Sản phẩm" },
        { href: "/admin/categories", label: "Danh mục" },
      ],
    },
    {
      group: "Nội dung & chăm sóc",
      items: [
        { href: "/admin/banners", label: "Banner" },
        { href: "/admin/news", label: "Tin tức" },
        { href: "/admin/reviews", label: "Đánh giá" },
        { href: "/admin/coupons", label: "Mã giảm giá" },
      ],
    },
    {
      group: "Kho & báo cáo",
      items: [
        { href: "/admin/inventory", label: "Tồn kho" },
        { href: "/admin/reports", label: "Báo cáo" },
      ],
    },
  ];

const adminOnlySections: NavSection[] = [
  {
    group: "Quản trị hệ thống",
    items: [{ href: "/admin/users", label: "Người dùng" }],
  },
];

  const navigation =
    role === "admin"
      ? [...staffSections, ...adminOnlySections]
      : staffSections;

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-zinc-200/80 bg-[#f3f3f0] md:block">
      <div className="flex h-full flex-col p-5">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Blue Peach
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {role === "admin" ? "Quản trị viên" : "Nhân viên"}
          </div>
          <div className="mt-2 text-sm font-medium text-zinc-800">
            {fullName}
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-500">
            {role === "admin"
              ? "Toàn quyền quản trị hệ thống, vận hành bán hàng và quản lý người dùng."
              : "Quản lý vận hành bán hàng, sản phẩm, nội dung, đánh giá và kho."}
          </div>
        </div>

        <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
          {navigation.map((section) => (
            <div key={section.group}>
              <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {section.group}
              </div>

              <nav className="space-y-2">
                {section.items.map((item) => (
                  <NavItem key={item.href} href={item.href} label={item.label} />
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900">Workspace</div>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {role === "admin"
              ? "Admin có toàn quyền với vận hành, nội dung, kho, báo cáo và người dùng."
              : "Staff hiện được phép quản lý đơn hàng, sản phẩm, danh mục, banner, tin tức, đánh giá và kho."}
          </p>
        </div>
      </div>
    </aside>
  );
}