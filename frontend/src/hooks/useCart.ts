"use client";

import { useContext } from "react";
import { useCartContext } from "@/contexts/CartContext";

export function useCart() {
  const context = useCartContext();
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
