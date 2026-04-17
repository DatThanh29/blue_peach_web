const AI_BASE_URL = process.env.AI_BASE_URL || "http://localhost:5000";

export type AIChatServiceResponse = {
  ok: boolean;
  sessionId?: string;
  reply?: string;
  products?: Array<{
    ma_san_pham: string;
    sku?: string;
    ten_san_pham: string;
    gia_ban: number;
    mo_ta_san_pham?: string;
    mo_ta_ngan?: string;
    hinh_anh?: string | null;
    ten_danh_muc_tam?: string | null;
  }>;
  error?: string;
};

export async function callAIChat(params: {
  userId: string;
  message: string;
}): Promise<AIChatServiceResponse> {
  const response = await fetch(`${AI_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: params.userId,
      message: params.message,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: string }).error || "AI service error")
        : "AI service error";

    throw new Error(message);
  }

  return data as AIChatServiceResponse;
}