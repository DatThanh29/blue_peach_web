import { supabase } from "./supabase";

export type StockMovementType =
  | "initial_stock"
  | "manual_adjust"
  | "order_deduct"
  | "cancel_refund";

export async function createStockMovement(params: {
  ma_san_pham: string;
  loai_bien_dong: StockMovementType;
  so_luong_thay_doi: number;
  so_luong_truoc: number;
  so_luong_sau: number;
  ghi_chu?: string | null;
  ma_nguoi_thuc_hien?: string | null;
}) {
  const { error } = await supabase.from("stock_movements").insert({
    ma_san_pham: params.ma_san_pham,
    loai_bien_dong: params.loai_bien_dong,
    so_luong_thay_doi: params.so_luong_thay_doi,
    so_luong_truoc: params.so_luong_truoc,
    so_luong_sau: params.so_luong_sau,
    ghi_chu: params.ghi_chu ?? null,
    ma_nguoi_thuc_hien: params.ma_nguoi_thuc_hien ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}