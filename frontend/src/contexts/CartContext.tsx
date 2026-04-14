"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addToCart,
  CART_UPDATED_EVENT,
  CartItem,
  clearCart,
  getCart,
  removeItem,
  updateQty,
} from "@/lib/cart";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateItemQty: (ma_san_pham: string, qty: number) => void;
  removeItemById: (ma_san_pham: string) => void;
  clearAll: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());

    const syncFromStorage = () => {
      setItems(getCart());
    };

    const syncFromCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      } else {
        setItems(getCart());
      }
    };

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(CART_UPDATED_EVENT, syncFromCustomEvent as EventListener);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(
        CART_UPDATED_EVENT,
        syncFromCustomEvent as EventListener
      );
    };
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem: (item, qty = 1) => {
        const next = addToCart(item, qty);
        setItems(next);
      },
      updateItemQty: (ma_san_pham, qty) => {
        const next = updateQty(ma_san_pham, qty);
        setItems(next);
      },
      removeItemById: (ma_san_pham) => {
        const next = removeItem(ma_san_pham);
        setItems(next);
      },
      clearAll: () => {
        clearCart();
        setItems([]);
      },
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}