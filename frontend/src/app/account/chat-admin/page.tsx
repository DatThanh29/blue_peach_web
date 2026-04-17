"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AccountShell from "@/components/account/AccountShell";
import Toast from "@/components/Toast";
import {
  getSupportMessages,
  sendSupportMessage,
  type SupportMessage,
} from "@/lib/support.api";

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

export default function AccountChatAdminPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getSupportMessages();
        if (!mounted) return;
        setMessages(res.items || []);
      } catch (error) {
        console.error("[AccountChatAdminPage] load failed:", error);
        if (!mounted) return;
        setMessages([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const emptyState = useMemo(
    () =>
      !loading && messages.length === 0
        ? "Chưa có cuộc trò chuyện nào. Hãy gửi tin nhắn đầu tiên để nhận hỗ trợ từ Blue Peach."
        : null,
    [loading, messages.length]
  );

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;

    try {
      setSending(true);
      const res = await sendSupportMessage(content);
      setMessages((prev) => [...prev, res.item]);
      setInput("");
      setToast({
        message: "Đã gửi tin nhắn tới admin",
        type: "success",
      });
    } catch (error) {
      console.error("[AccountChatAdminPage] send failed:", error);
      setToast({
        message: "Không thể gửi tin nhắn lúc này.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <AccountShell
      title="Chat với Admin"
      description="Trao đổi trực tiếp với đội ngũ hỗ trợ Blue Peach về đơn hàng, tài khoản hoặc sản phẩm bạn đang quan tâm."
    >
      <div className="rounded-[28px] border border-black/8 bg-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
        <div className="border-b border-black/8 px-6 py-5 md:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
            Support Chat
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-black">
            Khu vực hỗ trợ trực tiếp
          </h2>
        </div>

        <div
          ref={messagesRef}
          className="max-h-[520px] space-y-4 overflow-y-auto px-6 py-6 md:px-8"
        >
          {loading ? (
            <p className="text-sm text-black/60">Đang tải hội thoại...</p>
          ) : emptyState ? (
            <div className="rounded-[22px] border border-dashed border-black/10 bg-[#fbfaf7] px-5 py-6 text-sm leading-7 text-black/60">
              {emptyState}
            </div>
          ) : (
            messages.map((message) => {
              const isCustomer = message.role === "customer";

              return (
                <div
                  key={message.id}
                  className={isCustomer ? "ml-auto max-w-[85%]" : "max-w-[88%]"}
                >
                  <div
                    className={[
                      "rounded-[24px] px-4 py-4 text-sm leading-7",
                      isCustomer
                        ? "bg-black text-white"
                        : "border border-[#e8e0d5] bg-[#fbf8f3] text-black/78",
                    ].join(" ")}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>

                  <p
                    className={[
                      "mt-2 text-xs uppercase tracking-[0.14em]",
                      isCustomer ? "text-right text-black/35" : "text-black/35",
                    ].join(" ")}
                  >
                    {isCustomer ? "Bạn" : "Admin"} • {formatTime(message.created_at)}
                  </p>
                </div>
              );
            })
          )}

          {sending ? (
            <div className="ml-auto max-w-[85%]">
              <div className="rounded-[24px] bg-black px-4 py-4 text-sm text-white/85">
                Đang gửi...
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-black/8 px-6 py-4 md:px-8">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder="Nhập nội dung cần hỗ trợ..."
              className="min-h-[92px] flex-1 rounded-[18px] border border-[#e6ddd1] bg-[#fcfbf8] px-4 py-3 text-sm text-black outline-none transition resize-none placeholder:text-black/35 focus:bg-white"
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
              disabled={sending || !input.trim()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black bg-black text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi tin nhắn"
            >
              <SendUpIcon />
            </button>
          </div>
        </div>
      </div>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </AccountShell>
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