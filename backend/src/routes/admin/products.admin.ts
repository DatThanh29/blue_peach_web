import { Router } from "express";
import { supabase } from "../../lib/supabase";
import { createStockMovement } from "../../lib/stock";

const router = Router();
const LOW_STOCK_THRESHOLD = 5;

type ProductPayload = {
  sku?: string;
  ten_san_pham?: string;
  mo_ta_san_pham?: string | null;
  gia_ban?: number;
  gia_goc?: number | null;
  phan_tram_giam?: number | null;
  so_luong_ton?: number;
  primary_image?: string | null;
  url_san_pham?: string | null;
  ma_danh_muc?: string | null;
  trang_thai_hien_thi?: boolean;
  is_available?: boolean;
  is_bestseller?: boolean;
  is_on_sale?: boolean;
};

function normalizeNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function computeDiscount(giaBan: number, giaGoc?: number | null) {
  if (!giaGoc || giaGoc <= 0 || giaGoc <= giaBan) return 0;
  return Math.round(((giaGoc - giaBan) / giaGoc) * 100);
}

function toPostgrestQuoted(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

router.get("/meta/categories", async (_req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select("ma_danh_muc, ten_danh_muc, mo_ta, trang_thai_hien_thi")
    .order("ten_danh_muc", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

router.get("/", async (req, res) => {
  const limit = Math.max(1, Number(req.query.limit ?? 12));
  const offset = Math.max(0, Number(req.query.offset ?? 0));
  const q = String(req.query.q ?? "").trim();
  const categoryId = String(req.query.categoryId ?? "").trim();
  const visible = String(req.query.visible ?? "").trim();
  const stock = String(req.query.stock ?? "all").trim();

  let query = supabase
    .from("products")
    .select(
      `
      ma_san_pham,
      sku,
      ten_san_pham,
      gia_ban,
      gia_goc,
      phan_tram_giam,
      so_luong_ton,
      primary_image,
      ma_danh_muc,
      trang_thai_hien_thi,
      is_available,
      is_bestseller,
      is_on_sale,
      ngay_tao,
      categories:ma_danh_muc (
        ma_danh_muc,
        ten_danh_muc
      )
    `,
      { count: "exact" }
    )
    .order("ngay_tao", { ascending: false });

  if (q) {
    const pattern = toPostgrestQuoted(`%${q}%`);
    query = query.or(
      `ten_san_pham.ilike.${pattern},sku.ilike.${pattern},mo_ta_san_pham.ilike.${pattern}`
    );
  }

  if (categoryId) {
    query = query.eq("ma_danh_muc", categoryId);
  }

  if (visible === "true") {
    query = query.eq("trang_thai_hien_thi", true);
  } else if (visible === "false") {
    query = query.eq("trang_thai_hien_thi", false);
  }

  if (stock === "low") {
    query = query.gt("so_luong_ton", 0).lte("so_luong_ton", LOW_STOCK_THRESHOLD);
  } else if (stock === "out") {
    query = query.eq("so_luong_ton", 0);
  }

  query = query.range(offset, offset + limit - 1);

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

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.json(data);
});

router.post("/", async (req, res) => {
  const body = (req.body ?? {}) as ProductPayload;

  if (!body.sku?.trim()) {
    return res.status(400).json({ error: "SKU is required" });
  }

  if (!body.ten_san_pham?.trim()) {
    return res.status(400).json({ error: "ten_san_pham is required" });
  }

  const giaBan = normalizeNumber(body.gia_ban, 0);
  const giaGoc =
    body.gia_goc === null || body.gia_goc === undefined
      ? null
      : normalizeNumber(body.gia_goc, 0);
  const soLuongTon = normalizeNumber(body.so_luong_ton, 0);

  const payload = {
    sku: body.sku.trim(),
    ten_san_pham: body.ten_san_pham.trim(),
    mo_ta_san_pham: body.mo_ta_san_pham?.trim() || null,
    gia_ban: giaBan,
    gia_goc: giaGoc,
    phan_tram_giam:
      body.phan_tram_giam !== null && body.phan_tram_giam !== undefined
        ? normalizeNumber(body.phan_tram_giam, 0)
        : computeDiscount(giaBan, giaGoc),
    so_luong_ton: soLuongTon,
    trang_thai_hien_thi: body.trang_thai_hien_thi ?? true,
    is_available: body.is_available ?? soLuongTon > 0,
    is_bestseller: body.is_bestseller ?? false,
    is_on_sale:
      body.is_on_sale ??
      ((body.phan_tram_giam ?? computeDiscount(giaBan, giaGoc)) > 0),
    primary_image: body.primary_image?.trim() || null,
    url_san_pham: body.url_san_pham?.trim() || null,
    ma_danh_muc: body.ma_danh_muc || null,
    ngay_cap_nhat: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (soLuongTon > 0) {
    await createStockMovement({
      ma_san_pham: data.ma_san_pham,
      loai_bien_dong: "initial_stock",
      so_luong_thay_doi: soLuongTon,
      so_luong_truoc: 0,
      so_luong_sau: soLuongTon,
      ghi_chu: "Khởi tạo tồn kho khi tạo sản phẩm",
      ma_nguoi_thuc_hien: req.authUser?.userId ?? null,
    });
  }

  return res.status(201).json({
    ok: true,
    product: data,
  });
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const body = (req.body ?? {}) as ProductPayload;

  const { data: current, error: currentErr } = await supabase
    .from("products")
    .select("gia_ban, gia_goc, so_luong_ton")
    .eq("ma_san_pham", id)
    .maybeSingle();

  if (currentErr) {
    return res.status(500).json({ error: currentErr.message });
  }

  if (!current) {
    return res.status(404).json({ error: "Product not found" });
  }

  const oldStock = Number(current.so_luong_ton ?? 0);

  const patch: Record<string, any> = {
    ngay_cap_nhat: new Date().toISOString(),
  };

  if (body.sku !== undefined) patch.sku = body.sku?.trim();
  if (body.ten_san_pham !== undefined)
    patch.ten_san_pham = body.ten_san_pham?.trim();
  if (body.mo_ta_san_pham !== undefined)
    patch.mo_ta_san_pham = body.mo_ta_san_pham?.trim() || null;
  if (body.primary_image !== undefined)
    patch.primary_image = body.primary_image?.trim() || null;
  if (body.url_san_pham !== undefined)
    patch.url_san_pham = body.url_san_pham?.trim() || null;
  if (body.ma_danh_muc !== undefined) patch.ma_danh_muc = body.ma_danh_muc || null;

  if (body.gia_ban !== undefined) patch.gia_ban = normalizeNumber(body.gia_ban, 0);
  if (body.gia_goc !== undefined) {
    patch.gia_goc =
      body.gia_goc === null ? null : normalizeNumber(body.gia_goc, 0);
  }
  if (body.so_luong_ton !== undefined) {
    patch.so_luong_ton = normalizeNumber(body.so_luong_ton, 0);
  }

  if (body.trang_thai_hien_thi !== undefined)
    patch.trang_thai_hien_thi = body.trang_thai_hien_thi;
  if (body.is_available !== undefined) patch.is_available = body.is_available;
  if (body.is_bestseller !== undefined) patch.is_bestseller = body.is_bestseller;
  if (body.is_on_sale !== undefined) patch.is_on_sale = body.is_on_sale;

  const finalGiaBan =
    patch.gia_ban !== undefined ? Number(patch.gia_ban) : Number(current.gia_ban ?? 0);
  const finalGiaGoc =
    patch.gia_goc !== undefined ? patch.gia_goc : current.gia_goc ?? null;

  if (body.phan_tram_giam !== undefined) {
    patch.phan_tram_giam =
      body.phan_tram_giam === null
        ? 0
        : normalizeNumber(body.phan_tram_giam, 0);
  } else if (body.gia_ban !== undefined || body.gia_goc !== undefined) {
    patch.phan_tram_giam = computeDiscount(
      finalGiaBan,
      finalGiaGoc as number | null
    );
  }

  if (patch.so_luong_ton !== undefined && body.is_available === undefined) {
    patch.is_available = Number(patch.so_luong_ton) > 0;
  }

  if (
    (patch.phan_tram_giam !== undefined ||
      patch.gia_goc !== undefined ||
      patch.gia_ban !== undefined) &&
    body.is_on_sale === undefined
  ) {
    patch.is_on_sale = Number(patch.phan_tram_giam ?? 0) > 0;
  }

  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("ma_san_pham", id)
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (patch.so_luong_ton !== undefined) {
    const newStock = Number(patch.so_luong_ton);
    const delta = newStock - oldStock;

    if (delta !== 0) {
      await createStockMovement({
        ma_san_pham: id,
        loai_bien_dong: "manual_adjust",
        so_luong_thay_doi: delta,
        so_luong_truoc: oldStock,
        so_luong_sau: newStock,
        ghi_chu: "Điều chỉnh tồn kho từ màn hình chỉnh sửa sản phẩm",
        ma_nguoi_thuc_hien: req.authUser?.userId ?? null,
      });
    }
  }

  return res.json({
    ok: true,
    product: data,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("products")
    .update({
      trang_thai_hien_thi: false,
      ngay_cap_nhat: new Date().toISOString(),
    })
    .eq("ma_san_pham", id)
    .select("ma_san_pham, ten_san_pham, trang_thai_hien_thi")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    ok: true,
    product: data,
  });
});

export default router;