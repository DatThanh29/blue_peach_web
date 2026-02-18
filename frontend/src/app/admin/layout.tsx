import type { ReactNode } from "react";
import AdminGuard from "./ui/AdminGuard";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <AdminGuard />

      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar />

        <div className="flex min-h-screen w-full flex-col">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
