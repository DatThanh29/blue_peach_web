import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/products
 * Query params:
 * - q: keyword search (optional)
 * - categoryId: uuid (optional)
 * - limit, offset: pagination (optional)
 */
router.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  const categoryId = (req.query.categoryId as string | undefined)?.trim();
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);

  let query = supabase
    .from("products")
    .select(
      "ma_san_pham, sku, ten_san_pham, gia_ban, gia_goc, phan_tram_giam, so_luong_ton, primary_image, ma_danh_muc, ngay_tao",
      { count: "exact" }
    )
    .order("ngay_tao", { ascending: false })
    .range(offset, offset + limit - 1);

  // filter public products (if you want double safety besides RLS)
  query = query.eq("trang_thai_hien_thi", true).eq("is_available", true);

  if (categoryId) query = query.eq("ma_danh_muc", categoryId);
  if (q) query = query.ilike("ten_san_pham", `%${q}%`);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
});

/**
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("products")
    .select(
      "ma_san_pham, sku, ten_san_pham, mo_ta_san_pham, gia_ban, gia_goc, phan_tram_giam, so_luong_ton, primary_image, url_san_pham, ma_danh_muc, ngay_tao, ngay_cap_nhat"
    )
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Product not found" });

  // Optional: fetch images
  const { data: images } = await supabase
    .from("product_images")
    .select("duong_dan_anh, la_anh_chinh, thu_tu")
    .eq("ma_san_pham", id)
    .order("la_anh_chinh", { ascending: false })
    .order("thu_tu", { ascending: true });

  res.json({ ...data, images: images ?? [] });
});

export default router;
