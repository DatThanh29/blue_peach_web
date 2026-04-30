"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/api";

export default function AdminGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      if (pathname?.startsWith("/admin/login")) return;
      if (pathname?.startsWith("/admin/register")) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (mounted) router.replace("/admin/login");
        return;
      }

      try {
        const res = await adminFetch("/admin/me");
        const role = res?.user?.role;

        if (role !== "admin" && role !== "staff") {
          if (mounted) router.replace("/admin/login?error=forbidden");
          return;
        }
        const adminOnlyPaths = ["/admin/users"];

        const isAdminOnlyPath = adminOnlyPaths.some(
          (item) => pathname === item || pathname?.startsWith(item + "/")
        );

        if (isAdminOnlyPath && role !== "admin") {
          if (mounted) router.replace("/admin");
          return;
        }
      } catch (error) {
        const status =
          error && typeof error === "object" && "status" in error
            ? (error as { status?: number }).status
            : undefined;

        if (status === 401) {
          await supabase.auth.signOut();
          if (mounted) router.replace("/admin/login");
          return;
        }

        if (status === 403) {
          if (mounted) router.replace("/admin/login?error=forbidden");
          return;
        }

        if (mounted) router.replace("/admin/login");
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  return null;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}