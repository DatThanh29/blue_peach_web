import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAdminOnly } from "../middlewares/auth";
import { increaseCouponUsage, validateCouponCode } from "../lib/coupons";
import { createStockMovement } from "../lib/stock";

const router = Router();

type OrderItemInput = {
  ma_san_pham: string;
  qty: number;
};

type PaymentMethod = "cod" | "vnpay";

type ShippingAddressSnapshot = {
  recipient_name: string;
  recipient_phone: string;
  province_code?: string | null;
  province_name?: string | null;
  ward_code?: string | null;
  ward_name?: string | null;
  address_line1: string;
  address_line2?: string | null;
  note?: string | null;
  full_address: string;
};

type CreateOrderBody = {
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  payment_method?: PaymentMethod;
  coupon_code?: string;
  user_address_id?: string;
  shipping_address_snapshot?: ShippingAddressSnapshot;
  items: OrderItemInput[];
};

const PAYMENT_STATUS_BY_METHOD: Record<PaymentMethod, "unpaid" | "pending_payment"> = {
  cod: "unpaid",
  vnpay: "pending_payment",
};

function getPaymentStatus(paymentMethod: PaymentMethod) {
  return PAYMENT_STATUS_BY_METHOD[paymentMethod];
}

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

router.post("/", async (req, res) => {
  const body = req.body as CreateOrderBody;
  const paymentMethod: PaymentMethod =
    body.payment_method && ["cod", "vnpay"].includes(body.payment_method)
      ? body.payment_method
      : "cod";

  const hasLegacyCustomerInfo =
    !!body.customer_name && !!body.phone && !!body.address;

  const hasShippingSnapshot =
    !!body.shipping_address_snapshot?.recipient_name &&
    !!body.shipping_address_snapshot?.recipient_phone &&
    !!body.shipping_address_snapshot?.address_line1 &&
    !!body.shipping_address_snapshot?.full_address;

  if (!hasLegacyCustomerInfo && !hasShippingSnapshot) {
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

  const ids = body.items.map((x) => x.ma_san_pham);

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select(
      "ma_san_pham, ten_san_pham, gia_ban, so_luong_ton, trang_thai_hien_thi, is_available"
    )
    .in("ma_san_pham", ids);

  if (prodErr) return res.status(500).json({ error: prodErr.message });

  const map = new Map((products ?? []).map((p: any) => [p.ma_san_pham, p]));

  for (const it of body.items) {
    const p = map.get(it.ma_san_pham);

    if (!p) {
      return res.status(400).json({ error: `Product not found: ${it.ma_san_pham}` });
    }

    if (!p.trang_thai_hien_thi || !p.is_available) {
      return res.status(400).json({ error: `Product not available: ${p.ten_san_pham}` });
    }

    if (Number(p.so_luong_ton) < it.qty) {
      return res.status(400).json({ error: `Not enough stock: ${p.ten_san_pham}` });
    }
  }

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

  const tong_tien_hang = lines.reduce((sum, line) => sum + line.thanh_tien, 0);
  const phi_van_chuyen = 0;

  let giam_gia = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (body.coupon_code?.trim()) {
    const couponResult = await validateCouponCode({
      code: body.coupon_code,
      subtotal: tong_tien_hang,
    });

    if (!couponResult.ok) {
      return res.status(400).json({ error: couponResult.error });
    }

    giam_gia = couponResult.discountAmount;
    couponId = couponResult.coupon.ma_giam_gia;
    couponCode = couponResult.coupon.code;
  }

  const tong_thanh_toan = tong_tien_hang - giam_gia + phi_van_chuyen;

  const dia_chi_snapshot = body.shipping_address_snapshot
    ? {
      customer_name: body.shipping_address_snapshot.recipient_name,
      phone: body.shipping_address_snapshot.recipient_phone,
      address: body.shipping_address_snapshot.full_address,
      user_address_id: body.user_address_id ?? null,
      recipient_name: body.shipping_address_snapshot.recipient_name,
      recipient_phone: body.shipping_address_snapshot.recipient_phone,
      province_code: body.shipping_address_snapshot.province_code ?? null,
      province_name: body.shipping_address_snapshot.province_name ?? null,
      ward_code: body.shipping_address_snapshot.ward_code ?? null,
      ward_name: body.shipping_address_snapshot.ward_name ?? null,
      address_line1: body.shipping_address_snapshot.address_line1,
      address_line2: body.shipping_address_snapshot.address_line2 ?? null,
      note: body.shipping_address_snapshot.note ?? null,
      full_address: body.shipping_address_snapshot.full_address,
    }
    : {
      customer_name: body.customer_name,
      phone: body.phone,
      address: body.address,
    };

  const { data: created, error: orderErr } = await supabase
    .from("orders")
    .insert({
      ma_nguoi_dung: null,
      dia_chi_giao_hang_snapshot: dia_chi_snapshot,
      ghi_chu: body.note ?? null,
      tong_tien_hang,
      giam_gia,
      phi_van_chuyen,
      tong_thanh_toan,
      ma_giam_gia: couponId,
      coupon_code: couponCode,
      trang_thai_don: "pending",
      trang_thai_thanh_toan: getPaymentStatus(paymentMethod),
      hinh_thuc_thanh_toan: paymentMethod,
    })
    .select("ma_don_hang, trang_thai_thanh_toan, hinh_thuc_thanh_toan")
    .single();

  if (orderErr) return res.status(500).json({ error: orderErr.message });

  const orderId = created.ma_don_hang;

  const { error: detailsErr } = await supabase.from("order_details").insert(
    lines.map((line) => ({
      ma_don_hang: orderId,
      ma_san_pham: line.ma_san_pham,
      so_luong_mua: line.so_luong_mua,
      don_gia_snapshot: line.don_gia_snapshot,
      thanh_tien: line.thanh_tien,
    }))
  );

  if (detailsErr) return res.status(500).json({ error: detailsErr.message });

  for (const it of body.items) {
    const p = map.get(it.ma_san_pham);
    const oldStock = Number(p.so_luong_ton);
    const newStock = oldStock - it.qty;

    const { error: upErr } = await supabase
      .from("products")
      .update({
        so_luong_ton: newStock,
        is_available: newStock > 0,
      })
      .eq("ma_san_pham", it.ma_san_pham);

    if (upErr) return res.status(500).json({ error: upErr.message });

    await createStockMovement({
      ma_san_pham: it.ma_san_pham,
      loai_bien_dong: "order_deduct",
      so_luong_thay_doi: -it.qty,
      so_luong_truoc: oldStock,
      so_luong_sau: newStock,
      ghi_chu: `Trừ kho do đơn hàng ${orderId}`,
      ma_nguoi_thuc_hien: null,
    });
  }

  await increaseCouponUsage(couponId);

  res.status(201).json({
    ok: true,
    order_id: orderId,
    payment_method: paymentMethod,
    payment_status: created.trang_thai_thanh_toan,
    discount_amount: giam_gia,
    final_total: tong_thanh_toan,
    coupon_code: couponCode,
  });
});

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

router.patch("/:id/status", requireAdminOnly, async (req, res) => {
  const id = req.params.id;
  const { trang_thai_don } = req.body as { trang_thai_don?: string };

  const allowed = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];

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