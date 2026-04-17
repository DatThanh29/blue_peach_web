"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { useWishlist } from "@/hooks/useWishlist";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

function HeartFilledIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
    </svg>
  );
}

export default function AccountWishlistPage() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    signOut,
  } = useCustomerAuth();

  const { items, loading, toggleWishlist, isToggling } = useWishlist();

  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isEmailVerified) {
      router.replace(
        `/verify-email${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`
      );
    }
  }, [isLoading, isAuthenticated, isEmailVerified, router, user?.email]);

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) return profile.full_name.trim();
    if (user?.email) return user.email;
    return "Khách hàng Blue Peach";
  }, [profile?.full_name, user?.email]);

  const avatarText = useMemo(() => {
    if (profile?.full_name?.trim()) {
      const parts = profile.full_name.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
      return `${first}${last}`.toUpperCase();
    }

    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return "BP";
  }, [profile?.full_name, user?.email]);

  const navItems: NavItem[] = [
    { label: "Thông tin chung", href: "/account", icon: <DashboardIcon /> },
    { label: "Hồ sơ cá nhân", href: "/account/profile", icon: <UserIcon /> },
    { label: "Sổ địa chỉ", href: "/account/addresses", icon: <LocationIcon /> },
    { label: "Đơn hàng", href: "/account/orders", icon: <BagIcon /> },
    { label: "Thông báo", href: "/account/notifications", icon: <BellIcon /> },
    { label: "Yêu thích", href: "/account/wishlist", icon: <HeartIcon /> },
    { label: "AI tư vấn", href: "/account/ai-assistant", icon: <SparklesIcon /> },
    { label: "Chat với Admin", href: "/account/chat-admin", icon: <ChatIcon /> },
    { label: "Bảo mật tài khoản", href: "/account/security", icon: <ShieldIcon /> },
  ];

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setToast(null);

      const result = await signOut();
      if (result.error) {
        setToast({ message: result.error, type: "error" });
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.error("[AccountWishlistPage] signOut failed:", error);
      setToast({
        message: "Không thể đăng xuất lúc này.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleRemove(productId: string) {
    try {
      await toggleWishlist(productId);
      setToast({
        message: "Đã xoá khỏi danh sách yêu thích",
        type: "success",
      });
    } catch (error) {
      console.error("[AccountWishlistPage] remove wishlist failed:", error);
      setToast({
        message: "Không thể cập nhật wishlist lúc này.",
        type: "error",
      });
    }
  }

  if (isLoading || !isAuthenticated || !isEmailVerified) {
    return (
      <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
        <section className="bp-container py-16">
          <div className="mx-auto max-w-[520px] text-center">
            <p className="text-sm text-black/60">Đang tải danh sách yêu thích...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
      <section className="bp-container py-8 md:py-12">
        <div className="rounded-[34px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6">
          <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-[28px] border border-black/8 bg-[#f8f4ed] p-4 md:p-5">
              <div className="rounded-[24px] border border-black/8 bg-white/70 px-4 py-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#efe6d8] text-lg font-semibold tracking-[0.08em] text-black/78">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    avatarText
                  )}
                </div>

                <p className="mt-4 truncate text-lg font-semibold text-black">
                  {displayName}
                </p>
              </div>

              <nav className="mt-4 space-y-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center justify-between rounded-[18px] px-4 py-3 text-sm transition",
                        active
                          ? "bg-black text-white shadow-sm"
                          : "bg-white/70 text-black/75 hover:bg-white",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-3">
                        <span className={active ? "text-white" : "text-black/65"}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#f7f1e7_0%,#f2eadf_100%)] p-6 md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Tài khoản Blue Peach
                    </p>

                    <h1 className="font-heading text-4xl leading-tight text-black md:text-5xl">
                      Danh sách yêu thích
                    </h1>

                    <p className="mt-4 max-w-[760px] text-sm leading-7 text-black/65">
                      Những sản phẩm bạn đã lưu để xem lại nhanh hơn ở những lần mua sắm sau.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/products" className="bp-btn bp-btn--ghost">
                      Khám phá sản phẩm
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="bp-btn bp-btn--ghost disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                {loading ? (
                  <p className="text-sm text-black/60">Đang tải wishlist...</p>
                ) : items.length === 0 ? (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-black">
                      Chưa có sản phẩm yêu thích
                    </h2>
                    <p className="mx-auto mt-4 max-w-[680px] text-sm leading-7 text-black/62">
                      Bạn chưa lưu sản phẩm nào. Hãy khám phá bộ sưu tập và nhấn biểu tượng trái tim
                      để thêm vào danh sách yêu thích.
                    </p>

                    <div className="mt-6">
                      <Link href="/products" className="bp-btn bp-btn--solid border-black">
                        Xem tất cả sản phẩm
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                      const p = item.product;

                      return (
                        <article
                          key={item.id}
                          className="rounded-[24px] border border-black/8 bg-[#fbfaf7] p-4"
                        >
                          <Link href={`/products/${p.ma_san_pham}`} className="group block">
                            <div className="aspect-square overflow-hidden rounded-[18px] bg-white">
                              {p.primary_image ? (
                                <img
                                  src={p.primary_image}
                                  alt={p.ten_san_pham}
                                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-black/35">
                                  Chưa có ảnh
                                </div>
                              )}
                            </div>

                            <div className="mt-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                                Đã lưu ngày{" "}
                                {new Date(item.created_at).toLocaleDateString("vi-VN")}
                              </p>

                              <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold leading-6 text-black">
                                {p.ten_san_pham}
                              </h3>

                              <p className="mt-3 text-[15px] font-medium text-black/82">
                                {Number(p.gia_ban).toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                          </Link>

                          <div className="mt-5 flex gap-3">
                            <Link
                              href={`/products/${p.ma_san_pham}`}
                              className="bp-btn bp-btn--ghost !px-4 !py-2"
                            >
                              Xem chi tiết
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleRemove(p.ma_san_pham)}
                              disabled={isToggling(p.ma_san_pham)}
                              className="bp-btn bp-btn--ghost !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isToggling(p.ma_san_pham) ? "Đang xoá..." : "Bỏ lưu"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </main>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
    </svg>
  );
}
function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18Z" />
      <path d="M19 15l1.1 2.4L22.5 18l-2.4 1.1L19 21.5l-1.1-2.4L15.5 18l2.4-1.1L19 15Z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}