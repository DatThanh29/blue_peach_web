import FooterContentPage from "@/components/footer/FooterContentPage";

export default function CareersPage() {
  return (
    <FooterContentPage
      eyebrow="Giới thiệu"
      title="Tuyển dụng tại Blue Peach"
      description="Blue Peach luôn trân trọng những con người yêu cái đẹp, có tinh thần trách nhiệm và mong muốn tạo nên trải nghiệm tốt hơn cho khách hàng qua từng chi tiết nhỏ."
      sections={[
        {
          title: "Môi trường làm việc",
          bullets: [
            "Khuyến khích sự chỉn chu, tinh thần hợp tác và tư duy thẩm mỹ trong công việc.",
            "Tôn trọng sự chủ động, trách nhiệm và khả năng phát triển lâu dài của từng thành viên.",
            "Đề cao trải nghiệm khách hàng như một phần cốt lõi trong mọi vị trí công việc.",
          ],
        },
        {
          title: "Những vị trí phù hợp",
          bullets: [
            "Vận hành bán hàng và chăm sóc khách hàng.",
            "Nội dung, hình ảnh và truyền thông thương hiệu.",
            "Thiết kế, sản phẩm và phát triển bộ sưu tập.",
            "Các vai trò hỗ trợ vận hành website và thương mại điện tử.",
          ],
        },
        {
          title: "Cách ứng tuyển",
          bullets: [
            "Gửi CV hoặc thông tin giới thiệu ngắn về bản thân qua email tuyển dụng của Blue Peach.",
            "Nêu rõ vị trí quan tâm, kinh nghiệm liên quan và lý do bạn muốn đồng hành cùng thương hiệu.",
            "Blue Peach sẽ liên hệ lại nếu hồ sơ phù hợp với nhu cầu tuyển dụng hiện tại.",
          ],
        },
      ]}
      closingTitle="Đồng hành cùng Blue Peach"
      closingText="Chúng tôi tin rằng một thương hiệu đẹp được tạo nên bởi những con người có cùng sự trân trọng với chất lượng, trải nghiệm và giá trị bền vững."
      highlights={[
        "✔ Môi trường làm việc tinh gọn, chỉn chu và đề cao trải nghiệm khách hàng.",
        "✔ Phù hợp với những người yêu thẩm mỹ và thương mại điện tử.",
        "✔ Cơ hội phát triển cùng một thương hiệu đang hoàn thiện mỗi ngày.",
      ]}
      primaryCta={{ href: "/contact", label: "Liên hệ Blue Peach" }}
      secondaryCta={{ href: "/about", label: "Xem thêm về thương hiệu" }}
    />
  );
}