import { authFetch } from "./api";

export type AIProductSuggestion = {
  ma_san_pham: string;
  sku?: string;
  ten_san_pham: string;
  gia_ban: number;
  mo_ta_san_pham?: string;
  mo_ta_ngan?: string;
  hinh_anh?: string | null;
  ten_danh_muc_tam?: string | null;
};

export type AIChatResponse = {
  ok: boolean;
  sessionId: string | null;
  reply: string;
  products: AIProductSuggestion[];
};

export async function sendMessageToAI(message: string) {
  return authFetch("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  }) as Promise<AIChatResponse>;
}