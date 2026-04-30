import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

function createSlug(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

router.get("/", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  const status = (req.query.status as string | undefined)?.trim();
  const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 50);
  const offset = Math.max(Number(req.query.offset ?? 0), 0);

  let query = supabase.from("news").select("*", { count: "exact" });

  if (q) {
    query = query.or(`tieu_de.ilike.%${q}%,slug.ilike.%${q}%,danh_muc.ilike.%${q}%`);
  }

  if (status && status !== "all") {
    query = query.eq("trang_thai", status);
  }

  query = query.order("ngay_tao", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("ma_bai_viet", req.params.id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Không tìm thấy bài viết." });

  return res.json(data);
});

router.post("/", async (req, res) => {
  const {
    tieu_de,
    slug,
    tom_tat,
    noi_dung,
    anh_bia,
    danh_muc,
    tac_gia,
    trang_thai,
    noi_bat,
  } = req.body || {};

  if (!tieu_de?.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập tiêu đề bài viết." });
  }

  if (!noi_dung?.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập nội dung bài viết." });
  }

  const nextStatus = trang_thai === "published" ? "published" : "draft";

  const payload = {
    slug: slug?.trim() || createSlug(tieu_de),
    tieu_de: tieu_de.trim(),
    tom_tat: tom_tat?.trim() || null,
    noi_dung: noi_dung.trim(),
    anh_bia: anh_bia?.trim() || null,
    danh_muc: danh_muc?.trim() || "Tin tức",
    tac_gia: tac_gia?.trim() || "Blue Peach",
    trang_thai: nextStatus,
    noi_bat: Boolean(noi_bat),
    ngay_dang: nextStatus === "published" ? new Date().toISOString() : null,
    ngay_cap_nhat: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("news")
    .insert(payload)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({
    ok: true,
    message: "Thêm bài viết thành công.",
    item: data,
  });
});

router.put("/:id", async (req, res) => {
  const {
    tieu_de,
    slug,
    tom_tat,
    noi_dung,
    anh_bia,
    danh_muc,
    tac_gia,
    trang_thai,
    noi_bat,
  } = req.body || {};

  const payload: Record<string, any> = {
    ngay_cap_nhat: new Date().toISOString(),
  };

  if (typeof tieu_de === "string") payload.tieu_de = tieu_de.trim();
  if (typeof slug === "string") payload.slug = slug.trim();
  if (typeof tom_tat === "string") payload.tom_tat = tom_tat.trim() || null;
  if (typeof noi_dung === "string") payload.noi_dung = noi_dung.trim();
  if (typeof anh_bia === "string") payload.anh_bia = anh_bia.trim() || null;
  if (typeof danh_muc === "string") payload.danh_muc = danh_muc.trim() || "Tin tức";
  if (typeof tac_gia === "string") payload.tac_gia = tac_gia.trim() || "Blue Peach";
  if (typeof noi_bat === "boolean") payload.noi_bat = noi_bat;

  if (trang_thai === "published" || trang_thai === "draft") {
    payload.trang_thai = trang_thai;
    if (trang_thai === "published") {
      payload.ngay_dang = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("ma_bai_viet", req.params.id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    ok: true,
    message: "Cập nhật bài viết thành công.",
    item: data,
  });
});

router.delete("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("news")
    .delete()
    .eq("ma_bai_viet", req.params.id)
    .select("ma_bai_viet, tieu_de")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    ok: true,
    message: "Đã xóa bài viết.",
    item: data,
  });
});

export default router;