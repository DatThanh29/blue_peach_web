import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

type CategoryPayload = {
  ten_danh_muc?: string;
  mo_ta?: string | null;
  trang_thai_hien_thi?: boolean;
};

/**
 * GET /api/admin/categories
 * Query:
 * - limit
 * - offset
 * - q
 * - visible
 */
router.get("/", async (req, res) => {
  const limit = Math.max(1, Number(req.query.limit ?? 12));
  const offset = Math.max(0, Number(req.query.offset ?? 0));
  const q = String(req.query.q ?? "").trim();
  const visible = String(req.query.visible ?? "").trim();

  let query = supabase
    .from("categories")
    .select(
      "ma_danh_muc, ten_danh_muc, mo_ta, trang_thai_hien_thi, ngay_tao",
      { count: "exact" }
    )
    .order("ngay_tao", { ascending: false });

  if (q) {
    query = query.or(`ten_danh_muc.ilike.%${q}%,mo_ta.ilike.%${q}%`);
  }

  if (visible === "true") {
    query = query.eq("trang_thai_hien_thi", true);
  } else if (visible === "false") {
    query = query.eq("trang_thai_hien_thi", false);
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
 * GET /api/admin/categories/:id
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("ma_danh_muc", id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Category not found" });
  }

  return res.json(data);
});

/**
 * POST /api/admin/categories
 */
router.post("/", async (req, res) => {
  const body = (req.body ?? {}) as CategoryPayload;

  if (!body.ten_danh_muc?.trim()) {
    return res.status(400).json({ error: "ten_danh_muc is required" });
  }

  const payload = {
    ten_danh_muc: body.ten_danh_muc.trim(),
    mo_ta: body.mo_ta?.trim() || null,
    trang_thai_hien_thi: body.trang_thai_hien_thi ?? true,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    ok: true,
    category: data,
  });
});

/**
 * PATCH /api/admin/categories/:id
 */
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const body = (req.body ?? {}) as CategoryPayload;

  const patch: Record<string, any> = {};

  if (body.ten_danh_muc !== undefined) {
    patch.ten_danh_muc = body.ten_danh_muc?.trim();
  }

  if (body.mo_ta !== undefined) {
    patch.mo_ta = body.mo_ta?.trim() || null;
  }

  if (body.trang_thai_hien_thi !== undefined) {
    patch.trang_thai_hien_thi = body.trang_thai_hien_thi;
  }

  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("ma_danh_muc", id)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    category: data,
  });
});

/**
 * DELETE /api/admin/categories/:id
 * soft delete
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("categories")
    .update({
      trang_thai_hien_thi: false,
    })
    .eq("ma_danh_muc", id)
    .select("ma_danh_muc, ten_danh_muc, trang_thai_hien_thi")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    category: data,
  });
});

export default router;