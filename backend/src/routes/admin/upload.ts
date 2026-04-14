import { Router } from "express";
import multer from "multer";
import { supabase } from "../../lib/supabase";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const ALLOWED_FOLDERS = ["products", "banners"];

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const folder = String(req.query.folder ?? "products").trim();

    if (!file) {
      return res.status(400).json({ error: "No file" });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return res.status(400).json({ error: "Invalid folder" });
    }

    const safeOriginalName = file.originalname.replace(/\s+/g, "-");
    const fileName = `${folder}/${Date.now()}-${safeOriginalName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return res.json({ url: data.publicUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;