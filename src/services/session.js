import { supabase } from "./supabase.js";

export async function getOrCreateSession(userId) {
  const { data: existing, error: findError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("external_user_id", userId)
    .eq("channel", "web")
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      channel: "web",
      external_user_id: userId,
      status: "open",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getRecentMessages(sessionId, limit = 6) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, metadata, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).reverse();
}