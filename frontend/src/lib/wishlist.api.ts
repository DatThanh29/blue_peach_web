import { authFetch } from "./api";

export type WishlistProduct = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  so_luong_ton: number;
  primary_image: string | null;
};

export type WishlistItem = {
  id: string;
  product_id: string;
  created_at: string;
  product: WishlistProduct;
};

export async function getWishlist() {
  return authFetch("/wishlist") as Promise<{ items: WishlistItem[] }>;
}

export async function addWishlist(productId: string) {
  return authFetch("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  }) as Promise<{ ok: boolean }>;
}

export async function removeWishlist(productId: string) {
  return authFetch(`/wishlist/${productId}`, {
    method: "DELETE",
  }) as Promise<{ ok: boolean }>;
}