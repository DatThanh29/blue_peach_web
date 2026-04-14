import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/categories
 * Public categories for storefront
 */
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select("ma_danh_muc, ten_danh_muc, mo_ta, trang_thai_hien_thi, ngay_tao")
    .eq("trang_thai_hien_thi", true)
    .order("ten_danh_muc", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

export default router;