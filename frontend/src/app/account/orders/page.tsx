"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { formatShortCode } from "@/utils/formatCode";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

type OrderItem = {
  ma_don_hang: string;
  ma_nguoi_dung: string | null;
  ngay_dat_hang: string | null;
  tong_tien_hang: number | null;
  giam_gia: number | null;
  phi_van_chuyen: number | null;
  tong_thanh_toan: number | null;
  trang_thai_don: string | null;
  trang_thai_thanh_toan: string | null;
  hinh_thuc_thanh_toan: string | null;
  ghi_chu: string | null;
  dia_chi_giao_hang_snapshot: any;
};

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "Chưa xác định";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa xác định";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderStatusLabel(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "Chờ xử lý";
    case "confirmed":
      return "Đã xác nhận";
    case "processing":
      return "Đang chuẩn bị";
    case "shipping":
      return "Đang giao";
    case "completed":
      return "Hoàn tất";
    case "cancelled":
      return "Đã hủy";
    default:
      return status || "Chưa xác định";
  }
}

function getPaymentStatusLabel(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "unpaid":
      return "Chưa thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "pending_payment":
      return "Chờ thanh toán";
    case "payment_failed":
      return "Thanh toán thất bại";
    default:
      return status || "Chưa xác định";
  }
}

function getPaymentMethodLabel(method?: string | null) {
  switch ((method || "").toLowerCase()) {
    case "cod":
      return "Thanh toán khi nhận hàng";
    case "vnpay":
      return "VNPay";
    default:
      return method || "Chưa xác định";
  }
}

function getOrderStatusClasses(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "border-[#ead7b5] bg-[#fff8eb] text-[#9b6a18]";
    case "confirmed":
    case "processing":
      return "border-[#d7def0] bg-[#f2f6ff] text-[#35528a]";
    case "shipping":
      return "border-[#d7e7f0] bg-[#f2fbff] text-[#2d677f]";
    case "completed":
      return "border-[#d6eadc] bg-[#edf9f0] text-[#2f6b3f]";
    case "cancelled":
      return "border-[#ecd4d4] bg-[#fff3f3] text-[#8f3f3f]";
    default:
      return "border-black/8 bg-[#fbfaf7] text-black/60";
  }
}

function getPaymentStatusClasses(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "paid":
      return "border-[#d6eadc] bg-[#edf9f0] text-[#2f6b3f]";
    case "unpaid":
      return "border-[#ead7b5] bg-[#fff8eb] text-[#9b6a18]";
    case "pending_payment":
      return "border-[#d7def0] bg-[#f2f6ff] text-[#35528a]";
    case "payment_failed":
      return "border-[#ecd4d4] bg-[#fff3f3] text-[#8f3f3f]";
    default:
      return "border-black/8 bg-[#fbfaf7] text-black/60";
  }
}

function renderAddress(snapshot: any) {
  if (!snapshot) return "Chưa có địa chỉ giao hàng";

  if (typeof snapshot === "string") return snapshot;

  return [
    snapshot.full_address,
    snapshot.address,
  ]
    .filter(Boolean)[0] || "Chưa có địa chỉ giao hàng";
}

