import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

router.get("/sessions", async (_req, res) => {
  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("channel", "support")
      .order("created_at", { ascending: false });

    if (sessionsError) {
      return res.status(500).json({ error: sessionsError.message });
    }

    const sessionIds = (sessions || []).map((s) => s.id);

    let latestBySession = new Map<string, any>();

    if (sessionIds.length > 0) {
      const { data: messages, error: messagesError } = await supabase
        .from("chat_messages")
        .select("id, session_id, role, content, metadata, created_at")
        .in("session_id", sessionIds)
        .order("created_at", { ascending: false });

      if (messagesError) {
        return res.status(500).json({ error: messagesError.message });
      }

      for (const msg of messages || []) {
        if (!latestBySession.has(msg.session_id)) {
          latestBySession.set(msg.session_id, msg);
        }
      }
    }

    const items = (sessions || []).map((session: any) => {
      const lastMessage = latestBySession.get(session.id) || null;

      return {
        ...session,
        last_message: lastMessage,
      };
    });

    return res.json({ items });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load admin chat sessions",
    });
  }
});

router.get("/sessions/:id/messages", async (req, res) => {
  try {
    const sessionId = req.params.id;

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("channel", "support")
      .maybeSingle();

    if (sessionError) {
      return res.status(500).json({ error: sessionError.message });
    }

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, session_id, role, content, metadata, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return res.status(500).json({ error: messagesError.message });
    }

    return res.json({
      session,
      items: messages || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot load admin chat messages",
    });
  }
});

router.post("/sessions/:id/messages", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const content =
      typeof req.body?.content === "string" ? req.body.content.trim() : "";

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("channel", "support")
      .maybeSingle();

    if (sessionError) {
      return res.status(500).json({ error: sessionError.message });
    }

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role: "admin",
        content,
        metadata: {
          sender_role: "admin",
          sender_name: req.authUser?.profile?.full_name || req.authUser?.email || "Admin",
          sender_email: req.authUser?.email || null,
          source: "admin_panel",
        },
      })
      .select("id, session_id, role, content, metadata, created_at")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await supabase.from("notifications").insert({
      user_id: session.external_user_id,
      type: "support_reply",
      title: "Admin đã phản hồi",
      message: "Bạn đã nhận được phản hồi mới từ đội ngũ hỗ trợ.",
      link: "/account/chat-admin",
      is_read: false,
    });

    return res.status(201).json({
      ok: true,
      item: data,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Cannot send admin chat message",
    });
  }
});

export default router;