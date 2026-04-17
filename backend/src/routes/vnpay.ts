import { Router } from "express";
import crypto from "crypto";
import { supabase } from "../lib/supabase";
import { increaseCouponUsage, validateCouponCode } from "../lib/coupons";
import { createStockMovement } from "../lib/stock";

const router = Router();

type OrderItemInput = {
  ma_san_pham: string;
  qty: number;
};

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

type CreateVnpayBody = {
  customer_user_id?: string | null;
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  coupon_code?: string;
  user_address_id?: string;
  shipping_address_snapshot?: ShippingAddressSnapshot;
  items: OrderItemInput[];
};

const VNP_TMN_CODE = process.env.VNP_TMN_CODE || "";
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || "";
const VNP_URL =
  process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

function sortObject(obj: Record<string, string | number>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = String(obj[key]);
  }
  return sorted;
}

function buildSignedQuery(params: Record<string, string | number>) {
  const sorted = sortObject(params);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(sorted)) {
    searchParams.append(key, String(value));
  }

  const signData = searchParams.toString();
  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  searchParams.append("vnp_SecureHash", secureHash);
  return searchParams.toString();
}

function verifyVnpayQuery(query: Record<string, any>) {
  const copied = { ...query };
  const secureHash = copied.vnp_SecureHash;
  delete copied.vnp_SecureHash;
  delete copied.vnp_SecureHashType;

  const sorted = sortObject(copied);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(sorted)) {
    searchParams.append(key, String(value));
  }

  const signData = searchParams.toString();
  const signed = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  return signed === secureHash;
}

function formatDateVN(date = new Date()) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function getClientIp(req: any) {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  );
}

router.post("/create", async (req, res) => {
  try {
    if (!VNP_TMN_CODE || !VNP_HASH_SECRET || !VNP_RETURN_URL) {
      return res.status(500).json({
        error: "VNPay env chưa được cấu hình đầy đủ.",
      });
    }

    const body = req.body as CreateVnpayBody;

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
        return res
          .status(400)
          .json({ error: `Product not found: ${it.ma_san_pham}` });
      }

      if (!p.trang_thai_hien_thi || !p.is_available) {
        return res
          .status(400)
          .json({ error: `Product not available: ${p.ten_san_pham}` });
      }

      if (Number(p.so_luong_ton) < it.qty) {
        return res
          .status(400)
          .json({ error: `Not enough stock: ${p.ten_san_pham}` });
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
        ma_nguoi_dung: body.customer_user_id ?? null,
        dia_chi_giao_hang_snapshot: dia_chi_snapshot,
        ghi_chu: body.note ?? null,
        tong_tien_hang,
        giam_gia,
        phi_van_chuyen,
        tong_thanh_toan,
        ma_giam_gia: couponId,
        coupon_code: couponCode,
        trang_thai_don: "pending",
        trang_thai_thanh_toan: "pending_payment",
        hinh_thuc_thanh_toan: "vnpay",
      })
      .select("ma_don_hang, tong_thanh_toan")
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

    await increaseCouponUsage(couponId);

    const now = new Date();
    const createDate = formatDateVN(now);
    const expireDate = formatDateVN(addMinutes(now, 15));

    const txnRef = `${String(orderId).replace(/-/g, "").slice(0, 24)}${Date.now()
      .toString()
      .slice(-6)}`.slice(0, 30);

    const { error: updateTxnErr } = await supabase
      .from("orders")
      .update({
        ma_tham_chieu_thanh_toan: txnRef,
      })
      .eq("ma_don_hang", orderId);

    if (updateTxnErr) {
      return res.status(500).json({ error: updateTxnErr.message });
    }

    const amountForGateway = Math.round(Number(created.tong_thanh_toan) * 100);

    const vnpParams: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amountForGateway,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpAddr: getClientIp(req),
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    const paymentUrl = `${VNP_URL}?${buildSignedQuery(vnpParams)}`;

    return res.status(201).json({
      ok: true,
      order_id: orderId,
      payment_method: "vnpay",
      payment_status: "pending_payment",
      payment_url: paymentUrl,
      discount_amount: giam_gia,
      final_total: tong_thanh_toan,
      coupon_code: couponCode,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Không thể tạo URL thanh toán VNPay",
    });
  }
});

