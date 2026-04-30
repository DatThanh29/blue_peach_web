import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

function normalizeLimit(value: unknown, fallback = 6) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 24);
}

function normalizeOffset(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(parsed, 0);
}

router.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  const category = (req.query.category as string | undefined)?.trim();
  const featured = (req.query.featured as string | undefined)?.trim();
  const limit = normalizeLimit(req.query.limit);
  const offset = normalizeOffset(req.query.offset);

  let query = supabase
    .from("news")
    .select(
      "ma_bai_viet, slug, tieu_de, tom_tat, anh_bia, danh_muc, tac_gia, trang_thai, noi_bat, luot_xem, ngay_dang, ngay_tao, ngay_cap_nhat",
      { count: "exact" }
    )
    .eq("trang_thai", "published");

  if (q) {
    query = query.or(`tieu_de.ilike.%${q}%,tom_tat.ilike.%${q}%,danh_muc.ilike.%${q}%`);
  }

  if (category && category !== "all") {
    query = query.eq("danh_muc", category);
  }

  if (featured === "true") {
    query = query.eq("noi_bat", true);
  }

  query = query
    .order("noi_bat", { ascending: false })
    .order("ngay_dang", { ascending: false, nullsFirst: false })
    .order("ngay_tao", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
});

router.get("/:slug", async (req, res) => {
  const slug = req.params.slug;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("trang_thai", "published")
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Không tìm thấy bài viết." });

  await supabase
    .from("news")
    .update({ luot_xem: Number(data.luot_xem || 0) + 1 })
    .eq("ma_bai_viet", data.ma_bai_viet);

  const { data: related } = await supabase
    .from("news")
    .select("ma_bai_viet, slug, tieu_de, tom_tat, anh_bia, danh_muc, tac_gia, ngay_dang, ngay_tao")
    .eq("trang_thai", "published")
    .eq("danh_muc", data.danh_muc)
    .neq("ma_bai_viet", data.ma_bai_viet)
    .order("ngay_dang", { ascending: false, nullsFirst: false })
    .limit(3);

  return res.json({
    item: data,
    related: related ?? [],
  });
});

export default router;