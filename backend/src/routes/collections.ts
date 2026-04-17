import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/collections
 * Public list collections for customer side
 */
router.get("/", async (_req, res) => {
  const { data: collections, error } = await supabase
    .from("collections")
    .select(`
      ma_bo_suu_tap,
      slug,
      ten_bo_suu_tap,
      mo_ta_ngan,
      anh_the,
      anh_bia,
      thu_tu_hien_thi,
      noi_bat,
      trang_thai_hien_thi,
      ngay_tao,
      ngay_cap_nhat,
      collection_products(count)
    `)
    .eq("trang_thai_hien_thi", true)
    .order("thu_tu_hien_thi", { ascending: true })
    .order("ngay_tao", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const items =
    collections?.map((item: any) => ({
      ma_bo_suu_tap: item.ma_bo_suu_tap,
      slug: item.slug,
      ten_bo_suu_tap: item.ten_bo_suu_tap,
      mo_ta_ngan: item.mo_ta_ngan,
      anh_the: item.anh_the,
      anh_bia: item.anh_bia,
      thu_tu_hien_thi: item.thu_tu_hien_thi,
      noi_bat: item.noi_bat,
      trang_thai_hien_thi: item.trang_thai_hien_thi,
      ngay_tao: item.ngay_tao,
      ngay_cap_nhat: item.ngay_cap_nhat,
      product_count: item.collection_products?.[0]?.count ?? 0,
    })) ?? [];

  return res.json({
    items,
    total: items.length,
  });
});

/**
 * GET /api/collections/:slug
 * Public collection detail + products in collection
 */
router.get("/:slug", async (req, res) => {
  const slug = (req.params.slug || "").trim();

  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select(`
      ma_bo_suu_tap,
      slug,
      ten_bo_suu_tap,
      mo_ta_ngan,
      mo_ta_chi_tiet,
      anh_the,
      anh_bia,
      thu_tu_hien_thi,
      noi_bat,
      trang_thai_hien_thi,
      ngay_tao,
      ngay_cap_nhat
    `)
    .eq("slug", slug)
    .eq("trang_thai_hien_thi", true)
    .maybeSingle();

  if (collectionError) {
    return res.status(500).json({ error: collectionError.message });
  }

  if (!collection) {
    return res.status(404).json({ error: "Collection not found" });
  }

  const { data: productRows, error: productsError } = await supabase
    .from("collection_products")
    .select(`
      thu_tu_hien_thi,
      products (
        ma_san_pham,
        sku,
        ten_san_pham,
        gia_ban,
        gia_goc,
        phan_tram_giam,
        so_luong_ton,
        primary_image,
        ma_danh_muc,
        ngay_tao,
        is_bestseller,
        trang_thai_hien_thi,
        is_available
      )
    `)
    .eq("ma_bo_suu_tap", collection.ma_bo_suu_tap)
    .order("thu_tu_hien_thi", { ascending: true })
    .order("ngay_tao", { ascending: false });

  if (productsError) {
    return res.status(500).json({ error: productsError.message });
  }

  const products =
    productRows
      ?.map((row: any) => {
        const product = Array.isArray(row.products) ? row.products[0] : row.products;

        if (!product) return null;
        if (product.trang_thai_hien_thi !== true) return null;
        if (product.is_available !== true) return null;

        return {
          ma_san_pham: product.ma_san_pham,
          sku: product.sku,
          ten_san_pham: product.ten_san_pham,
          gia_ban: product.gia_ban,
          gia_goc: product.gia_goc,
          phan_tram_giam: product.phan_tram_giam,
          so_luong_ton: product.so_luong_ton,
          primary_image: product.primary_image,
          ma_danh_muc: product.ma_danh_muc,
          ngay_tao: product.ngay_tao,
          is_bestseller: product.is_bestseller,
          thu_tu_hien_thi: row.thu_tu_hien_thi,
        };
      })
      .filter(Boolean) ?? [];

  return res.json({
    item: collection,
    products,
  });
});

export default router;