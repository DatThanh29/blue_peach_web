import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

function extractStoragePathFromPublicUrl(url: string) {
  try {
    const parsed = new URL(url);

    // URL public thường có dạng:
    // /storage/v1/object/public/product-images/<path>
    const marker = "/storage/v1/object/public/product-images/";
    const idx = parsed.pathname.indexOf(marker);

    if (idx === -1) return null;

    const rawPath = parsed.pathname.slice(idx + marker.length);
    return decodeURIComponent(rawPath);
  } catch {
    return null;
  }
}

// Lấy ảnh theo product
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("ma_san_pham", productId)
    .order("la_anh_chinh", { ascending: false })
    .order("thu_tu", { ascending: true })
    .order("ngay_tao", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ items: data ?? [] });
});

// Thêm ảnh
router.post("/", async (req, res) => {
  const { ma_san_pham, duong_dan_anh, la_anh_chinh } = req.body as {
    ma_san_pham?: string;
    duong_dan_anh?: string;
    la_anh_chinh?: boolean;
  };

  if (!ma_san_pham || !duong_dan_anh) {
    return res.status(400).json({ error: "Missing ma_san_pham or duong_dan_anh" });
  }

  if (la_anh_chinh) {
    await supabase
      .from("product_images")
      .update({ la_anh_chinh: false })
      .eq("ma_san_pham", ma_san_pham);
  }

  const { data: existingImages } = await supabase
    .from("product_images")
    .select("thu_tu")
    .eq("ma_san_pham", ma_san_pham)
    .order("thu_tu", { ascending: false })
    .limit(1);

  const nextThuTu =
    existingImages && existingImages.length > 0
      ? Number(existingImages[0].thu_tu || 0) + 1
      : 0;

  const { data, error } = await supabase
    .from("product_images")
    .insert([
      {
        ma_san_pham,
        duong_dan_anh,
        la_anh_chinh: !!la_anh_chinh,
        thu_tu: nextThuTu,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data?.la_anh_chinh) {
    await supabase
      .from("products")
      .update({ primary_image: data.duong_dan_anh })
      .eq("ma_san_pham", ma_san_pham);
  }

  res.json(data);
});

// Set ảnh chính
router.patch("/:id/set-primary", async (req, res) => {
  const { id } = req.params;

  const { data: image, error: findError } = await supabase
    .from("product_images")
    .select("*")
    .eq("ma_hinh_anh", id)
    .single();

  if (findError || !image) {
    return res.status(404).json({ error: "Image not found" });
  }

  await supabase
    .from("product_images")
    .update({ la_anh_chinh: false })
    .eq("ma_san_pham", image.ma_san_pham);

  const { data: updatedImage, error: updateError } = await supabase
    .from("product_images")
    .update({ la_anh_chinh: true })
    .eq("ma_hinh_anh", id)
    .select()
    .single();

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  await supabase
    .from("products")
    .update({ primary_image: image.duong_dan_anh })
    .eq("ma_san_pham", image.ma_san_pham);

  res.json({
    ok: true,
    image: updatedImage,
  });
});

// Xoá ảnh: DB + Storage
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: image, error: findError } = await supabase
    .from("product_images")
    .select("*")
    .eq("ma_hinh_anh", id)
    .single();

  if (findError || !image) {
    return res.status(404).json({ error: "Image not found" });
  }

  // 1) Xoá file trong storage nếu parse được path
  const storagePath = extractStoragePathFromPublicUrl(image.duong_dan_anh);

  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([storagePath]);

    // không chặn cứng nếu storage lỗi, nhưng vẫn log để debug
    if (storageError) {
      console.error("Delete storage file failed:", storageError.message);
    }
  } else {
    console.warn("Cannot parse storage path from URL:", image.duong_dan_anh);
  }

  // 2) Xoá row DB
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("ma_hinh_anh", id);

  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  // 3) Nếu xoá ảnh chính, chọn ảnh khác làm primary
  if (image.la_anh_chinh) {
    const { data: nextImage } = await supabase
      .from("product_images")
      .select("*")
      .eq("ma_san_pham", image.ma_san_pham)
      .order("thu_tu", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextImage) {
      await supabase
        .from("product_images")
        .update({ la_anh_chinh: true })
        .eq("ma_hinh_anh", nextImage.ma_hinh_anh);

      await supabase
        .from("products")
        .update({ primary_image: nextImage.duong_dan_anh })
        .eq("ma_san_pham", image.ma_san_pham);
    } else {
      await supabase
        .from("products")
        .update({ primary_image: null })
        .eq("ma_san_pham", image.ma_san_pham);
    }
  }

  res.json({ success: true });
});

export default router;