export default function AccountOrdersPage() {
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

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
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

  useEffect(() => {
    if (!user?.id || !isAuthenticated || !isEmailVerified) return;
    void loadOrders();
  }, [user?.id, isAuthenticated, isEmailVerified]);

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
    {
      label: "Thông tin chung",
      href: "/account",
      icon: <DashboardIcon />,
    },
    {
      label: "Hồ sơ cá nhân",
      href: "/account/profile",
      icon: <UserIcon />,
    },
    {
      label: "Sổ địa chỉ",
      href: "/account/addresses",
      icon: <LocationIcon />,
    },
    {
      label: "Đơn hàng",
      href: "/account/orders",
      icon: <BagIcon />,
    },
    {
      label: "Thông báo",
      href: "/account/notifications",
      icon: <BellIcon />,
    },
    {
      label: "Yêu thích",
      href: "/account/wishlist",
      icon: <HeartIcon />,
    },
    {
      label: "AI tư vấn",
      href: "/account/ai-assistant",
      icon: <SparklesIcon />,
    },
    {
      label: "Chat với Admin",
      href: "/account/chat-admin",
      icon: <ChatIcon />,
    },
    {
      label: "Bảo mật tài khoản",
      href: "/account/security",
      icon: <ShieldIcon />,
    },
  ];

  async function loadOrders() {
    if (!user?.id) return;

    try {
      setPageLoading(true);
      setToast(null);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          ma_don_hang,
          ma_nguoi_dung,
          ngay_dat_hang,
          tong_tien_hang,
          giam_gia,
          phi_van_chuyen,
          tong_thanh_toan,
          trang_thai_don,
          trang_thai_thanh_toan,
          hinh_thuc_thanh_toan,
          ghi_chu,
          dia_chi_giao_hang_snapshot
        `
        )
        .eq("ma_nguoi_dung", user.id)
        .order("ngay_dat_hang", { ascending: false });

      if (error) {
        setToast({
          message: error.message || "Không thể tải danh sách đơn hàng.",
          type: "error",
        });
        return;
      }

      setOrders((data || []) as OrderItem[]);
    } catch (error) {
      console.error("[AccountOrdersPage] loadOrders failed:", error);
      setToast({
        message: "Không thể tải đơn hàng lúc này.",
        type: "error",
      });
    } finally {
      setPageLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setToast(null);

      const result = await signOut();

      if (result.error) {
        setToast({
          message: result.error,
          type: "error",
        });
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.error("[AccountOrdersPage] signOut failed:", error);
      setToast({
        message: "Không thể đăng xuất lúc này.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  }

  if (isLoading || !isAuthenticated || !isEmailVerified) {
    return (
      <main className="bp-surface bp-surface-plain min-h-screen">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản", href: "/account" },
            { label: "Đơn hàng", active: true },
          ]}
        />
        <section className="bp-container py-16">
          <div className="mx-auto max-w-[520px] text-center">
            <p className="text-sm text-black/60">Đang tải đơn hàng...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bp-surface bp-surface-plain min-h-screen">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản", href: "/account" },
          { label: "Đơn hàng", active: true },
        ]}
      />
      <section className="bp-container py-8 md:py-12">
        <div className="rounded-[34px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6">
          <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-[28px] border border-black/8 bg-[#f8f4ed] p-4 md:p-5">
              <div className="rounded-[24px] border border-black/8 bg-white/70 px-4 py-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#efe6d8] text-lg font-semibold tracking-[0.08em] text-black/78">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
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

                      {item.badge ? (
                        <span
                          className={[
                            "rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.12em]",
                            active
                              ? "bg-white/16 text-white"
                              : "bg-black/6 text-black/45",
                          ].join(" ")}
                        >
                          {item.badge}
                        </span>
                      ) : null}
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
                      Đơn hàng của tôi
                    </h1>

                    <p className="mt-4 max-w-[760px] text-sm leading-7 text-black/65">
                      Theo dõi các đơn hàng bạn đã đặt, trạng thái xử lý, trạng thái
                      thanh toán và thông tin giao hàng đã được ghi nhận tại thời điểm mua.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/products" className="bp-btn bp-btn--ghost">
                      Tiếp tục mua sắm
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      Lịch sử mua sắm
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-black">
                      Danh sách đơn hàng
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => void loadOrders()}
                    className="bp-btn bp-btn--ghost !px-4 !py-2"
                  >
                    Làm mới
                  </button>
                </div>

                {pageLoading ? (
                  <div className="mt-6 rounded-[22px] border border-black/8 bg-[#fbfaf7] px-4 py-5 text-sm text-black/60">
                    Đang tải danh sách đơn hàng...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="mt-6 rounded-[22px] border border-black/8 bg-[#fbfaf7] px-4 py-6 text-center">
                    <p className="text-sm font-medium text-black/75">
                      Bạn chưa có đơn hàng nào.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                      Hãy chọn sản phẩm yêu thích và hoàn tất thanh toán để đơn hàng đầu tiên xuất hiện tại đây.
                    </p>
                    <div className="mt-5">
                      <Link href="/products" className="bp-btn bp-btn--solid border-black">
                        Mua sắm ngay
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {orders.map((order) => (
                      <article
                        key={order.ma_don_hang}
                        className="rounded-[24px] border border-black/8 bg-[#fbfaf7] p-5 md:p-6"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-black">
                                Đơn hàng {formatShortCode(order.ma_don_hang, "#", 8)}
                              </p>

                              <span
                                className={[
                                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                                  getOrderStatusClasses(order.trang_thai_don),
                                ].join(" ")}
                              >
                                {getOrderStatusLabel(order.trang_thai_don)}
                              </span>

                              <span
                                className={[
                                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                                  getPaymentStatusClasses(order.trang_thai_thanh_toan),
                                ].join(" ")}
                              >
                                {getPaymentStatusLabel(order.trang_thai_thanh_toan)}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              <InfoTile
                                label="Ngày đặt"
                                value={formatDate(order.ngay_dat_hang)}
                              />
                              <InfoTile
                                label="Thanh toán"
                                value={getPaymentMethodLabel(order.hinh_thuc_thanh_toan)}
                              />
                              <InfoTile
                                label="Tạm tính"
                                value={formatCurrency(order.tong_tien_hang)}
                              />
                              <InfoTile
                                label="Tổng thanh toán"
                                value={formatCurrency(order.tong_thanh_toan)}
                              />
                            </div>

                            <div className="mt-4 rounded-[20px] border border-black/8 bg-white/70 px-4 py-4">
                              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
                                Địa chỉ giao hàng
                              </p>
                              <p className="mt-2 text-sm leading-7 text-black/72">
                                {renderAddress(order.dia_chi_giao_hang_snapshot)}
                              </p>
                            </div>

                            {order.ghi_chu ? (
                              <div className="mt-4 rounded-[20px] border border-black/8 bg-white/70 px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
                                  Ghi chú đơn hàng
                                </p>
                                <p className="mt-2 text-sm leading-7 text-black/72">
                                  {order.ghi_chu}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
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

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-black/8 bg-white/70 px-4 py-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-black/82">{value}</p>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18Z" />
      <path d="M19 15l1.1 2.4L22.5 18l-2.4 1.1L19 21.5l-1.1-2.4L15.5 18l2.4-1.1L19 15Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}