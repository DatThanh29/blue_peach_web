import { Suspense } from "react";
import AdminCategoriesClient from "./AdminCategoriesClient";

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f6f2] px-6 py-6">
          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 text-sm text-[#7a6a58]">
            Đang tải danh mục...
          </div>
        </main>
      }
    >
      <AdminCategoriesClient />
    </Suspense>
  );
}