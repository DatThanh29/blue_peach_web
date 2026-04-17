import { Router } from "express";
import { supabase } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";

const router = Router();

async function getOrCreateSupportSession(userId: string) {
  const { data: existing, error: existingError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("channel", "support")
    .eq("external_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("chat_sessions")
    .insert({
      channel: "support",
      external_user_id: userId,
      status: "open",
    })
    .select("*")
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  return created;
}

router.get("/session", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const session = await getOrCreateSupportSession(userId);

    return res.json({ session });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load support session",
    });
  }
});

router.get("/messages", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const session = await getOrCreateSupportSession(userId);

    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, session_id, role, content, metadata, created_at")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      session,
      items: data || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load support messages",
    });
  }
});

router.post("/messages", requireAuth, async (req, res) => {
  try {
    const userId = req.authUser!.userId;
    const profile = req.authUser?.profile;
    const content =
      typeof req.body?.content === "string" ? req.body.content.trim() : "";

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const session = await getOrCreateSupportSession(userId);

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: session.id,
        role: "customer",
        content,
        metadata: {
          sender_role: "customer",
          sender_name: profile?.full_name || null,
          sender_email: profile?.email || req.authUser?.email || null,
          source: "customer_account",
        },
      })
      .select("id, session_id, role, content, metadata, created_at")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await supabase
      .from("chat_sessions")
      .update({ status: "open" })
      .eq("id", session.id);

    await supabase.from("admin_notifications").insert({
      type: "support_message",
      title: "Tin nhắn hỗ trợ mới",
      message: `Khách hàng vừa gửi tin nhắn hỗ trợ mới.`,
      link: `/admin/chat?session=${session.id}`,
      is_read: false,
    });

    return res.status(201).json({
      ok: true,
      item: data,
      session,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot send support message",
    });
  }
});

export default router;