"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CartIcon from "@/components/CartIcon";
import Toast from "@/components/Toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { useNotifications } from "@/hooks/useNotifications";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    signOut,
  } = useCustomerAuth();
  const { unreadCount } = useNotifications();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const isHome = pathname === "/";
  const showOverlayHeader = isHome && !scrolled;
  const overlayDark = showOverlayHeader && !headerHovered;

  useEffect(() => {
    const getTop = () => {
      const se = document.scrollingElement as HTMLElement | null;
      return Math.max(
        window.scrollY || 0,
        se?.scrollTop ?? 0,
        document.documentElement?.scrollTop ?? 0,
        document.body?.scrollTop ?? 0
      );
    };

    const onScroll = () => {
      const y = getTop();

      setScrolled((prev) => {
        if (!prev && y > 130) return true;
        if (prev && y < 24) return false;
        return prev;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHeaderHovered(true);
  };

  const handleLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHeaderHovered(false);
    }, 90);
  };

  const showSolidHeader = !isHome || scrolled;

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

      setToast({
        message: "Đăng xuất thành công.",
        type: "success",
      });

      router.replace("/login");
    } catch (error) {
      console.error("[Header] signOut failed:", error);
      setToast({
        message: "Không thể đăng xuất lúc này.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      {showOverlayHeader && (
        <header className="absolute inset-x-0 top-0 z-50 w-full">
          <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={[
              "relative transition-all duration-300",
              headerHovered
                ? "bg-[#efe8dc]/72 text-zinc-900 backdrop-blur-xl shadow-[0_10px_28px_rgba(0,0,0,0.06)]"
                : "bg-black/[0.08] text-white backdrop-blur-[1px]",
            ].join(" ")}
          >
            <div className="bp-container flex h-10 items-center justify-between text-[12px] tracking-[0.08em]">
              <Link
                href="/stores"
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition",
                  overlayDark
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-black hover:bg-white/85 hover:text-black",
                ].join(" ")}
              >
                <LocationIcon />
                <span>Cửa hàng</span>
              </Link>

              <span
                className={[
                  "hidden md:inline text-[13px] font-semibold tracking-[0.14em] transition-colors duration-300",
                  overlayDark ? "text-white/85" : "text-black/90",
                ].join(" ")}
              >
                Chế tác từ bạc • Tối giản • Bền vững
              </span>

              <HeaderCustomerActions
                dark={overlayDark}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                isEmailVerified={isEmailVerified}
                displayName={profile?.full_name || user?.email || null}
                loggingOut={loggingOut}
                onLogout={handleLogout}
                unreadCount={unreadCount}
              />
            </div>

            <div className="bp-container flex justify-center py-5 md:py-6">
              <Link
                href="/"
                className={[
                  "font-semibold transition",
                  "text-[36px] tracking-[0.34em] md:text-[46px] md:tracking-[0.38em]",
                  overlayDark
                    ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:text-white/92"
                    : "text-zinc-900 hover:opacity-80",
                ].join(" ")}
              >
                BLUE PEACH
              </Link>
            </div>

            <div className="relative py-3.5">
              <div className="bp-container grid grid-cols-[1fr_auto_1fr] items-center">
                <div />

                <nav className="hidden items-center justify-self-center gap-4 lg:flex">
                  <div className="group relative inline-flex">
                    <Link
                      href="/products"
                      className={[
                        "inline-flex items-center rounded-full px-5 py-3 transition-all duration-200",
                        "group-hover:bg-white group-hover:text-black group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]",
                        overlayDark ? "text-white" : "text-zinc-900",
                      ].join(" ")}
                    >
                      <span className="text-[16px] font-semibold tracking-[0.06em] md:text-[17px]">
                        Trang sức
                      </span>
                    </Link>

                    <MegaMenu />
                  </div>

                  <NavItem
                    href="/collections"
                    label="Bộ sưu tập"
                    dark={overlayDark}
                  />
                  <NavItem
                    href="/products?sort=new"
                    label="Hàng mới"
                    dark={overlayDark}
                  />
                  <NavItem
                    href="/products?category=gifts"
                    label="Quà tặng"
                    dark={overlayDark}
                  />
                </nav>

                <div className="flex items-center justify-self-end gap-2">
                  <HeaderIconButton label="Tìm kiếm" dark={overlayDark}>
                    <SearchIcon />
                  </HeaderIconButton>

                  <CartIcon
                    className={[
                      "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition",
                      overlayDark
                        ? "text-white hover:bg-white/10"
                        : "text-zinc-800 hover:bg-zinc-100",
                    ].join(" ")}
                    badgeClassName="absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-black px-1 text-center text-[11px] leading-[18px] text-white"
                  />

                  <HeaderIconButton
                    label="Mở menu"
                    dark={overlayDark}
                    mobileOnly
                  >
                    <MenuIcon />
                  </HeaderIconButton>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 -bottom-3 flex justify-center">
              <div
                className={[
                  "h-8 w-[94%] rounded-full blur-2xl transition-all duration-300",
                  overlayDark ? "bg-black/[0.05]" : "bg-black/[0.02]",
                ].join(" ")}
              />
            </div>
          </div>
        </header>
      )}

      {showSolidHeader && (
        <header className="fixed inset-x-0 top-0 z-[80] translate-y-0 opacity-100 transition-all duration-500 ease-out">
          <div className="bg-white/92 text-zinc-900 backdrop-blur-lg shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="bp-container grid grid-cols-[1fr_auto_1fr] items-center py-3.5">
              <div className="justify-self-start">
                <Link
                  href="/"
                  className="text-[15px] font-semibold tracking-[0.28em] text-zinc-900"
                >
                  BLUE PEACH
                </Link>
              </div>

              <nav className="hidden items-center justify-self-center gap-4 lg:flex">
                <div className="group relative inline-flex">
                  <Link
                    href="/products"
                    className="inline-flex items-center rounded-full px-5 py-3 text-zinc-900 transition-all duration-200 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
                  >
                    <span className="text-[16px] font-semibold tracking-[0.06em] md:text-[17px]">
                      Trang sức
                    </span>
                  </Link>

                  <MegaMenu />
                </div>

                <NavItem href="/collections" label="Bộ sưu tập" dark={false} />
                <NavItem
                  href="/products?sort=new"
                  label="Hàng mới"
                  dark={false}
                />
                <NavItem
                  href="/products?category=gifts"
                  label="Quà tặng"
                  dark={false}
                />
              </nav>

              <div className="flex items-center justify-self-end gap-2">
                <HeaderCustomerActions
                  dark={false}
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  isEmailVerified={isEmailVerified}
                  displayName={profile?.full_name || user?.email || null}
                  loggingOut={loggingOut}
                  onLogout={handleLogout}
                  unreadCount={unreadCount}
                />

                <HeaderIconButton label="Tìm kiếm" dark={false}>
                  <SearchIcon />
                </HeaderIconButton>

                <CartIcon
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-800 transition hover:bg-zinc-100"
                  badgeClassName="absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-black px-1 text-center text-[11px] leading-[18px] text-white"
                />

                <HeaderIconButton label="Open menu" dark={false} mobileOnly>
                  <MenuIcon />
                </HeaderIconButton>
              </div>
            </div>
          </div>
        </header>
      )}

      <div
        className={[
          "transition-[height] duration-300",
          isHome && !scrolled ? "h-0" : "h-[84px] md:h-[88px]",
        ].join(" ")}
      />

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}

