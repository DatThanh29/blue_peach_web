import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

type OrderItemInput = {
  ma_san_pham: string;
  qty: number;
};

type CreateOrderBody = {
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItemInput[];
};

/**
 * GET /api/orders
 * (MVP) List orders (for admin dashboard later)
 * Query: limit, offset
 */
router.get("/", async (req, res) => {
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);

const { data, error, count } = await supabase
  .from("orders")
  .select(
    "ma_don_hang, ngay_dat_hang, tong_thanh_toan, trang_thai_don, trang_thai_thanh_toan, hinh_thuc_thanh_toan, dia_chi_giao_hang_snapshot",
    { count: "exact" }
  )
  .order("ngay_dat_hang", { ascending: false })
  .range(offset, offset + limit - 1);


  if (error) return res.status(500).json({ error: error.message });

  res.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
});

/**
 * POST /api/orders
 * Body: { customer_name, phone, address, note?, items: [{ma_san_pham, qty}] }
 */
router.post("/", async (req, res) => {
  const body = req.body as CreateOrderBody;

  if (!body.customer_name || !body.phone || !body.address) {
    return res.status(400).json({ error: "Missing customer info" });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  for (const it of body.items) {
    if (!it.ma_san_pham || !Number.isInteger(it.qty) || it.qty <= 0) {
      return res.status(400).json({ error: "Invalid items" });
    }
  }

  // Load products for pricing & stock check
  const ids = body.items.map((x) => x.ma_san_pham);
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("ma_san_pham, ten_san_pham, gia_ban, so_luong_ton, trang_thai_hien_thi, is_available")
    .in("ma_san_pham", ids);

  if (prodErr) return res.status(500).json({ error: prodErr.message });

  const map = new Map((products ?? []).map((p: any) => [p.ma_san_pham, p]));

  // Stock validation
  for (const it of body.items) {
    const p = map.get(it.ma_san_pham);
    if (!p) return res.status(400).json({ error: `Product not found: ${it.ma_san_pham}` });
    if (!p.trang_thai_hien_thi || !p.is_available) {
      return res.status(400).json({ error: `Product not available: ${p.ten_san_pham}` });
    }
    if (p.so_luong_ton < it.qty) {
      return res.status(400).json({ error: `Not enough stock: ${p.ten_san_pham}` });
    }
  }

  // Build order details + totals
  const lines = body.items.map((it) => {
    const p = map.get(it.ma_san_pham);
    const unit = Number(p.gia_ban);
    const thanh_tien = unit * it.qty;
    return {
      ma_san_pham: it.ma_san_pham,
      so_luong_mua: it.qty,
      don_gia_snapshot: unit,
      thanh_tien,
    };
  });

  const tong_tien_hang = lines.reduce((s, x) => s + x.thanh_tien, 0);
  const giam_gia = 0;
  const phi_van_chuyen = 0;
  const tong_thanh_toan = tong_tien_hang - giam_gia + phi_van_chuyen;

  const dia_chi_snapshot = {
    customer_name: body.customer_name,
    phone: body.phone,
    address: body.address,
  };

  // Create order
  const { data: created, error: orderErr } = await supabase
    .from("orders")
    .insert({
      ma_nguoi_dung: null, // guest MVP
      dia_chi_giao_hang_snapshot: dia_chi_snapshot,
      ghi_chu: body.note ?? null,
      tong_tien_hang,
      giam_gia,
      phi_van_chuyen,
      tong_thanh_toan,
      trang_thai_don: "pending",
      trang_thai_thanh_toan: "unpaid",
      hinh_thuc_thanh_toan: "cod",
    })
    .select("ma_don_hang")
    .single();

  if (orderErr) return res.status(500).json({ error: orderErr.message });

  const orderId = created.ma_don_hang;

  // Create order_details
  const { error: detailsErr } = await supabase.from("order_details").insert(
    lines.map((l) => ({
      ma_don_hang: orderId,
      ma_san_pham: l.ma_san_pham,
      so_luong_mua: l.so_luong_mua,
      don_gia_snapshot: l.don_gia_snapshot,
      thanh_tien: l.thanh_tien,
    }))
  );

  if (detailsErr) return res.status(500).json({ error: detailsErr.message });

  // Reduce stock (MVP)
  for (const it of body.items) {
    const p = map.get(it.ma_san_pham);
    const newStock = p.so_luong_ton - it.qty;

    const { error: upErr } = await supabase
      .from("products")
      .update({ so_luong_ton: newStock, is_available: newStock > 0 })
      .eq("ma_san_pham", it.ma_san_pham);

    if (upErr) return res.status(500).json({ error: upErr.message });
  }

  res.status(201).json({ ok: true, order_id: orderId });
});

/**
 * GET /api/orders/:id
 * Return order + order_details
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("ma_don_hang", id)
    .maybeSingle();

  if (orderErr) return res.status(500).json({ error: orderErr.message });
  if (!order) return res.status(404).json({ error: "Order not found" });

  const { data: items, error: itemsErr } = await supabase
    .from("order_details")
    .select("ma_san_pham, so_luong_mua, don_gia_snapshot, thanh_tien")
    .eq("ma_don_hang", id);

  if (itemsErr) return res.status(500).json({ error: itemsErr.message });

  res.json({ ...order, items: items ?? [] });
});

/**
 * PATCH /api/orders/:id/status
 * Update order status (Admin only)
 */
router.patch("/:id/status", requireAdmin, async (req, res) => {
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