router.get("/return", async (req, res) => {
  try {
    const query = req.query as Record<string, any>;

    const isValidChecksum = verifyVnpayQuery(query);
    const txnRef = String(query.vnp_TxnRef || "");
    const responseCode = String(query.vnp_ResponseCode || "");
    const transactionStatus = String(query.vnp_TransactionStatus || "");
    const amount = Number(query.vnp_Amount || 0) / 100;
    const bankCode = query.vnp_BankCode ? String(query.vnp_BankCode) : null;
    const transactionNo = query.vnp_TransactionNo
      ? String(query.vnp_TransactionNo)
      : null;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("ma_don_hang, tong_thanh_toan, trang_thai_thanh_toan")
      .eq("ma_tham_chieu_thanh_toan", txnRef)
      .maybeSingle();

    if (orderErr) {
      return res.redirect(
        `${FRONTEND_URL}/checkout/success?status=error&payment=vnpay&message=${encodeURIComponent(
          orderErr.message
        )}`
      );
    }

    if (!order) {
      return res.redirect(
        `${FRONTEND_URL}/checkout/success?status=error&payment=vnpay&message=${encodeURIComponent(
          "Không tìm thấy đơn hàng"
        )}`
      );
    }

    const isSuccess =
      isValidChecksum &&
      responseCode === "00" &&
      transactionStatus === "00" &&
      Number(order.tong_thanh_toan) === amount;

    if (isSuccess && order.trang_thai_thanh_toan !== "paid") {
      await supabase
        .from("orders")
        .update({
          trang_thai_thanh_toan: "paid",
          hinh_thuc_thanh_toan: "vnpay",
          ma_giao_dich_cong: transactionNo,
          ma_ngan_hang: bankCode,
          ngay_thanh_toan: new Date().toISOString(),
        })
        .eq("ma_don_hang", order.ma_don_hang);

      const { data: items } = await supabase
        .from("order_details")
        .select("ma_san_pham, so_luong_mua")
        .eq("ma_don_hang", order.ma_don_hang);

      if (items?.length) {
        for (const it of items) {
          const { data: product } = await supabase
            .from("products")
            .select("so_luong_ton")
            .eq("ma_san_pham", it.ma_san_pham)
            .single();

          if (product) {
            const oldStock = Number(product.so_luong_ton);
            const newStock = oldStock - Number(it.so_luong_mua);

            await supabase
              .from("products")
              .update({
                so_luong_ton: newStock,
                is_available: newStock > 0,
              })
              .eq("ma_san_pham", it.ma_san_pham);

            await createStockMovement({
              ma_san_pham: it.ma_san_pham,
              loai_bien_dong: "order_deduct",
              so_luong_thay_doi: -Number(it.so_luong_mua),
              so_luong_truoc: oldStock,
              so_luong_sau: newStock,
              ghi_chu: `Trừ kho do thanh toán VNPay cho đơn ${order.ma_don_hang}`,
              ma_nguoi_thuc_hien: null,
            });
          }
        }
      }
    } else if (!isSuccess && order.trang_thai_thanh_toan === "pending_payment") {
      await supabase
        .from("orders")
        .update({
          trang_thai_thanh_toan: "payment_failed",
          hinh_thuc_thanh_toan: "vnpay",
          ma_giao_dich_cong: transactionNo,
          ma_ngan_hang: bankCode,
        })
        .eq("ma_don_hang", order.ma_don_hang);
    }

    return res.redirect(
      `${FRONTEND_URL}/checkout/success?status=${
        isSuccess ? "success" : "failed"
      }&order=${encodeURIComponent(order.ma_don_hang)}&code=${encodeURIComponent(
        responseCode
      )}&payment=vnpay&amount=${encodeURIComponent(amount)}`
    );
  } catch (error: any) {
    return res.redirect(
      `${FRONTEND_URL}/checkout/success?status=error&payment=vnpay&message=${encodeURIComponent(
        error?.message || "Lỗi xử lý kết quả VNPay"
      )}`
    );
  }
});

