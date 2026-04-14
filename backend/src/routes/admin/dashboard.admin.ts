import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

const LOW_STOCK_THRESHOLD = 5;

type OrderRow = {
  ma_don_hang: string;
  ngay_dat_hang: string;
  tong_thanh_toan: number | null;
  trang_thai_don: string | null;
  trang_thai_thanh_toan: string | null;
  hinh_thuc_thanh_toan: string | null;
  dia_chi_giao_hang_snapshot?: {
    customer_name?: string;
    phone?: string;
    address?: string;
  } | null;
};

type ProductStockRow = {
  ma_san_pham: string;
  sku: string | null;
  ten_san_pham: string | null;
  so_luong_ton: number | null;
  primary_image?: string | null;
};

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function normalizeDateInput(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return value;
}

router.get("/", async (req, res) => {
  const from = normalizeDateInput(req.query.from);
  const to = normalizeDateInput(req.query.to);

  let revenueOrdersQuery = supabase
    .from("orders")
    .select("ngay_dat_hang, tong_thanh_toan, trang_thai_thanh_toan")
    .not("ngay_dat_hang", "is", null)
    .eq("trang_thai_thanh_toan", "paid")
    .order("ngay_dat_hang", { ascending: true });

  if (from) {
    revenueOrdersQuery = revenueOrdersQuery.gte("ngay_dat_hang", `${from}T00:00:00`);
  }

  if (to) {
    revenueOrdersQuery = revenueOrdersQuery.lte("ngay_dat_hang", `${to}T23:59:59`);
  }

  const [
    allOrdersRes,
    productsCountRes,
    pendingOrdersRes,
    paidOrdersRes,
    lowStockCountRes,
    outOfStockCountRes,
    latestOrdersRes,
    paidRevenueOrdersRes,
    revenueOrdersRes,
    lowStockItemsRes,
    outOfStockItemsRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "ma_don_hang, tong_thanh_toan, trang_thai_don, trang_thai_thanh_toan, hinh_thuc_thanh_toan, ngay_dat_hang",
        { count: "exact" }
      ),

    supabase
      .from("products")
      .select("ma_san_pham", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("ma_don_hang", { count: "exact", head: true })
      .eq("trang_thai_don", "pending"),

    supabase
      .from("orders")
      .select("ma_don_hang", { count: "exact", head: true })
      .eq("trang_thai_thanh_toan", "paid"),

    supabase
      .from("products")
      .select("ma_san_pham", { count: "exact", head: true })
      .gt("so_luong_ton", 0)
      .lte("so_luong_ton", LOW_STOCK_THRESHOLD)
      .eq("trang_thai_hien_thi", true),

    supabase
      .from("products")
      .select("ma_san_pham", { count: "exact", head: true })
      .eq("so_luong_ton", 0)
      .eq("trang_thai_hien_thi", true),

    supabase
      .from("orders")
      .select(
        "ma_don_hang, ngay_dat_hang, tong_thanh_toan, trang_thai_don, trang_thai_thanh_toan, hinh_thuc_thanh_toan, dia_chi_giao_hang_snapshot"
      )
      .order("ngay_dat_hang", { ascending: false })
      .limit(5),

    supabase
      .from("orders")
      .select("tong_thanh_toan")
      .eq("trang_thai_thanh_toan", "paid"),

    revenueOrdersQuery,

    supabase
      .from("products")
      .select("ma_san_pham, sku, ten_san_pham, so_luong_ton, primary_image")
      .gt("so_luong_ton", 0)
      .lte("so_luong_ton", LOW_STOCK_THRESHOLD)
      .eq("trang_thai_hien_thi", true)
      .order("so_luong_ton", { ascending: true })
      .limit(5),

    supabase
      .from("products")
      .select("ma_san_pham, sku, ten_san_pham, so_luong_ton, primary_image")
      .eq("so_luong_ton", 0)
      .eq("trang_thai_hien_thi", true)
      .order("ngay_cap_nhat", { ascending: false })
      .limit(5),
  ]);

  const responses = [
    allOrdersRes,
    productsCountRes,
    pendingOrdersRes,
    paidOrdersRes,
    lowStockCountRes,
    outOfStockCountRes,
    latestOrdersRes,
    paidRevenueOrdersRes,
    revenueOrdersRes,
    lowStockItemsRes,
    outOfStockItemsRes,
  ];

  for (const result of responses) {
    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }
  }

  const allOrders = (allOrdersRes.data ?? []) as OrderRow[];
  const paidRevenueOrders = (paidRevenueOrdersRes.data ?? []) as Array<{
    tong_thanh_toan: number | null;
  }>;
  const revenueOrders = (revenueOrdersRes.data ?? []) as Array<{
    ngay_dat_hang: string;
    tong_thanh_toan: number | null;
  }>;
  const lowStockItems = (lowStockItemsRes.data ?? []) as ProductStockRow[];
  const outOfStockItems = (outOfStockItemsRes.data ?? []) as ProductStockRow[];

  const totalRevenue = paidRevenueOrders.reduce((sum, order) => {
    return sum + Number(order.tong_thanh_toan || 0);
  }, 0);

  const orderStatusMap = new Map<string, number>();
  const paymentMethodMap = new Map<string, number>();
  const paymentStatusMap = new Map<string, number>();

  for (const order of allOrders) {
    const orderStatus = order.trang_thai_don || "unknown";
    const paymentMethod = order.hinh_thuc_thanh_toan || "unknown";
    const paymentStatus = order.trang_thai_thanh_toan || "unknown";

    orderStatusMap.set(orderStatus, (orderStatusMap.get(orderStatus) || 0) + 1);
    paymentMethodMap.set(
      paymentMethod,
      (paymentMethodMap.get(paymentMethod) || 0) + 1
    );
    paymentStatusMap.set(
      paymentStatus,
      (paymentStatusMap.get(paymentStatus) || 0) + 1
    );
  }

  const revenueByDateMap = new Map<string, number>();

  for (const order of revenueOrders) {
    const label = formatDateLabel(order.ngay_dat_hang);
    const current = revenueByDateMap.get(label) || 0;
    revenueByDateMap.set(label, current + Number(order.tong_thanh_toan || 0));
  }

  const revenueSeries = Array.from(revenueByDateMap.entries()).map(([label, revenue]) => ({
    label,
    revenue,
  }));

  const orderStatusSummary = Array.from(orderStatusMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  const paymentMethodSummary = Array.from(paymentMethodMap.entries()).map(
    ([method, count]) => ({
      method,
      count,
    })
  );

  const paymentStatusSummary = Array.from(paymentStatusMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  return res.json({
    stats: {
      totalOrders: allOrdersRes.count ?? 0,
      totalRevenue,
      totalProducts: productsCountRes.count ?? 0,
      pendingOrders: pendingOrdersRes.count ?? 0,
      paidOrders: paidOrdersRes.count ?? 0,
      lowStockProducts: lowStockCountRes.count ?? 0,
      outOfStockProducts: outOfStockCountRes.count ?? 0,
    },
    filters: {
      from,
      to,
    },
    revenueSeries,
    orderStatusSummary,
    paymentMethodSummary,
    paymentStatusSummary,
    lowStockItems,
    outOfStockItems,
    latestOrders: latestOrdersRes.data ?? [],
  });
});

export default router;