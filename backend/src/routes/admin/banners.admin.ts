import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("thu_tu", { ascending: true })
    .order("ngay_tao", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

router.post("/", async (req, res) => {
  const {
    vi_tri = "home_hero",
    tieu_de,
    mo_ta_ngan,
    cta_text,
    cta_link,
    image_url,
    thu_tu = 1,
    trang_thai_hien_thi = true,
  } = req.body ?? {};

  if (!image_url || typeof image_url !== "string") {
    return res.status(400).json({ error: "image_url is required" });
  }

  const { data, error } = await supabase
    .from("banners")
    .insert({
      vi_tri,
      tieu_de: tieu_de ?? null,
      mo_ta_ngan: mo_ta_ngan ?? null,
      cta_text: cta_text ?? null,
      cta_link: cta_link ?? null,
      image_url,
      thu_tu: Number(thu_tu || 1),
      trang_thai_hien_thi: Boolean(trang_thai_hien_thi),
    })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    ok: true,
    item: data,
  });
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body ?? {};

  const updateData = {
    vi_tri: payload.vi_tri ?? undefined,
    tieu_de: payload.tieu_de ?? undefined,
    mo_ta_ngan: payload.mo_ta_ngan ?? undefined,
    cta_text: payload.cta_text ?? undefined,
    cta_link: payload.cta_link ?? undefined,
    image_url: payload.image_url ?? undefined,
    thu_tu:
      payload.thu_tu !== undefined ? Number(payload.thu_tu || 1) : undefined,
    trang_thai_hien_thi:
      payload.trang_thai_hien_thi !== undefined
        ? Boolean(payload.trang_thai_hien_thi)
        : undefined,
  };

  const { data, error } = await supabase
    .from("banners")
    .update(updateData)
    .eq("ma_banner", id)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    item: data,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("ma_banner", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ ok: true });
});

export default router;