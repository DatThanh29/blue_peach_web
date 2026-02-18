import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

// GET /api/admin/orders?limit=50&offset=0&status=pending&q=search
router.get("/", async (req, res) => {
  const limit = Number(req.query.limit ?? 50);
  const offset = Number(req.query.offset ?? 0);
  const status = req.query.status as string | undefined;
  const q = req.query.q as string | undefined;

  let query = supabase
    .from("orders")
    .select(
      "ma_don_hang, ngay_dat_hang, tong_thanh_toan, trang_thai_don, trang_thai_thanh_toan, hinh_thuc_thanh_toan, dia_chi_giao_hang_snapshot",
      { count: "exact" }
    );

  // Filter by status
  if (status && status !== "all") {
    query = query.eq("trang_thai_don", status);
  }

  // Search in JSONB fields (customer_name, phone, address)
  if (q && q.trim()) {
    const searchTerm = q.trim();
    // Search in customer info (case-insensitive)
    query = query.or(
      `dia_chi_giao_hang_snapshot->>customer_name.ilike.%${searchTerm}%,dia_chi_giao_hang_snapshot->>phone.ilike.%${searchTerm}%,dia_chi_giao_hang_snapshot->>address.ilike.%${searchTerm}%`
    );
  }

  query = query
    .order("ngay_dat_hang", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({ items: data ?? [], total: count ?? 0, limit, offset });
});

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  const id = req.params.id;
  const { trang_thai_don } = req.body as { trang_thai_don?: string };

  const allowed = ["pending", "processing", "shipped", "completed", "cancelled"];
  if (!trang_thai_don || !allowed.includes(trang_thai_don)) {
    return res.status(400).json({ error: "Invalid trang_thai_don" });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ trang_thai_don })
    .eq("ma_don_hang", id)
    .select("ma_don_hang, trang_thai_don")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ ok: true, order: data });
});

export default router;
