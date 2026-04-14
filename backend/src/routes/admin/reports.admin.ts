import { Router } from "express";
import ExcelJS from "exceljs";
import { supabase } from "../../lib/supabase";

const router = Router();

function normalizeDateInput(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return value;
}

function formatCurrency(value: number | null | undefined) {
  return Number(value || 0);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function orderStatusLabel(status: string | null | undefined) {
  const map: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return map[status || ""] ?? String(status || "");
}

function paymentStatusLabel(status: string | null | undefined) {
  const map: Record<string, string> = {
    unpaid: "Chưa thanh toán",
    pending_payment: "Chờ thanh toán",
    paid: "Đã thanh toán",
    payment_failed: "Thanh toán lỗi",
  };
  return map[status || ""] ?? String(status || "");
}

function paymentMethodLabel(method: string | null | undefined) {
  const map: Record<string, string> = {
    cod: "COD",
    vnpay: "VNPay",
  };
  return map[method || ""] ?? String(method || "");
}

router.get("/revenue/export", async (req, res) => {
  const from = normalizeDateInput(req.query.from);
  const to = normalizeDateInput(req.query.to);

  let query = supabase
    .from("orders")
    .select(
      "ma_don_hang, ngay_dat_hang, tong_thanh_toan, trang_thai_don, trang_thai_thanh_toan, hinh_thuc_thanh_toan, dia_chi_giao_hang_snapshot"
    )
    .order("ngay_dat_hang", { ascending: false });

  if (from) {
    query = query.gte("ngay_dat_hang", `${from}T00:00:00`);
  }

  if (to) {
    query = query.lte("ngay_dat_hang", `${to}T23:59:59`);
  }

  const ordersRes = await query;

  if (ordersRes.error) {
    return res.status(500).json({ error: ordersRes.error.message });
  }

  const orders = ordersRes.data ?? [];

  const totalOrders = orders.length;
  const paidOrders = orders.filter((item: any) => item.trang_thai_thanh_toan === "paid");
  const totalRevenue = paidOrders.reduce(
    (sum: number, item: any) => sum + Number(item.tong_thanh_toan || 0),
    0
  );
  const codCount = orders.filter((item: any) => item.hinh_thuc_thanh_toan === "cod").length;
  const vnpayCount = orders.filter((item: any) => item.hinh_thuc_thanh_toan === "vnpay").length;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Blue Peach Admin";
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet("Tong quan");
  summarySheet.columns = [
    { header: "Chi so", key: "metric", width: 28 },
    { header: "Gia tri", key: "value", width: 22 },
  ];

  summarySheet.addRows([
    { metric: "Tu ngay", value: from || "Tat ca" },
    { metric: "Den ngay", value: to || "Tat ca" },
    { metric: "Tong so don", value: totalOrders },
    { metric: "Don da thanh toan", value: paidOrders.length },
    { metric: "Tong doanh thu paid", value: totalRevenue },
    { metric: "So don COD", value: codCount },
    { metric: "So don VNPay", value: vnpayCount },
  ]);

  summarySheet.getRow(1).font = { bold: true };
  summarySheet.getColumn("value").numFmt = "#,##0";

  const detailSheet = workbook.addWorksheet("Chi tiet don hang");
  detailSheet.columns = [
    { header: "Mã đơn", key: "ma_don_hang", width: 22 },
    { header: "Thời gian", key: "ngay_dat_hang", width: 24 },
    { header: "Khách hàng", key: "customer_name", width: 24 },
    { header: "SĐT", key: "phone", width: 18 },
    { header: "Địa chỉ", key: "address", width: 36 },
    { header: "Trạng thái đơn", key: "trang_thai_don", width: 20 },
    { header: "Trạng thái thanh toán", key: "trang_thai_thanh_toan", width: 22 },
    { header: "Phương thức", key: "hinh_thuc_thanh_toan", width: 16 },
    { header: "Tổng thanh toán", key: "tong_thanh_toan", width: 18 },
  ];

  detailSheet.getRow(1).font = { bold: true };

  orders.forEach((order: any) => {
    detailSheet.addRow({
      ma_don_hang: order.ma_don_hang,
      ngay_dat_hang: formatDate(order.ngay_dat_hang),
      customer_name: order.dia_chi_giao_hang_snapshot?.customer_name || "",
      phone: order.dia_chi_giao_hang_snapshot?.phone || "",
      address: order.dia_chi_giao_hang_snapshot?.address || "",
      trang_thai_don: orderStatusLabel(order.trang_thai_don),
      trang_thai_thanh_toan: paymentStatusLabel(order.trang_thai_thanh_toan),
      hinh_thuc_thanh_toan: paymentMethodLabel(order.hinh_thuc_thanh_toan),
      tong_thanh_toan: formatCurrency(order.tong_thanh_toan),
    });
  });

  detailSheet.getColumn("tong_thanh_toan").numFmt = "#,##0";

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="blue-peach-revenue-report-${Date.now()}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
});

export default router;