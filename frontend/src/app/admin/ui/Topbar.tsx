"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "./AdminGuard";
import { adminFetch } from "@/lib/api";

type MeResponse = {
  user?: {
    userId: string;
    email?: string | null;
    role?: "admin" | "staff" | "customer";
    profile?: {
      full_name?: string | null;
      phone?: string | null;
      role?: string | null;
    };
  };
};

function getPageTitle(pathname: string | null) {
  if (pathname === "/admin") return "Tổng quan";
  if (pathname?.startsWith("/admin/orders")) return "Đơn hàng";
  if (pathname?.startsWith("/admin/products")) return "Sản phẩm";
  if (pathname?.startsWith("/admin/categories")) return "Danh mục";
  if (pathname?.startsWith("/admin/reviews")) return "Đánh giá";
  if (pathname?.startsWith("/admin/login")) return "Đăng nhập";
  if (pathname?.startsWith("/admin/register")) return "Đăng ký";
  return "Quản trị";
}

function getPageDescription(pathname: string | null) {
  if (pathname === "/admin") {
    return "Tổng quan doanh thu, đơn hàng, thanh toán và tồn kho.";
  }
  if (pathname?.startsWith("/admin/orders")) {
    return "Theo dõi danh sách đơn hàng và cập nhật trạng thái xử lý.";
  }
  if (pathname?.startsWith("/admin/products")) {
    return "Quản lý sản phẩm, hình ảnh, tồn kho và trạng thái hiển thị.";
  }
  if (pathname?.startsWith("/admin/categories")) {
    return "Quản lý danh mục sản phẩm để storefront rõ ràng hơn.";
  }
  if (pathname?.startsWith("/admin/reviews")) {
    return "Duyệt, ẩn và quản lý đánh giá sản phẩm từ khách hàng.";
  }
  return "Khu vực quản trị Blue Peach.";
}

function roleLabel(role?: string | null) {
  if (role === "admin") return "Admin";
  if (role === "staff") return "Staff";
  return "Người dùng";
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title = getPageTitle(pathname);
  const description = getPageDescription(pathname);

  const [fullName, setFullName] = useState("...");
  const [role, setRole] = useState<string>("Người dùng");

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      if (pathname?.startsWith("/admin/login")) return;
      if (pathname?.startsWith("/admin/register")) return;

      try {
        const res = (await adminFetch("/admin/me")) as MeResponse;
        if (!mounted) return;

        setFullName(
          res?.user?.profile?.full_name ||
            res?.user?.email ||
            "Blue Peach User"
        );
        setRole(roleLabel(res?.user?.role));
      } catch {
        if (!mounted) return;
        setFullName("Blue Peach User");
        setRole("Người dùng");
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f7f7f5]/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Blue Peach Admin
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm sm:inline-flex">
              {todayLabel}
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-sm md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                {fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="pr-2">
                <div className="text-sm font-semibold text-zinc-900">
                  {fullName}
                </div>
                <div className="text-xs text-zinc-500">{role}</div>
              </div>
            </div>

            <button
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              onClick={async () => {
                await logoutAdmin();
                router.replace("/admin/login");
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}