"use client";

import Link from "next/link";

export default function AdminSupportPanel({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-black/8 bg-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
      <div className="border-b border-black/8 px-5 py-4 md:px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
          Support Chat
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-black">
          Chat với Admin
        </h2>
      </div>

      <div className={compact ? "px-5 py-5" : "px-5 py-6 md:px-6"}>
        <div className="rounded-[24px] border border-black/8 bg-[#faf8f4] p-5">
          <p className="text-sm leading-7 text-black/72">
            Khu vực chat hỗ trợ trực tiếp với admin đang được hoàn thiện. Ở giai đoạn
            tiếp theo, bạn có thể dùng tính năng này để trao đổi về đơn hàng, tài khoản,
            tình trạng sản phẩm hoặc các yêu cầu hỗ trợ riêng.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/account/chat-admin"
              onClick={onNavigate}
              className="bp-btn bp-btn--solid border-black"
            >
              Mở khu vực chat admin
            </Link>

            <Link
              href="/account/orders"
              onClick={onNavigate}
              className="bp-btn bp-btn--ghost"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}