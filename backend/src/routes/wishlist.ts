import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;

    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        id,
        product_id,
        created_at,
        product:products (
          ma_san_pham,
          ten_san_pham,
          gia_ban,
          gia_goc,
          phan_tram_giam,
          so_luong_ton,
          primary_image
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const items = (data || [])
      .map((row: any) => {
        const product = Array.isArray(row.product) ? row.product[0] : row.product;
        if (!product) return null;

        return {
          id: row.id,
          product_id: row.product_id,
          created_at: row.created_at,
          product,
        };
      })
      .filter(Boolean);

    return res.json({ items });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load wishlist",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const productId =
      typeof req.body?.productId === "string" ? req.body.productId.trim() : "";

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("ma_san_pham")
      .eq("ma_san_pham", productId)
      .maybeSingle();

    if (productError) {
      return res.status(500).json({ error: productError.message });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { data, error } = await supabase
      .from("wishlists")
      .upsert(
        {
          user_id: userId,
          product_id: productId,
        },
        {
          onConflict: "user_id,product_id",
          ignoreDuplicates: true,
        }
      )
      .select("id, user_id, product_id, created_at")
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      ok: true,
      item: data || null,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot add wishlist item",
    });
  }
});

router.delete("/:productId", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const productId =
      typeof req.params.productId === "string" ? req.params.productId.trim() : "";

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot remove wishlist item",
    });
  }
});

export default router;