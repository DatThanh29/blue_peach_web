import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/reviews/featured?limit=6
 */
router.get("/featured", async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 6), 1), 12);

  const { data, error } = await supabase
    .from("product_reviews")
    .select(`
      ma_danh_gia,
      ma_san_pham,
      ten_nguoi_danh_gia,
      so_sao,
      noi_dung,
      ngay_tao,
      products (
        ma_san_pham,
        ten_san_pham,
        primary_image
      )
    `)
    .eq("trang_thai", "approved")
    .eq("is_featured", true)
    .eq("la_xoa_mem", false)
    .order("ngay_tao", { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
    total: data?.length ?? 0,
  });
});

export default router;  