router.get("/ipn", async (req, res) => {
  try {
    const query = req.query as Record<string, any>;
    const isValidChecksum = verifyVnpayQuery(query);

    if (!isValidChecksum) {
      return res.json({ RspCode: "97", Message: "Invalid checksum" });
    }

    const txnRef = String(query.vnp_TxnRef || "");
    const responseCode = String(query.vnp_ResponseCode || "");
    const transactionStatus = String(query.vnp_TransactionStatus || "");
    const amount = Number(query.vnp_Amount || 0) / 100;
    const bankCode = query.vnp_BankCode ? String(query.vnp_BankCode) : null;
    const transactionNo = query.vnp_TransactionNo
      ? String(query.vnp_TransactionNo)
      : null;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("ma_don_hang, tong_thanh_toan, trang_thai_thanh_toan")
      .eq("ma_tham_chieu_thanh_toan", txnRef)
      .maybeSingle();

    if (orderErr) {
      return res.json({ RspCode: "99", Message: orderErr.message });
    }

    if (!order) {
      return res.json({ RspCode: "01", Message: "Order not found" });
    }

    if (Number(order.tong_thanh_toan) !== amount) {
      return res.json({ RspCode: "04", Message: "Invalid amount" });
    }

    if (order.trang_thai_thanh_toan === "paid") {
      return res.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    const isSuccess = responseCode === "00" && transactionStatus === "00";

    if (isSuccess) {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          trang_thai_thanh_toan: "paid",
          hinh_thuc_thanh_toan: "vnpay",
          ma_giao_dich_cong: transactionNo,
          ma_ngan_hang: bankCode,
          ngay_thanh_toan: new Date().toISOString(),
        })
        .eq("ma_don_hang", order.ma_don_hang);

      if (updateErr) {
        return res.json({ RspCode: "99", Message: updateErr.message });
      }

      const { data: items, error: itemsErr } = await supabase
        .from("order_details")
        .select("ma_san_pham, so_luong_mua")
        .eq("ma_don_hang", order.ma_don_hang);

      if (itemsErr) {
        return res.json({ RspCode: "99", Message: itemsErr.message });
      }

      for (const it of items ?? []) {
        const { data: product, error: productErr } = await supabase
          .from("products")
          .select("so_luong_ton")
          .eq("ma_san_pham", it.ma_san_pham)
          .single();

        if (productErr) {
          return res.json({ RspCode: "99", Message: productErr.message });
        }

        const oldStock = Number(product.so_luong_ton);
        const newStock = oldStock - Number(it.so_luong_mua);

        const { error: stockErr } = await supabase
          .from("products")
          .update({
            so_luong_ton: newStock,
            is_available: newStock > 0,
          })
          .eq("ma_san_pham", it.ma_san_pham);

        if (stockErr) {
          return res.json({ RspCode: "99", Message: stockErr.message });
        }

        await createStockMovement({
          ma_san_pham: it.ma_san_pham,
          loai_bien_dong: "order_deduct",
          so_luong_thay_doi: -Number(it.so_luong_mua),
          so_luong_truoc: oldStock,
          so_luong_sau: newStock,
          ghi_chu: `Trừ kho do IPN VNPay cho đơn ${order.ma_don_hang}`,
          ma_nguoi_thuc_hien: null,
        });
      }

      return res.json({ RspCode: "00", Message: "Confirm Success" });
    }

    const { error: failedErr } = await supabase
      .from("orders")
      .update({
        trang_thai_thanh_toan: "payment_failed",
        hinh_thuc_thanh_toan: "vnpay",
        ma_giao_dich_cong: transactionNo,
        ma_ngan_hang: bankCode,
      })
      .eq("ma_don_hang", order.ma_don_hang);

    if (failedErr) {
      return res.json({ RspCode: "99", Message: failedErr.message });
    }

    return res.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (error: any) {
    return res.json({
      RspCode: "99",
      Message: error?.message || "Unknown error",
    });
  }
});

export default router;