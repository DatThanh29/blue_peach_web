import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 50);

    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id, type, title, message, link, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const unreadCount = (data || []).filter((item) => !item.is_read).length;

    return res.json({
      items: data || [],
      unread_count: unreadCount,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load admin notifications",
    });
  }
});

router.post("/mark-read", async (req, res) => {
  try {
    const id = typeof req.body?.id === "string" ? req.body.id.trim() : "";

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { data, error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select("id, is_read")
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
      error: error?.message || "Cannot mark admin notification as read",
    });
  }
});

router.post("/mark-all-read", async (_req, res) => {
  try {
    const { error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot mark all admin notifications as read",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id.trim() : "";

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { error } = await supabase
      .from("admin_notifications")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot delete admin notification",
    });
  }
});

router.delete("/", async (_req, res) => {
  try {
    const { error } = await supabase
      .from("admin_notifications")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot delete all admin notifications",
    });
  }
});

export default router;