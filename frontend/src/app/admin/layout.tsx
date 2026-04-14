import type { ReactNode } from "react";
import AdminGuard from "./ui/AdminGuard";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-900">
      <AdminGuard />

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}