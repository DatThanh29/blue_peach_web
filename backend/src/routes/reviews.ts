import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * GET /api/reviews/featured?limit=6
 */
router.get("/featured", async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 6), 1), 12);

  const { data, error } = await supabase
    .from("product_reviews")
    .select(`
      ma_danh_gia,
      ma_san_pham,
      ten_nguoi_danh_gia,
      so_sao,
      noi_dung,
      ngay_tao,
      products (
        ma_san_pham,
        ten_san_pham,
        primary_image
      )
    `)
    .eq("trang_thai", "approved")
    .eq("is_featured", true)
    .eq("la_xoa_mem", false)
    .order("ngay_tao", { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
    total: data?.length ?? 0,
  });
});

/**
 * POST /api/reviews
 * Customer creates a pending product review.
 * Body: { ma_san_pham, so_sao, noi_dung }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const { ma_san_pham, so_sao, noi_dung } = req.body ?? {};

    const productId = String(ma_san_pham || "").trim();
    const rating = Number(so_sao);
    const content = String(noi_dung || "").trim();

    if (!productId) {
      return res.status(400).json({ error: "Thiếu mã sản phẩm." });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Số sao phải từ 1 đến 5." });
    }

    if (content.length < 10) {
      return res.status(400).json({
        error: "Nội dung đánh giá cần tối thiểu 10 ký tự.",
      });
    }

    const { data: purchasedRows, error: purchasedError } = await supabase
      .from("order_details")
      .select(
        `
        ma_ct_don_hang,
        orders!inner (
          ma_don_hang,
          ma_nguoi_dung,
          trang_thai_thanh_toan
        )
      `
      )
      .eq("ma_san_pham", productId)
      .eq("orders.ma_nguoi_dung", userId)
      .in("orders.trang_thai_thanh_toan", ["paid", "unpaid"])
      .limit(1);

    if (purchasedError) {
      return res.status(500).json({ error: purchasedError.message });
    }

    if (!purchasedRows || purchasedRows.length === 0) {
      return res.status(403).json({
        error: "Bạn cần mua sản phẩm này trước khi đánh giá.",
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .maybeSingle();

    const displayName =
      profile?.full_name?.trim() ||
      profile?.email?.split("@")[0] ||
      "Khách hàng Blue Peach";

    const { data: existingRows, error: existingError } = await supabase
      .from("product_reviews")
      .select("ma_danh_gia")
      .eq("ma_san_pham", productId)
      .eq("ma_nguoi_dung", userId)
      .eq("la_xoa_mem", false)
      .limit(1);

    if (existingError) {
      return res.status(500).json({ error: existingError.message });
    }

    if ((existingRows ?? []).length > 0) {
      return res.status(400).json({
        error: "Bạn đã gửi đánh giá cho sản phẩm này rồi.",
      });
    }

    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        ma_san_pham: productId,
        ma_nguoi_dung: userId,
        ten_nguoi_danh_gia: displayName,
        so_sao: rating,
        noi_dung: content,
        trang_thai: "pending",
        is_featured: false,
        la_xoa_mem: false,
      })
      .select(
        "ma_danh_gia, ma_san_pham, ten_nguoi_danh_gia, so_sao, noi_dung, trang_thai, ngay_tao"
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      ok: true,
      item: data,
      message: "Đánh giá đã được gửi và đang chờ admin duyệt.",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Không thể gửi đánh giá.",
    });
  }
});

export default router;  