"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Coupon = {
  ma_giam_gia: string;
  code: string;
  loai_giam_gia: "percent" | "fixed";
  gia_tri_giam: number;
  don_hang_toi_thieu?: number | null;
  giam_toi_da?: number | null;
  ngay_ket_thuc?: string | null;
};

function formatMoney(value?: number | null) {
  if (!value) return "0đ";
  return `${Number(value).toLocaleString("vi-VN")}đ`;
}

function getCouponText(coupon: Coupon) {
  if (coupon.loai_giam_gia === "percent") {
    return `Giảm ${coupon.gia_tri_giam}%`;
  }

  return `Giảm ${formatMoney(coupon.gia_tri_giam)}`;
}

function getConditionText(coupon: Coupon) {
  const conditions: string[] = [];

  if (coupon.don_hang_toi_thieu) {
    conditions.push(`Đơn từ ${formatMoney(coupon.don_hang_toi_thieu)}`);
  }

  if (coupon.giam_toi_da && coupon.loai_giam_gia === "percent") {
    conditions.push(`Tối đa ${formatMoney(coupon.giam_toi_da)}`);
  }

  return conditions.length ? conditions.join(" · ") : "Áp dụng cho đơn hàng hợp lệ";
}

export default function CouponStrip() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await apiFetch("/coupons");
        setCoupons(res?.items || []);
      } catch {
        setCoupons([]);
      }
    }

    void loadCoupons();
  }, []);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  if (!coupons.length) return null;

  return (
    <section className="border-b border-[#E3DBCF] bg-[#F7F4EE]">
      <div className="bp-container py-6">
        <div className="mb-4 flex flex-col gap-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Ưu đãi Blue Peach
          </p>

          <h2 className="font-heading text-2xl font-medium text-[#1F1F1F] md:text-3xl">
            Mã giảm giá dành cho bạn
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {coupons.slice(0, 3).map((coupon) => (
            <article
              key={coupon.ma_giam_gia}
              className="group rounded-[22px] border border-[#D8D0C4] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.035)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_38px_rgba(0,0,0,0.055)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C8478]">
                    Coupon
                  </p>

                  <div className="mt-2 inline-flex rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-white">
                    {coupon.code}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className="shrink-0 rounded-full border border-[#D8D0C4] bg-[#FBFAF7] px-3 py-2 text-xs font-semibold text-[#1F1F1F] transition hover:border-[#1F1F1F]/30"
                >
                  {copied === coupon.code ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-[#1F1F1F]">
                  {getCouponText(coupon)}
                </p>

                <p className="mt-1 text-sm leading-6 text-[#66707A]">
                  {getConditionText(coupon)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}