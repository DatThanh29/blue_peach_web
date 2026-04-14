export type CartItem = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  primary_image?: string | null;
  qty: number;
};

const KEY = "bluepeach_cart_v1";
export const CART_UPDATED_EVENT = "bluepeach-cart-updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function emitCartUpdated(items: CartItem[]) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: items,
    })
  );
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  emitCartUpdated(items);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.ma_san_pham === item.ma_san_pham);

  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ ...item, qty });

  saveCart(cart);
  return cart;
}

export function updateQty(ma_san_pham: string, qty: number) {
  const cart = getCart()
    .map((x) => (x.ma_san_pham === ma_san_pham ? { ...x, qty } : x))
    .filter((x) => x.qty > 0);

  saveCart(cart);
  return cart;
}

export function removeItem(ma_san_pham: string) {
  const cart = getCart().filter((x) => x.ma_san_pham !== ma_san_pham);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}