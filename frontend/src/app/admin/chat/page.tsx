"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "@/components/Toast";
import {
  getAdminChatMessages,
  getAdminChatSessions,
  sendAdminChatMessage,
  type AdminChatMessage,
  type AdminChatSession,
} from "@/lib/admin-chat.api";

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

function getCustomerLabel(session: AdminChatSession) {
  return session.last_message?.metadata?.sender_email || session.external_user_id;
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<AdminChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSessions() {
      try {
        setSessionsLoading(true);
        const res = await getAdminChatSessions();
        if (!mounted) return;

        const nextSessions = res.items || [];
        setSessions(nextSessions);

        if (!selectedSessionId && nextSessions.length > 0) {
          setSelectedSessionId(nextSessions[0].id);
        }
      } catch (error) {
        console.error("[AdminChatPage] loadSessions failed:", error);
        if (!mounted) return;
        setSessions([]);
      } finally {
        if (mounted) {
          setSessionsLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      mounted = false;
    };
  }, [selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    const sessionId = selectedSessionId;
    let mounted = true;

    async function loadMessages() {
      try {
        setMessagesLoading(true);
        const res = await getAdminChatMessages(sessionId);
        if (!mounted) return;
        setMessages(res.items || []);
      } catch (error) {
        console.error("[AdminChatPage] loadMessages failed:", error);
        if (!mounted) return;
        setMessages([]);
      } finally {
        if (mounted) {
          setMessagesLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      mounted = false;
    };
  }, [selectedSessionId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const selectedSession = useMemo(
    () => sessions.find((item) => item.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  async function handleSend() {
    if (!selectedSessionId) return;

    const sessionId = selectedSessionId;
    const content = input.trim();
    if (!content || sending) return;

    try {
      setSending(true);
      const res = await sendAdminChatMessage(sessionId, content);
      setMessages((prev) => [...prev, res.item]);
      setInput("");
      setToast({
        message: "Đã gửi phản hồi cho khách hàng",
        type: "success",
      });
    } catch (error) {
      console.error("[AdminChatPage] send failed:", error);
      setToast({
        message: "Không thể gửi phản hồi lúc này.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Admin Center
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Chat hỗ trợ
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500">
            Quản lý các cuộc trò chuyện hỗ trợ từ khách hàng và phản hồi trực tiếp từ trang quản trị.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">Danh sách hội thoại</h2>
            </div>

            <div className="max-h-[680px] overflow-y-auto">
              {sessionsLoading ? (
                <div className="px-5 py-6 text-sm text-zinc-500">Đang tải hội thoại...</div>
              ) : sessions.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-500">
                  Chưa có cuộc trò chuyện nào.
                </div>
              ) : (
                sessions.map((session) => {
                  const active = session.id === selectedSessionId;

                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className={[
                        "block w-full border-b border-zinc-100 px-5 py-4 text-left transition",
                        active ? "bg-zinc-900 text-white" : "bg-white hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold">
                          {getCustomerLabel(session)}
                        </p>
                        <span
                          className={[
                            "text-[11px] uppercase tracking-[0.14em]",
                            active ? "text-white/70" : "text-zinc-400",
                          ].join(" ")}
                        >
                          {session.status}
                        </span>
                      </div>

                      <p
                        className={[
                          "mt-2 line-clamp-2 text-sm leading-6",
                          active ? "text-white/78" : "text-zinc-500",
                        ].join(" ")}
                      >
                        {session.last_message?.content || "Chưa có tin nhắn"}
                      </p>

                      <p
                        className={[
                          "mt-3 text-xs uppercase tracking-[0.14em]",
                          active ? "text-white/55" : "text-zinc-400",
                        ].join(" ")}
                      >
                        {session.last_message?.created_at
                          ? formatTime(session.last_message.created_at)
                          : formatTime(session.created_at)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-zinc-900">
                {selectedSession
                  ? `Hội thoại với ${getCustomerLabel(selectedSession)}`
                  : "Chọn một hội thoại"}
              </h2>
            </div>

            <div
              ref={messagesRef}
              className="max-h-[560px] min-h-[420px] space-y-4 overflow-y-auto px-6 py-6"
            >
              {!selectedSessionId ? (
                <p className="text-sm text-zinc-500">Chưa chọn hội thoại nào.</p>
              ) : messagesLoading ? (
                <p className="text-sm text-zinc-500">Đang tải tin nhắn...</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-zinc-500">Chưa có tin nhắn nào trong hội thoại này.</p>
              ) : (
                messages.map((message) => {
                  const isAdmin = message.role === "admin";

                  return (
                    <div
                      key={message.id}
                      className={isAdmin ? "ml-auto max-w-[80%]" : "max-w-[85%]"}
                    >
                      <div
                        className={[
                          "rounded-[22px] px-4 py-4 text-sm leading-7",
                          isAdmin
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-200 bg-zinc-50 text-zinc-700",
                        ].join(" ")}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>

                      <p
                        className={[
                          "mt-2 text-xs uppercase tracking-[0.14em]",
                          isAdmin ? "text-right text-zinc-400" : "text-zinc-400",
                        ].join(" ")}
                      >
                        {isAdmin ? "Admin" : "Khách hàng"} • {formatTime(message.created_at)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-zinc-200 px-6 py-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Nhập phản hồi cho khách hàng..."
                  disabled={!selectedSessionId}
                  className="min-h-[92px] flex-1 rounded-[18px] border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition resize-none placeholder:text-zinc-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!selectedSessionId || sending || !input.trim()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gửi phản hồi"
                >
                  <SendUpIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}

function SendUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}