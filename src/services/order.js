import { supabase } from "./supabase.js";

export async function findOrdersByUserId(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      ma_don_hang,
      ngay_dat_hang,
      tong_tien_hang,
      tong_thanh_toan,
      trang_thai_don,
      trang_thai_thanh_toan,
      hinh_thuc_thanh_toan
    `)
    .eq("ma_nguoi_dung", userId)
    .order("ngay_dat_hang", { ascending: false })
    .limit(5);

  if (error) throw error;

  return data || [];
}

export async function findOrderByOrderId(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      ma_don_hang,
      ngay_dat_hang,
      tong_tien_hang,
      tong_thanh_toan,
      trang_thai_don,
      trang_thai_thanh_toan,
      hinh_thuc_thanh_toan
    `)
    .eq("ma_don_hang", orderId)
    .maybeSingle();

  if (error) throw error;

  return data || null;
}