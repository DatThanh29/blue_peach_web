import { supabase } from "./supabase";

export type CouponRow = {
  ma_giam_gia: string;
  code: string;
  loai_giam_gia: "percent" | "fixed";
  gia_tri_giam: number;
  don_hang_toi_thieu: number;
  giam_toi_da?: number | null;
  so_lan_su_dung_toi_da?: number | null;
  so_lan_da_dung: number;
  trang_thai: boolean;
  ngay_bat_dau?: string | null;
  ngay_ket_thuc?: string | null;
};

export type CouponValidationResult =
  | {
      ok: true;
      coupon: CouponRow;
      discountAmount: number;
      finalTotal: number;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function isCouponInDateRange(coupon: CouponRow, now = new Date()) {
  const startOk =
    !coupon.ngay_bat_dau || new Date(coupon.ngay_bat_dau).getTime() <= now.getTime();

  const endOk =
    !coupon.ngay_ket_thuc || new Date(coupon.ngay_ket_thuc).getTime() >= now.getTime();

  return startOk && endOk;
}

function calculateDiscount(
  coupon: CouponRow,
  subtotal: number
) {
  let discount = 0;

  if (coupon.loai_giam_gia === "percent") {
    discount = Math.round((subtotal * Number(coupon.gia_tri_giam || 0)) / 100);
  } else {
    discount = Math.round(Number(coupon.gia_tri_giam || 0));
  }

  if (coupon.giam_toi_da !== null && coupon.giam_toi_da !== undefined) {
    discount = Math.min(discount, Number(coupon.giam_toi_da));
  }

  discount = Math.max(0, discount);
  discount = Math.min(discount, subtotal);

  return discount;
}

export async function validateCouponCode(params: {
  code?: string | null;
  subtotal: number;
}): Promise<CouponValidationResult> {
  const rawCode = params.code?.trim();
  const subtotal = Number(params.subtotal || 0);

  if (!rawCode) {
    return { ok: false, error: "Vui lòng nhập mã giảm giá." };
  }

  const code = normalizeCode(rawCode);

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  const coupon = data as CouponRow | null;

  if (!coupon) {
    return { ok: false, error: "Mã giảm giá không tồn tại." };
  }

  if (!coupon.trang_thai) {
    return { ok: false, error: "Mã giảm giá hiện không hoạt động." };
  }

  if (!isCouponInDateRange(coupon)) {
    return { ok: false, error: "Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng." };
  }

  if (subtotal < Number(coupon.don_hang_toi_thieu || 0)) {
    return {
      ok: false,
      error: `Đơn hàng chưa đạt giá trị tối thiểu ${Number(
        coupon.don_hang_toi_thieu || 0
      ).toLocaleString("vi-VN")}đ.`,
    };
  }

  if (
    coupon.so_lan_su_dung_toi_da !== null &&
    coupon.so_lan_su_dung_toi_da !== undefined &&
    Number(coupon.so_lan_da_dung || 0) >= Number(coupon.so_lan_su_dung_toi_da)
  ) {
    return { ok: false, error: "Mã giảm giá đã hết lượt sử dụng." };
  }

  const discountAmount = calculateDiscount(coupon, subtotal);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    ok: true,
    coupon,
    discountAmount,
    finalTotal,
  };
}

export async function increaseCouponUsage(ma_giam_gia?: string | null) {
  if (!ma_giam_gia) return;

  const { data, error } = await supabase
    .from("coupons")
    .select("so_lan_da_dung")
    .eq("ma_giam_gia", ma_giam_gia)
    .maybeSingle();

  if (error || !data) {
    return;
  }

  await supabase
    .from("coupons")
    .update({
      so_lan_da_dung: Number((data as any).so_lan_da_dung || 0) + 1,
    })
    .eq("ma_giam_gia", ma_giam_gia);
}