function HeaderCustomerActions({
  dark,
  isLoading,
  isAuthenticated,
  isEmailVerified,
  displayName,
  loggingOut,
  onLogout,
  unreadCount,
}: {
  dark: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  displayName: string | null;
  loggingOut: boolean;
  onLogout: () => void;
  unreadCount: number;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={[
            "rounded-full px-3 py-2 text-[13px] font-semibold opacity-70",
            dark ? "text-white/85" : "text-black/70",
          ].join(" ")}
        >
          ...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <TopUtilityLink href="/login" label="Đăng nhập" dark={dark} />
        <TopUtilityLink href="/wishlist" label="Yêu thích" dark={dark} />
      </div>
    );
  }

    if (!isEmailVerified) {
    return (
      <div className="flex items-center gap-2">
        <TopUtilityLink href="/verify-email" label="Xác minh email" dark={dark} />
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className={[
            "rounded-full px-3 py-2 text-[13px] font-semibold transition",
            "disabled:cursor-not-allowed disabled:opacity-60",
            dark
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-black hover:bg-white/85 hover:text-black",
          ].join(" ")}
        >
          {loggingOut ? "Đang thoát..." : "Đăng xuất"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <HeaderAccountLink dark={dark} />

      <HeaderNotificationLink dark={dark} unreadCount={unreadCount} />

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        title={displayName || "Đăng xuất"}
        className={[
          "rounded-full px-3.5 py-2 text-[13px] font-semibold transition",
          "disabled:cursor-not-allowed disabled:opacity-60",
          dark
            ? "text-white/90 hover:bg-white/10 hover:text-white"
            : "text-black/80 hover:bg-white/85 hover:text-black",
        ].join(" ")}
      >
        {loggingOut ? "Đang thoát..." : "Đăng xuất"}
      </button>
    </div>
  );
}

function TopUtilityLink({
  href,
  label,
  dark,
}: {
  href: string;
  label: string;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-2 text-[13px] font-semibold transition",
        dark
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-black hover:bg-white/85 hover:text-black",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function HeaderNotificationLink({
  dark,
  unreadCount,
}: {
  dark: boolean;
  unreadCount: number;
}) {
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <Link
      href="/account/notifications"
      aria-label="Thông báo"
      className={[
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition",
        dark
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-black hover:bg-white/85 hover:text-black",
      ].join(" ")}
    >
      <BellOutlineIcon />

      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D14B5A] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function HeaderAccountLink({ dark }: { dark: boolean }) {
  return (
    <Link
      href="/account"
      aria-label="Tài khoản"
      title="Tài khoản"
      className={[
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition",
        dark
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-black hover:bg-white/85 hover:text-black",
      ].join(" ")}
    >
      <UserOutlineIcon />
    </Link>
  );
}

function HeaderIconButton({
  children,
  label,
  dark,
  mobileOnly = false,
}: {
  children: React.ReactNode;
  label: string;
  dark: boolean;
  mobileOnly?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className={[
        mobileOnly ? "lg:hidden" : "",
        "inline-flex h-11 w-11 items-center justify-center rounded-full transition",
        dark
          ? "text-white hover:bg-white/10 hover:text-white"
          : "text-zinc-800 hover:bg-zinc-100 hover:text-black",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function NavItem({
  href,
  label,
  dark,
}: {
  href: string;
  label: string;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center rounded-full px-5 py-3 transition-all duration-200",
        dark
          ? "hover:bg-white/10 hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
          : "hover:bg-white hover:shadow-sm",
      ].join(" ")}
    >
      <span
        className={[
          "text-[16px] font-semibold tracking-[0.06em] md:text-[17px] transition-colors duration-200",
          dark
            ? "text-white/95 group-hover:text-white"
            : "text-zinc-900 group-hover:text-black",
        ].join(" ")}
      >
        {label}
      </span>
    </Link>
  );
}

function MegaMenu() {
  return (
    <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-5 group-hover:block">
      <div className="w-[980px] rounded-[26px] border border-zinc-200/70 bg-white p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-4 gap-10">
          <MenuCol
            title="Necklaces"
            items={[
              { t: "Pendants", href: "/products?category=necklaces&type=pendants" },
              { t: "Chokers", href: "/products?category=necklaces&type=chokers" },
              { t: "Layered", href: "/products?category=necklaces&type=layered" },
            ]}
          />

          <MenuCol
            title="Earrings"
            items={[
              { t: "Stud", href: "/products?category=earrings&type=stud" },
              { t: "Hoop", href: "/products?category=earrings&type=hoop" },
              { t: "Drop", href: "/products?category=earrings&type=drop" },
            ]}
          />

          <MenuCol
            title="Rings"
            items={[
              { t: "Silver", href: "/products?category=rings&type=silver" },
              { t: "Minimal", href: "/products?category=rings&type=minimal" },
              { t: "Statement", href: "/products?category=rings&type=statement" },
            ]}
          />

          <div className="overflow-hidden rounded-2xl bg-zinc-100">
            <img
              src="/home/menu-preview.jpg"
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuCol({
  title,
  items,
}: {
  title: string;
  items: { t: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-zinc-900">
        {title}
      </h4>
      <ul className="space-y-2.5 text-[13px] text-zinc-600">
        {items.map((it) => (
          <li key={it.t}>
            <Link
              href={it.href}
              className="rounded-md px-1 py-1 transition hover:text-black"
            >
              {it.t}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-95"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-95"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-95"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BellOutlineIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-95"
    >
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function UserOutlineIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-95"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
