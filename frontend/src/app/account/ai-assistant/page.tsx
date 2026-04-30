"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slug";
import AccountShell from "@/components/account/AccountShell";
import { sendMessageToAI, type AIProductSuggestion } from "@/lib/ai.api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: AIProductSuggestion[];
};

function formatPrice(value: number) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export default function AccountAIAssistantPage() {
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
  const nextIdRef = useRef(1);

  const quickPrompts = useMemo(
    () => [
      "Quà sinh nhật cho bạn gái khoảng 700k",
      "Gợi ý dây chuyền nhẹ nhàng dễ tặng",
      "Mẫu bán chạy tầm 500k - 900k",
      "Nếu phải chọn 1 mẫu sang hơn để tặng thì nên chọn gì?",
    ],
    []
  );

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
    <AccountShell
      title="AI tư vấn"
      description="Khu vực tư vấn thông minh của Blue Peach giúp bạn tìm sản phẩm theo ngân sách, mục đích quà tặng, phong cách và các tiêu chí mua sắm thực tế."
    >
      <div className="rounded-[28px] border border-black/8 bg-white/90 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-6">
        <div className="flex flex-wrap gap-3">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isSending}
              className="rounded-full border border-black/10 bg-[#faf7f2] px-4 py-2 text-sm text-black/75 transition hover:bg-[#f3ece2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-black/8 bg-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
        <div className="border-b border-black/8 px-5 py-4 md:px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
            Blue Peach Assistant
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-black">
            Tư vấn sản phẩm theo nhu cầu thật
          </h2>
        </div>

        <div className="space-y-4 px-5 py-5 md:px-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[85%]"
                  : "max-w-[92%]"
              }
            >
              <div
                className={[
                  "rounded-[24px] px-4 py-4 text-sm leading-7",
                  message.role === "user"
                    ? "bg-black text-white"
                    : "border border-black/8 bg-[#faf8f4] text-black/78",
                ].join(" ")}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>

              {message.role === "assistant" && message.products?.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {isSending ? (
            <div className="max-w-[92%]">
              <div className="rounded-[24px] border border-black/8 bg-[#faf8f4] px-4 py-4 text-sm text-black/60">
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

        <div className="border-t border-black/8 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Mình cần quà tặng cho bạn gái khoảng 700k, kiểu nhẹ nhàng..."
              rows={3}
              className="min-h-[90px] flex-1 rounded-[20px] border border-black/10 bg-[#fcfbf8] px-4 py-3 text-sm text-black outline-none transition focus:border-black/20"
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
              className="bp-btn bp-btn--solid h-fit border-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Đang gửi..." : "Gửi cho AI"}
            </button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}