import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const limit = Number(req.query.limit ?? 30);

    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, message, link, is_read, created_at")
      .eq("user_id", userId)
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
      error: error?.message || "Cannot load notifications",
    });
  }
});

router.post("/mark-read", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const id = typeof req.body?.id === "string" ? req.body.id.trim() : "";

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId)
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
      error: error?.message || "Cannot mark notification as read",
    });
  }
});

router.post("/mark-all-read", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot mark all notifications as read",
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const id = typeof req.params.id === "string" ? req.params.id.trim() : "";

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot delete notification",
    });
  }
});

router.delete("/", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot delete all notifications",
    });
  }
});

export default router;