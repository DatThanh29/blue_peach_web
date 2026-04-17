"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AIAssistantPanel, { type AIAssistantPanelHandle } from "./AIAssistantPanel";
import AdminSupportPanel from "./AdminSupportPanel";

type TabKey = "ai" | "admin";

const HIDDEN_EXACT_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

const TAB_STORAGE_KEY = "bp-floating-support-tab";

export default function FloatingSupportWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("ai");

  const popupRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<AIAssistantPanelHandle | null>(null);

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAccountRoute = pathname?.startsWith("/account");
  const isCheckoutRoute = pathname === "/checkout" || pathname?.startsWith("/checkout/");
  const isHiddenAuthRoute = HIDDEN_EXACT_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  const shouldHide =
    isAdminRoute || isAccountRoute || isCheckoutRoute || isHiddenAuthRoute;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const savedTab =
      typeof window !== "undefined"
        ? (window.sessionStorage.getItem(TAB_STORAGE_KEY) as TabKey | null)
        : null;

    if (savedTab === "ai" || savedTab === "admin") {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(TAB_STORAGE_KEY, activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      if (activeTab === "ai") {
        panelRef.current?.focusInput();
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open, activeTab]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (!popupRef.current) return;
      if (popupRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  if (shouldHide) return null;

  return (
    <>
      <div
        ref={popupRef}
        className={[
          "fixed bottom-20 right-4 z-[120] w-[min(92vw,380px)] origin-bottom-right rounded-[30px] border border-black/10 bg-[#fffdfa]/96 shadow-[0_20px_52px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-200 md:right-6",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-black/8 px-4 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/42">
              Blue Peach
            </p>
            <h3 className="mt-1 text-lg font-semibold text-black">
              Hỗ trợ mua sắm
            </h3>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-black/48">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>AI tư vấn đang sẵn sàng</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng hỗ trợ"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 text-black/65 transition hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex gap-2 border-b border-black/8 px-4 py-3">
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === "ai"
                ? "bg-black text-white"
                : "bg-[#f7f2ea] text-black/70 hover:bg-[#efe8dd]",
            ].join(" ")}
          >
            AI tư vấn
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === "admin"
                ? "bg-black text-white"
                : "bg-[#f7f2ea] text-black/70 hover:bg-[#efe8dd]",
            ].join(" ")}
          >
            Chat admin
          </button>
        </div>

        <div className="p-3">
          {activeTab === "ai" ? (
            <AIAssistantPanel ref={panelRef} compact />
          ) : (
            <AdminSupportPanel compact onNavigate={() => setOpen(false)} />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Mở hỗ trợ mua sắm"
        className="fixed bottom-5 right-4 z-[120] inline-flex h-[58px] w-[58px] items-center justify-center rounded-full border border-black/10 bg-[linear-gradient(180deg,#f7f1e7_0%,#efe3d3_100%)] text-black shadow-[0_16px_34px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.18)] md:right-6"
      >
        <span className="sr-only">Mở hỗ trợ mua sắm</span>
        <SparklesIcon />
      </button>

      <div className="pointer-events-none fixed bottom-6 right-[76px] z-[110] hidden rounded-full border border-black/8 bg-white/90 px-3 py-2 text-xs font-medium text-black/62 shadow-[0_10px_24px_rgba(0,0,0,0.08)] md:block">
        AI tư vấn
      </div>
    </>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="28"
      height="28"
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

function CloseIcon() {
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
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}