import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/home", async (_req, res) => {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("vi_tri", "home_hero")
    .eq("trang_thai_hien_thi", true)
    .order("thu_tu", { ascending: true })
    .order("ngay_tao", { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    item: data?.[0] ?? null,
  });
});

export default router;