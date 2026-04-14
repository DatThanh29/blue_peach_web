import { Router } from "express";
import { validateCouponCode } from "../lib/coupons";

const router = Router();

/**
 * POST /api/coupons/validate
 * Body: { code, subtotal }
 */
router.post("/validate", async (req, res) => {
  const { code, subtotal } = req.body ?? {};

  const result = await validateCouponCode({
    code,
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