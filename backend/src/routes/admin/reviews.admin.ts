import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

/**
 * GET /api/admin/reviews
 * query:
 * - status=pending|approved|hidden|deleted|all
 * - q=keyword
 * - limit=20
 * - offset=0
 */
router.get("/", async (req, res) => {
  const status = String(req.query.status ?? "all").trim();
  const q = String(req.query.q ?? "").trim();
  const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(req.query.offset ?? 0), 0);

  let query = supabase
    .from("product_reviews")
    .select(
      `
      ma_danh_gia,
      ma_san_pham,
      ten_nguoi_danh_gia,
      so_sao,
      noi_dung,
      trang_thai,
      is_featured,
      la_xoa_mem,
      ngay_tao,
      ngay_cap_nhat,
      products (
        ten_san_pham,
        sku,
        primary_image
      )
    `,
      { count: "exact" }
    )
    .order("ngay_tao", { ascending: false });

  if (status === "deleted") {
    query = query.eq("la_xoa_mem", true);
  } else {
    query = query.eq("la_xoa_mem", false);

    if (status !== "all") {
      query = query.eq("trang_thai", status);
    }
  }

  if (q) {
    query = query.or(`ten_nguoi_danh_gia.ilike.%${q}%,noi_dung.ilike.%${q}%`);
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
 * PATCH /api/admin/reviews/:id/status
 */
router.patch("/:id/status", async (req, res) => {
  const id = req.params.id;
  const { trang_thai } = req.body as {
    trang_thai?: "pending" | "approved" | "hidden";
  };

  if (!trang_thai || !["pending", "approved", "hidden"].includes(trang_thai)) {
    return res.status(400).json({ error: "Invalid trang_thai" });
  }

  const payload: Record<string, any> = {
    trang_thai,
  };

  if (trang_thai === "approved") {
    payload.ngay_duyet = new Date().toISOString();
    payload.duyet_boi = req.authUser?.userId ?? null;
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .update(payload)
    .eq("ma_danh_gia", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Review not found" });
  }

  return res.json({ item: data });
});

/**
 * PATCH /api/admin/reviews/:id/feature
 */
router.patch("/:id/feature", async (req, res) => {
  const id = req.params.id;
  const { is_featured } = req.body as { is_featured?: boolean };

  if (typeof is_featured !== "boolean") {
    return res.status(400).json({ error: "is_featured must be boolean" });
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .update({ is_featured })
    .eq("ma_danh_gia", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Review not found" });
  }

  return res.json({ item: data });
});

/**
 * DELETE /api/admin/reviews/:id
 * soft delete
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("product_reviews")
    .update({
      la_xoa_mem: true,
    })
    .eq("ma_danh_gia", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Review not found" });
  }

  return res.json({ ok: true, item: data });
});

export default router;