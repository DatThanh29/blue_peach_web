"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const KEY = "bp_admin_demo_authed";

export default function AdminGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname?.startsWith("/admin/login")) return;

    const ok = typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
    if (!ok) router.replace("/admin/login");
  }, [pathname, router]);

  return null;
}

export function setAdminDemoAuthed() {
  localStorage.setItem(KEY, "1");
}

export function clearAdminDemoAuthed() {
  localStorage.removeItem(KEY);
}
