import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/products
 */
router.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  const categoryId = (req.query.categoryId as string | undefined)?.trim();
  const sort = (req.query.sort as string | undefined)?.trim();
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);
  const minPrice = Number(req.query.minPrice ?? 0);
  const maxPrice = Number(req.query.maxPrice ?? 0);

  let query = supabase
    .from("products")
    .select(
      "ma_san_pham, sku, ten_san_pham, gia_ban, gia_goc, phan_tram_giam, so_luong_ton, primary_image, ma_danh_muc, ngay_tao, is_bestseller",
      { count: "exact" }
    )
    .eq("trang_thai_hien_thi", true)
    .eq("is_available", true);

  if (categoryId) query = query.eq("ma_danh_muc", categoryId);
  if (q) query = query.ilike("ten_san_pham", `%${q}%`);

  if (Number.isFinite(minPrice) && minPrice > 0) {
    query = query.gte("gia_ban", minPrice);
  }

  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    query = query.lte("gia_ban", maxPrice);
  }

  if (sort === "best") {
    query = query.eq("is_bestseller", true).order("ngay_tao", { ascending: false });
  } else {
    query = query.order("ngay_tao", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
});

/**
 * GET /api/products/:id/reviews
 */
router.get("/:id/reviews", async (req, res) => {
  const productId = req.params.id;

  const { data: reviewItems, error: reviewsError } = await supabase
    .from("product_reviews")
    .select(`
      ma_danh_gia,
      ten_nguoi_danh_gia,
      so_sao,
      noi_dung,
      ngay_tao
    `)
    .eq("ma_san_pham", productId)
    .eq("trang_thai", "approved")
    .eq("la_xoa_mem", false)
    .order("ngay_tao", { ascending: false });

  if (reviewsError) {
    return res.status(500).json({ error: reviewsError.message });
  }

  const items = reviewItems ?? [];
  const totalReviews = items.length;
  const averageRating =
    totalReviews > 0
      ? Number(
        (
          items.reduce((sum, item) => sum + Number(item.so_sao || 0), 0) /
          totalReviews
        ).toFixed(1)
      )
      : 0;

  return res.json({
    summary: {
      average_rating: averageRating,
      total_reviews: totalReviews,
    },
    items,
  });
});

/**
 * GET /api/products/:id
 */
/**
 * GET /api/products/:id/related
 */
router.get("/:id/related", async (req, res) => {
  const id = req.params.id;
  const limit = Math.min(Number(req.query.limit ?? 4), 8);

  const { data: currentProduct, error: currentProductError } = await supabase
    .from("products")
    .select("ma_san_pham, ma_danh_muc")
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (currentProductError) {
    return res.status(500).json({ error: currentProductError.message });
  }

  if (!currentProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  let relatedQuery = supabase
    .from("products")
    .select(
      "ma_san_pham, sku, ten_san_pham, gia_ban, gia_goc, phan_tram_giam, so_luong_ton, primary_image, ma_danh_muc, ngay_tao, is_bestseller",
      { count: "exact" }
    )
    .eq("trang_thai_hien_thi", true)
    .eq("is_available", true)
    .neq("ma_san_pham", id)
    .order("is_bestseller", { ascending: false })
    .order("ngay_tao", { ascending: false })
    .range(0, limit - 1);

  if (currentProduct.ma_danh_muc) {
    relatedQuery = relatedQuery.eq("ma_danh_muc", currentProduct.ma_danh_muc);
  }

  const { data: relatedItems, error: relatedError } = await relatedQuery;

  if (relatedError) {
    return res.status(500).json({ error: relatedError.message });
  }

  let items = relatedItems ?? [];

  if (items.length < limit) {
    const excludeIds = [id, ...items.map((item) => item.ma_san_pham)];

    const { data: fallbackItems, error: fallbackError } = await supabase
      .from("products")
      .select(
        "ma_san_pham, sku, ten_san_pham, gia_ban, gia_goc, phan_tram_giam, so_luong_ton, primary_image, ma_danh_muc, ngay_tao, is_bestseller"
      )
      .eq("trang_thai_hien_thi", true)
      .eq("is_available", true)
      .not("ma_san_pham", "in", `(${excludeIds.map((x) => `"${x}"`).join(",")})`)
      .order("is_bestseller", { ascending: false })
      .order("ngay_tao", { ascending: false })
      .range(0, limit - items.length - 1);

    if (fallbackError) {
      return res.status(500).json({ error: fallbackError.message });
    }

    items = [...items, ...(fallbackItems ?? [])];
  }

  return res.json({
    items,
    total: items.length,
    limit,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      *,
      product_images (*)
    `)
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (productError) {
    return res.status(500).json({ error: productError.message });
  }

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("duong_dan_anh, la_anh_chinh, thu_tu")
    .eq("ma_san_pham", id)
    .order("la_anh_chinh", { ascending: false })
    .order("thu_tu", { ascending: true });

  if (imagesError) {
    return res.status(500).json({ error: imagesError.message });
  }

  return res.json({
    ...product,
    images: images ?? [],
  });
});

export default router;