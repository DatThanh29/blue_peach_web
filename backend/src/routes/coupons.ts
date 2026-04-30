import { Router } from "express";
import { validateCouponCode } from "../lib/coupons";
import { supabase } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * GET /api/coupons
 * Public active coupons for customer side
 */
router.get("/", async (_req, res) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("coupons")
    .select(
      "ma_giam_gia, code, loai_giam_gia, gia_tri_giam, don_hang_toi_thieu, giam_toi_da, so_lan_su_dung_toi_da, trang_thai, ngay_bat_dau, ngay_ket_thuc"
    )
    .eq("trang_thai", true)
    .or(`ngay_bat_dau.is.null,ngay_bat_dau.lte.${now}`)
    .or(`ngay_ket_thuc.is.null,ngay_ket_thuc.gte.${now}`)
    .order("ngay_tao", { ascending: false })
    .limit(6);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const items = data ?? [];

  return res.json({ items });
});

router.post("/validate", requireAuth, async (req, res) => {
  const { code, subtotal } = req.body ?? {};
  const normalizedCode = String(code || "").trim().toUpperCase();
  const userId = req.authUser!.userId;

  if (normalizedCode === "NEWPEACH15") {
    const { data: used, error: usedError } = await supabase
      .from("coupon_usages")
      .select("id")
      .eq("user_id", userId)
      .eq("coupon_code", normalizedCode)
      .maybeSingle();

    if (usedError) {
      return res.status(500).json({ error: usedError.message });
    }

    if (used) {
      return res.status(400).json({
        error: "Bạn đã sử dụng mã NEWPEACH15 cho một đơn hàng trước đó.",
      });
    }
  }

  const result = await validateCouponCode({
    code: normalizedCode,
    subtotal: Number(subtotal || 0),
  });

  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    ok: true,
    coupon: {
      ma_giam_gia: result.coupon.ma_giam_gia,
      code: result.coupon.code,
      loai_giam_gia: result.coupon.loai_giam_gia,
      gia_tri_giam: result.coupon.gia_tri_giam,
    },
    discount_amount: result.discountAmount,
    final_total: result.finalTotal,
  });
});

export default router;