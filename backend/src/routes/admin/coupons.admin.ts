import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("ngay_tao", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

router.post("/", async (req, res) => {
  const payload = req.body ?? {};

  if (!payload.code || !payload.loai_giam_gia || payload.gia_tri_giam === undefined) {
    return res.status(400).json({ error: "Thiếu thông tin coupon." });
  }

  const insertData = {
    code: String(payload.code).trim().toUpperCase(),
    loai_giam_gia: payload.loai_giam_gia,
    gia_tri_giam: Number(payload.gia_tri_giam || 0),
    don_hang_toi_thieu: Number(payload.don_hang_toi_thieu || 0),
    giam_toi_da:
      payload.giam_toi_da !== "" && payload.giam_toi_da !== undefined
        ? Number(payload.giam_toi_da)
        : null,
    so_lan_su_dung_toi_da:
      payload.so_lan_su_dung_toi_da !== "" &&
      payload.so_lan_su_dung_toi_da !== undefined
        ? Number(payload.so_lan_su_dung_toi_da)
        : null,
    trang_thai: Boolean(payload.trang_thai ?? true),
    ngay_bat_dau: payload.ngay_bat_dau || null,
    ngay_ket_thuc: payload.ngay_ket_thuc || null,
  };

  const { data, error } = await supabase
    .from("coupons")
    .insert(insertData)
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
    code: payload.code ? String(payload.code).trim().toUpperCase() : undefined,
    loai_giam_gia: payload.loai_giam_gia ?? undefined,
    gia_tri_giam:
      payload.gia_tri_giam !== undefined
        ? Number(payload.gia_tri_giam || 0)
        : undefined,
    don_hang_toi_thieu:
      payload.don_hang_toi_thieu !== undefined
        ? Number(payload.don_hang_toi_thieu || 0)
        : undefined,
    giam_toi_da:
      payload.giam_toi_da !== undefined
        ? payload.giam_toi_da === ""
          ? null
          : Number(payload.giam_toi_da)
        : undefined,
    so_lan_su_dung_toi_da:
      payload.so_lan_su_dung_toi_da !== undefined
        ? payload.so_lan_su_dung_toi_da === ""
          ? null
          : Number(payload.so_lan_su_dung_toi_da)
        : undefined,
    trang_thai:
      payload.trang_thai !== undefined ? Boolean(payload.trang_thai) : undefined,
    ngay_bat_dau:
      payload.ngay_bat_dau !== undefined ? payload.ngay_bat_dau || null : undefined,
    ngay_ket_thuc:
      payload.ngay_ket_thuc !== undefined ? payload.ngay_ket_thuc || null : undefined,
  };

  const { data, error } = await supabase
    .from("coupons")
    .update(updateData)
    .eq("ma_giam_gia", id)
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
    .from("coupons")
    .delete()
    .eq("ma_giam_gia", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ ok: true });
});

export default router;