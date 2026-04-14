import { Router } from "express";
import { supabase } from "../../lib/supabase";
import { createStockMovement } from "../../lib/stock";

const router = Router();
const LOW_STOCK_THRESHOLD = 5;

/**
 * GET /api/admin/inventory
 * Query:
 * - q
 * - stock = all | low | out
 */
router.get("/", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const stock = String(req.query.stock ?? "all").trim();

  let query = supabase
    .from("products")
    .select(
      `
      ma_san_pham,
      sku,
      ten_san_pham,
      so_luong_ton,
      is_available,
      trang_thai_hien_thi,
      primary_image,
      ngay_cap_nhat
    `
    )
    .order("ngay_cap_nhat", { ascending: false });

  if (q) {
    query = query.or(`ten_san_pham.ilike.%${q}%,sku.ilike.%${q}%`);
  }

  if (stock === "low") {
    query = query.gt("so_luong_ton", 0).lte("so_luong_ton", LOW_STOCK_THRESHOLD);
  } else if (stock === "out") {
    query = query.eq("so_luong_ton", 0);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

/**
 * GET /api/admin/inventory/movements
 * Query:
 * - productId
 * - limit
 */
router.get("/movements", async (req, res) => {
  const productId = String(req.query.productId ?? "").trim();
  const limit = Math.max(1, Number(req.query.limit ?? 30));

  let query = supabase
    .from("stock_movements")
    .select(
      `
      ma_bien_dong,
      ma_san_pham,
      loai_bien_dong,
      so_luong_thay_doi,
      so_luong_truoc,
      so_luong_sau,
      ghi_chu,
      ngay_tao,
      products:ma_san_pham (
        ten_san_pham,
        sku
      ),
      nguoi_thuc_hien:ma_nguoi_thuc_hien (
        user_id,
        full_name,
        role
      )
    `
    )
    .order("ngay_tao", { ascending: false })
    .limit(limit);

  if (productId) {
    query = query.eq("ma_san_pham", productId);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

/**
 * PATCH /api/admin/inventory/:id/adjust
 * Body:
 * {
 *   so_luong_moi?: number,
 *   so_luong_thay_doi?: number,
 *   ghi_chu?: string
 * }
 *
 * Ưu tiên so_luong_moi nếu có
 */
router.patch("/:id/adjust", async (req, res) => {
  const id = req.params.id;
  const { so_luong_moi, so_luong_thay_doi, ghi_chu } = req.body ?? {};

  const { data: product, error: productErr } = await supabase
    .from("products")
    .select("ma_san_pham, so_luong_ton, is_available")
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (productErr) {
    return res.status(500).json({ error: productErr.message });
  }

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const oldStock = Number(product.so_luong_ton || 0);

  let newStock = oldStock;

  if (so_luong_moi !== undefined && so_luong_moi !== null && so_luong_moi !== "") {
    newStock = Number(so_luong_moi);
  } else if (
    so_luong_thay_doi !== undefined &&
    so_luong_thay_doi !== null &&
    so_luong_thay_doi !== ""
  ) {
    newStock = oldStock + Number(so_luong_thay_doi);
  } else {
    return res.status(400).json({ error: "Thiếu dữ liệu điều chỉnh kho." });
  }

  if (!Number.isFinite(newStock) || newStock < 0) {
    return res.status(400).json({ error: "Số lượng tồn mới không hợp lệ." });
  }

  const delta = newStock - oldStock;

  const { data: updated, error: updateErr } = await supabase
    .from("products")
    .update({
      so_luong_ton: newStock,
      is_available: newStock > 0,
      ngay_cap_nhat: new Date().toISOString(),
    })
    .eq("ma_san_pham", id)
    .select("ma_san_pham, so_luong_ton, is_available")
    .single();

  if (updateErr) {
    return res.status(500).json({ error: updateErr.message });
  }

  await createStockMovement({
    ma_san_pham: id,
    loai_bien_dong: "manual_adjust",
    so_luong_thay_doi: delta,
    so_luong_truoc: oldStock,
    so_luong_sau: newStock,
    ghi_chu: ghi_chu || null,
    ma_nguoi_thuc_hien: req.authUser?.userId ?? null,
  });

  return res.json({
    ok: true,
    item: updated,
  });
});

export default router;