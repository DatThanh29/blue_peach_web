import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

const PAYMENT_STATUSES = [
  "unpaid",
  "pending_payment",
  "paid",
  "payment_failed",
] as const;

const HANDLER_ROLES = ["staff", "admin"] as const;

/**
 * GET /api/admin/orders/handlers
 * Danh sách tài khoản có thể xử lý đơn
 */
router.get("/handlers", async (_req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, phone, role, created_at")
    .in("role", [...HANDLER_ROLES])
    .order("full_name", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

/**
 * GET /api/admin/orders
 */
router.get("/", async (req, res) => {
  const limit = Math.max(1, Number(req.query.limit ?? 10));
  const offset = Math.max(0, Number(req.query.offset ?? 0));
  const status = String(req.query.status ?? "").trim();
  const paymentStatus = String(req.query.payment_status ?? "").trim();
  const q = String(req.query.q ?? "").trim().toLowerCase();

  let query = supabase
    .from("orders")
    .select(
      `
      ma_don_hang,
      stt_hien_thi,
      ma_nhan_vien_xu_ly,
      ngay_dat_hang,
      tong_thanh_toan,
      trang_thai_don,
      trang_thai_thanh_toan,
      hinh_thuc_thanh_toan,
      dia_chi_giao_hang_snapshot,
      nhan_vien_xu_ly:ma_nhan_vien_xu_ly (
        user_id,
        full_name,
        phone,
        role
      )
    `,
      { count: "exact" }
    )
    .order("ngay_dat_hang", { ascending: false });

  if (status) {
    query = query.eq("trang_thai_don", status);
  }

  if (paymentStatus) {
    query = query.eq("trang_thai_thanh_toan", paymentStatus);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  let items = data ?? [];

  if (q) {
    items = items.filter((order: any) => {
      const snapshot = order.dia_chi_giao_hang_snapshot ?? {};
      const customerName = String(snapshot.customer_name ?? "").toLowerCase();
      const phone = String(snapshot.phone ?? "").toLowerCase();
      const address = String(snapshot.address ?? "").toLowerCase();
      const orderId = String(order.ma_don_hang ?? "").toLowerCase();
      const displayId = String(order.stt_hien_thi ?? "").toLowerCase();
      const staffName = String(order.nhan_vien_xu_ly?.full_name ?? "").toLowerCase();

      return (
        customerName.includes(q) ||
        phone.includes(q) ||
        address.includes(q) ||
        orderId.includes(q) ||
        displayId.includes(q) ||
        staffName.includes(q)
      );
    });
  }

  return res.json({
    items,
    total: count ?? 0,
    limit,
    offset,
  });
});

/**
 * GET /api/admin/orders/:id
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      nhan_vien_xu_ly:ma_nhan_vien_xu_ly (
        user_id,
        full_name,
        phone,
        role
      )
    `
    )
    .eq("ma_don_hang", id)
    .maybeSingle();

  if (orderError) {
    return res.status(500).json({ error: orderError.message });
  }

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_details")
    .select(
      `
      ma_san_pham,
      so_luong_mua,
      don_gia_snapshot,
      thanh_tien,
      products:ma_san_pham (
        ten_san_pham,
        sku
      )
    `
    )
    .eq("ma_don_hang", id);

  if (itemsError) {
    return res.status(500).json({ error: itemsError.message });
  }

  return res.json({
    ...order,
    items: (items ?? []).map((item: any) => ({
      ma_san_pham: item.ma_san_pham,
      so_luong_mua: item.so_luong_mua,
      don_gia_snapshot: item.don_gia_snapshot,
      thanh_tien: item.thanh_tien,
      ten_san_pham: item.products?.ten_san_pham ?? null,
      sku: item.products?.sku ?? null,
    })),
  });
});

/**
 * PATCH /api/admin/orders/:id/status
 */
router.patch("/:id/status", async (req, res) => {
  const id = req.params.id;
  const { trang_thai_don } = req.body as { trang_thai_don?: string };

  if (!trang_thai_don || !ORDER_STATUSES.includes(trang_thai_don as any)) {
    return res.status(400).json({ error: "Invalid trang_thai_don" });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ trang_thai_don })
    .eq("ma_don_hang", id)
    .select("ma_don_hang, trang_thai_don, trang_thai_thanh_toan")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    order: data,
  });
});

/**
 * PATCH /api/admin/orders/:id/payment-status
 */
router.patch("/:id/payment-status", async (req, res) => {
  const id = req.params.id;
  const { trang_thai_thanh_toan } = req.body as {
    trang_thai_thanh_toan?: string;
  };

  if (
    !trang_thai_thanh_toan ||
    !PAYMENT_STATUSES.includes(trang_thai_thanh_toan as any)
  ) {
    return res.status(400).json({ error: "Invalid trang_thai_thanh_toan" });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ trang_thai_thanh_toan })
    .eq("ma_don_hang", id)
    .select("ma_don_hang, trang_thai_don, trang_thai_thanh_toan")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    order: data,
  });
});

/**
 * PATCH /api/admin/orders/:id/assignee
 * Body: { ma_nhan_vien_xu_ly: string | null }
 */
router.patch("/:id/assignee", async (req, res) => {
  const id = req.params.id;
  const { ma_nhan_vien_xu_ly } = req.body as {
    ma_nhan_vien_xu_ly?: string | null;
  };

  if (ma_nhan_vien_xu_ly) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, role, full_name, phone")
      .eq("user_id", ma_nhan_vien_xu_ly)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: "Handler profile not found" });
    }

    if (!HANDLER_ROLES.includes(profile.role as any)) {
      return res.status(400).json({ error: "User role cannot handle orders" });
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ ma_nhan_vien_xu_ly: ma_nhan_vien_xu_ly || null })
    .eq("ma_don_hang", id)
    .select(
      `
      ma_don_hang,
      ma_nhan_vien_xu_ly,
      nhan_vien_xu_ly:ma_nhan_vien_xu_ly (
        user_id,
        full_name,
        phone,
        role
      )
    `
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    order: data,
  });
});

export default router;