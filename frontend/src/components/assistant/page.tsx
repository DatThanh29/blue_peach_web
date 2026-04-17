"use client";

import AccountShell from "@/components/account/AccountShell";
import AIAssistantPanel from "@/components/assistant/AIAssistantPanel";

export default function AccountAIAssistantPage() {
  return (
    <AccountShell
      title="AI tư vấn"
      description="Khu vực tư vấn thông minh của Blue Peach giúp bạn tìm sản phẩm theo ngân sách, mục đích quà tặng, phong cách và các tiêu chí mua sắm thực tế."
    >
      <AIAssistantPanel />
    </AccountShell>
  );
}