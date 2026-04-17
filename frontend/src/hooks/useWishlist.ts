"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  addWishlist,
  getWishlist,
  removeWishlist,
  type WishlistItem,
} from "@/lib/wishlist.api";

export function useWishlist() {
  const { isAuthenticated, isLoading } = useCustomerAuth();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);

  const wishlistSet = useMemo(() => {
    return new Set(items.map((item) => item.product_id));
  }, [items]);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await getWishlist();
      setItems(res.items || []);
    } catch (error) {
      console.error("[useWishlist] loadWishlist failed:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;
    void loadWishlist();
  }, [isLoading, loadWishlist]);

  const isWishlisted = useCallback(
    (productId: string) => wishlistSet.has(productId),
    [wishlistSet]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        throw new Error("AUTH_REQUIRED");
      }

      setTogglingIds((prev) => [...prev, productId]);

      const alreadyLiked = wishlistSet.has(productId);

      try {
        if (alreadyLiked) {
          await removeWishlist(productId);
          setItems((prev) => prev.filter((item) => item.product_id !== productId));
        } else {
          await addWishlist(productId);
          await loadWishlist();
        }
      } finally {
        setTogglingIds((prev) => prev.filter((id) => id !== productId));
      }
    },
    [isAuthenticated, wishlistSet, loadWishlist]
  );

  return {
    items,
    loading,
    isWishlisted,
    toggleWishlist,
    isToggling: (productId: string) => togglingIds.includes(productId),
    refreshWishlist: loadWishlist,
  };
}