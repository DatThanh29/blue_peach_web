"use client";

import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { sendMessageToAI, type AIProductSuggestion } from "@/lib/ai.api";
import { slugify } from "@/utils/slug";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: AIProductSuggestion[];
};

export type AIAssistantPanelHandle = {
  focusInput: () => void;
};

function formatPrice(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

const AIAssistantPanel = forwardRef<AIAssistantPanelHandle, { compact?: boolean }>(
  function AIAssistantPanel({ compact = false }, ref) {
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chào bạn, mình là AI tư vấn của Blue Peach. Bạn có thể nói nhu cầu như: quà tặng cho bạn gái, ngân sách khoảng 700k, kiểu nhẹ nhàng hoặc muốn xem mẫu bán chạy.",
        products: [],
      },
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promptsOpen, setPromptsOpen] = useState(!compact);

    const nextIdRef = useRef(1);
    const messagesRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => ({
      focusInput() {
        textareaRef.current?.focus();
      },
    }));

    const quickPrompts = useMemo(() => {
      const prompts = [
        "Quà sinh nhật cho bạn gái khoảng 700k",
        "Gợi ý dây chuyền nhẹ nhàng dễ tặng",
        "Mẫu bán chạy tầm 500k - 900k",
        "Nếu phải chọn 1 mẫu sang hơn để tặng thì nên chọn gì?",
      ];

      return compact ? prompts.slice(0, 3) : prompts;
    }, [compact]);

    useEffect(() => {
      const el = messagesRef.current;
      if (!el) return;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }, [messages, isSending]);

    async function handleSend(customMessage?: string) {
      const finalMessage = (customMessage ?? input).trim();
      if (!finalMessage || isSending) return;

      const userMessage: ChatMessage = {
        id: `user-${nextIdRef.current++}`,
        role: "user",
        content: finalMessage,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setError(null);
      setIsSending(true);

      if (compact && promptsOpen) {
        setPromptsOpen(false);
      }

      try {
        const response = await sendMessageToAI(finalMessage);

        const assistantMessage: ChatMessage = {
          id: `assistant-${nextIdRef.current++}`,
          role: "assistant",
          content: response.reply || "Mình chưa có phản hồi phù hợp.",
          products: response.products || [],
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        console.error("[AI Assistant] send failed:", err);
        setError(err?.message || "Không thể gửi tin nhắn tới AI lúc này.");

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${nextIdRef.current++}`,
            role: "assistant",
            content:
              "Xin lỗi, hiện mình chưa kết nối được tới AI tư vấn. Bạn thử lại sau ít phút nhé.",
            products: [],
          },
        ]);
      } finally {
        setIsSending(false);
      }
    }

    return (
      <div
        className={[
          "rounded-[28px] border border-black/8 bg-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.04)]",
          compact ? "overflow-hidden" : "",
        ].join(" ")}
      >
        <div
          className={[
            "border-b border-black/8",
            compact ? "px-4 py-2.5" : "px-4 py-3 md:px-5",
          ].join(" ")}
        >
          <p
            className={[
              "font-semibold uppercase tracking-[0.2em] text-black/45",
              compact ? "text-[10px]" : "text-[11px]",
            ].join(" ")}
          >
            Blue Peach Assistant
          </p>
          <h2
            className={[
              "font-semibold text-black",
              compact ? "mt-1 text-[18px]" : "mt-1.5 text-xl",
            ].join(" ")}
          >
            Tư vấn sản phẩm
          </h2>
        </div>

        <div
          className={[
            "border-b border-black/8",
            compact ? "px-4 py-2.5" : "px-4 py-3 md:px-5",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setPromptsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-[14px] px-1 py-1 text-left transition hover:bg-black/[0.02]"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                Gợi ý nhanh
              </p>
              <p className="mt-1 text-xs text-black/55">
                {promptsOpen
                  ? "Đang hiển thị các câu hỏi mẫu"
                  : `Mở ${quickPrompts.length} câu hỏi mẫu`}
              </p>
            </div>

            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-black/55">
              {promptsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </span>
          </button>

          {promptsOpen ? (
            <div
              className={["mt-3 flex flex-wrap", compact ? "gap-2" : "gap-3"].join(" ")}
            >
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={isSending}
                  className={[
                    "rounded-full border border-black/10 bg-[#faf7f2] text-black/72 transition hover:bg-[#f3ece2] disabled:cursor-not-allowed disabled:opacity-60",
                    compact
                      ? "px-3 py-1.5 text-[12px] leading-5"
                      : "px-4 py-2 text-sm",
                  ].join(" ")}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div
          ref={messagesRef}
          className={[
            "overflow-y-auto px-4 py-4 md:px-5",
            compact ? "max-h-[220px] space-y-3.5" : "max-h-[560px] space-y-4",
          ].join(" ")}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "user" ? "ml-auto max-w-[88%]" : "max-w-[94%]"}
            >
              <div
                className={[
                  "rounded-[24px] px-4 py-4 text-sm leading-7",
                  message.role === "user"
                    ? "bg-black text-white"
                    : "border border-[#e8e0d5] bg-[#fbf8f3] text-black/78",
                ].join(" ")}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>

              {message.role === "assistant" && message.products?.length ? (
                <div
                  className={[
                    "mt-4 grid gap-3",
                    compact ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3",
                  ].join(" ")}
                >
                  {message.products.map((product) => (
                    <Link
                      key={product.ma_san_pham}
                      href={`/products/${slugify(product.ten_san_pham)}-${product.ma_san_pham}`}
                      className="group rounded-[24px] border border-black/8 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.06)]"
                    >
                      <div className="aspect-square overflow-hidden rounded-[18px] bg-[#f5f1ea]">
                        {product.hinh_anh ? (
                          <img
                            src={product.hinh_anh}
                            alt={product.ten_san_pham}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-black/35">
                            Blue Peach
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
                          {product.ten_danh_muc_tam || "Trang sức bạc"}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-black">
                          {product.ten_san_pham}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-black/78">
                          {formatPrice(product.gia_ban)}
                        </p>

                        {product.mo_ta_ngan ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-6 text-black/55">
                            {product.mo_ta_ngan}
                          </p>
                        ) : null}

                        <span className="mt-3 inline-flex rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
                          Xem chi tiết
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {isSending ? (
            <div className="max-w-[94%]">
              <div className="rounded-[24px] border border-[#e8e0d5] bg-[#fbf8f3] px-4 py-4 text-sm text-black/60">
                AI đang phân tích nhu cầu và chọn sản phẩm phù hợp...
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div
          className={[
            "border-t border-black/8",
            compact ? "px-4 py-2.5" : "px-4 py-3 md:px-5",
          ].join(" ")}
        >
          <div className="flex items-end gap-2.5">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Mình cần quà tặng cho bạn gái khoảng 700k..."
              rows={3}
              className={[
                "flex-1 rounded-[18px] border border-[#e6ddd1] bg-[#fcfbf8] px-4 py-3 text-sm text-black outline-none transition resize-none placeholder:text-black/35 focus:border-black/18 focus:bg-white",
                compact ? "min-h-[82px]" : "min-h-[92px]",
              ].join(" ")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isSending || !input.trim()}
              aria-label="Gửi cho AI"
              className={[
                "inline-flex shrink-0 items-center justify-center rounded-full border border-black text-white transition disabled:cursor-not-allowed disabled:opacity-50",
                compact ? "h-10 w-10 bg-black hover:bg-black/90" : "h-11 w-11 bg-black hover:bg-black/90",
              ].join(" ")}
            >
              {isSending ? <LoadingDotsIcon /> : <SendUpIcon />}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default AIAssistantPanel;

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

function LoadingDotsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}